import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    let targetId = userId;
    if (!targetId) {
      const session = await getSession();
      if (session) {
        targetId = session.userId;
      }
    }

    if (!targetId) {
      return NextResponse.json(
        { success: false, error: "กรุณาระบุรหัสผู้เรียน หรือเข้าสู่ระบบก่อน" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: targetId },
      include: {
        progress: {
          select: { stepId: true, completedAt: true },
          orderBy: { stepId: "asc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "ไม่พบข้อมูลผู้เรียนนี้ในระบบ" },
        { status: 404 }
      );
    }

    const completedStepIds = user.progress.map((p) => p.stepId);
    const isCompletedAll = completedStepIds.length >= 24;

    // Latest completion date
    const lastProgress = user.progress[user.progress.length - 1];
    const completionDate = lastProgress?.completedAt || user.updatedAt;

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        xp: user.xp,
        completedStepIds,
        isCompletedAll,
        completionDate,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
