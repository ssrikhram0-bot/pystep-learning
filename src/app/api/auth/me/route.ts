import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        progress: true,
      },
    });

    if (!user) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        selectedMascot: user.selectedMascot,
        role: (user as { role?: string }).role || (user.name === "admin" ? "admin" : "user"),
        xp: user.xp,
        streak: user.streak,
        level: user.level,
        hearts: user.hearts,
        completedStepIds: user.progress.map((p) => p.stepId),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error";
    return NextResponse.json({ authenticated: false, error: message }, { status: 500 });
  }
}
