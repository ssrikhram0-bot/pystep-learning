import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const body = await req.json();
    const { stepId, xp = 100 } = body;

    if (!stepId || typeof stepId !== "number") {
      return NextResponse.json({ success: false, error: "Invalid stepId" }, { status: 400 });
    }

    // If user is authenticated, record into database
    if (session) {
      await prisma.userProgress.upsert({
        where: {
          userId_stepId: {
            userId: session.userId,
            stepId: stepId,
          },
        },
        create: {
          userId: session.userId,
          stepId: stepId,
          xpEarned: xp,
        },
        update: {
          xpEarned: xp,
          completedAt: new Date(),
        },
      });

      // Update total XP of user
      const allProgress = await prisma.userProgress.findMany({
        where: { userId: session.userId },
      });
      const totalXp = allProgress.reduce((sum, p) => sum + p.xpEarned, 0);

      await prisma.user.update({
        where: { id: session.userId },
        data: {
          xp: totalXp,
          level: Math.floor(totalXp / 500) + 1,
        },
      });

      return NextResponse.json({
        success: true,
        message: "บันทึกผลการเรียนลงฐานข้อมูล SQLite (Prisma) เรียบร้อยแล้ว",
        data: {
          userId: session.userId,
          stepId,
          totalXp,
          completedCount: allProgress.length,
          savedAt: new Date().toISOString(),
        },
      });
    }

    // Guest fallback
    return NextResponse.json({
      success: true,
      message: "Guest progress acknowledged",
      data: {
        stepId,
        xp,
        savedAt: new Date().toISOString(),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ authenticated: false, progress: [] });
    }

    const progress = await prisma.userProgress.findMany({
      where: { userId: session.userId },
      orderBy: { stepId: "asc" },
    });

    return NextResponse.json({
      authenticated: true,
      userId: session.userId,
      progress,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
