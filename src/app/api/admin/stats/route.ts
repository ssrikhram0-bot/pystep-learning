import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      include: {
        progress: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const totalUsers = users.length;
    const learners = users.filter((u) => u.role !== "admin" && u.name !== "admin");
    const totalAdmins = users.length - learners.length;
    const regularLearners = learners.length;

    // Learners with >= 24 steps
    const certificateUsers = learners.filter((u) => u.progress.length >= 24);
    const totalCertificates = certificateUsers.length;

    // Total steps completed across learners
    const totalStepsCompleted = learners.reduce((acc, u) => acc + u.progress.length, 0);

    // Total XP & Averages for learners
    const totalXp = learners.reduce((acc, u) => acc + (u.xp || 0), 0);
    const averageXp = regularLearners > 0 ? Math.round(totalXp / regularLearners) : 0;
    const averageStreak = regularLearners > 0 ? Math.round(learners.reduce((acc, u) => acc + (u.streak || 0), 0) / regularLearners) : 0;

    // Mascot Distribution (learners)
    const mascotCountMap: Record<string, number> = {};
    learners.forEach((u) => {
      const m = u.selectedMascot || "StarPy";
      mascotCountMap[m] = (mascotCountMap[m] || 0) + 1;
    });

    const mascotDistribution = Object.entries(mascotCountMap).map(([mascot, count]) => ({
      mascot,
      count,
      percentage: regularLearners > 0 ? Math.round((count / regularLearners) * 100) : 0,
    }));

    // Step Completion Funnel (Steps 1 to 24)
    const stepFunnel = Array.from({ length: 24 }, (_, i) => {
      const stepId = i + 1;
      const count = users.filter((u) => u.progress.some((p) => p.stepId === stepId)).length;
      return {
        stepId,
        count,
        percentage: totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0,
      };
    });

    // Level Distribution
    const levelMap: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    users.forEach((u) => {
      const lvl = Math.min(6, Math.max(1, u.level || 1));
      levelMap[lvl] = (levelMap[lvl] || 0) + 1;
    });

    const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
    const isMySQL = dbUrl.startsWith("mysql://");

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalAdmins,
        regularLearners,
        totalCertificates,
        totalStepsCompleted,
        totalXp,
        averageXp,
        averageStreak,
        completionRate: regularLearners > 0 ? Math.round((totalCertificates / regularLearners) * 100) : 0,
        databaseProvider: isMySQL ? "MySQL" : "SQLite",
        dbUrlDisplay: isMySQL ? dbUrl.replace(/:[^:@]*@/, ":***@") : "SQLite (file:./dev.db)",
      },
      mascotDistribution,
      levelDistribution: Object.entries(levelMap).map(([lvl, count]) => ({
        level: `Level ${lvl}`,
        count,
      })),
      stepFunnel,
      recentUsers: users.slice(0, 6).map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        mascot: u.selectedMascot,
        xp: u.xp,
        level: u.level,
        completedSteps: u.progress.length,
        createdAt: u.createdAt,
      })),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load stats";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
