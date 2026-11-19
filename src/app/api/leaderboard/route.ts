import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sortBy = searchParams.get("sort") || "xp"; // 'xp', 'streak', 'steps'
    const search = searchParams.get("search")?.trim().toLowerCase() || "";
    const filter = searchParams.get("filter") || "all"; // 'all', 'completed', 'active'

    // Check current logged in user session
    const session = await getSession();
    const currentUserId = session?.userId || null;

    // Fetch users with their progress (exclude admin accounts)
    const users = await prisma.user.findMany({
      where: {
        AND: [
          { role: { not: "admin" } },
          { name: { not: "admin" } },
          { name: { not: "Admin" } },
          { name: { not: "ADMIN" } },
          { name: { not: "Administrator" } },
          { name: { not: "ผู้ดูแลระบบ" } },
        ],
      },
      select: {
        id: true,
        name: true,
        selectedMascot: true,
        xp: true,
        streak: true,
        level: true,
        role: true,
        createdAt: true,
        progress: {
          select: {
            stepId: true,
            completedAt: true,
          },
        },
      },
    });

    // Map and calculate stats
    let mapped = users.map((u) => {
      const completedStepsCount = u.progress.length;
      const isCertified = completedStepsCount >= 24;
      return {
        id: u.id,
        name: u.name,
        mascot: u.selectedMascot || "StarPy",
        xp: u.xp,
        streak: u.streak || 1,
        level: u.level || 1,
        role: u.role,
        completedSteps: completedStepsCount,
        isCertified,
        joinedDate: u.createdAt,
      };
    });

    // Filter by completed if requested
    if (filter === "completed") {
      mapped = mapped.filter((u) => u.isCertified);
    }

    // Sort according to requested metric
    if (sortBy === "streak") {
      mapped.sort((a, b) => b.streak - a.streak || b.xp - a.xp);
    } else if (sortBy === "steps") {
      mapped.sort((a, b) => b.completedSteps - a.completedSteps || b.xp - a.xp);
    } else {
      // Default: sort by XP
      mapped.sort((a, b) => b.xp - a.xp || b.completedSteps - a.completedSteps);
    }

    // Assign overall rank before search filtering so rank is absolute
    const rankedAll = mapped.map((u, idx) => ({
      ...u,
      rank: idx + 1,
    }));

    // Find current user rank
    let currentUserRank = null;
    if (currentUserId) {
      currentUserRank = rankedAll.find((u) => u.id === currentUserId) || null;
    }

    // Filter by search query if any
    let finalUsers = rankedAll;
    if (search) {
      finalUsers = rankedAll.filter((u) =>
        u.name.toLowerCase().includes(search)
      );
    }

    // Take top 100
    const top100 = finalUsers.slice(0, 100);

    return NextResponse.json({
      success: true,
      totalLearners: rankedAll.length,
      certifiedCount: rankedAll.filter((u) => u.isCertified).length,
      sortBy,
      filter,
      currentUser: currentUserRank,
      podium: rankedAll.slice(0, 3), // Top 3 always for podium display
      leaderboard: top100,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error";
    console.error("Leaderboard API Error:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
