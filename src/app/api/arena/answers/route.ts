import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// POST: save a single answer (or bulk for admin)
export async function POST(req: Request) {
  const session = await getSession();
  const body = await req.json();
  const { questionId, selectedOption, isCorrect, explanation, bulk } = body;

  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthenticated" }, { status: 401 });
  }

  // If admin, allow bulk insert of full 15 answers
  if (session.role === "admin" && Array.isArray(bulk)) {
    const bulkData = bulk.map((a: any) => ({
      userId: session.userId,
      questionId: a.questionId,
      selectedOption: String(a.selectedOption ?? ""),
      isCorrect: Boolean(a.isCorrect),
      explanation: a.explanation ?? "",
    }));
    await prisma.arenaAnswer.createMany({ data: bulkData, skipDuplicates: true });
    return NextResponse.json({ success: true, savedCount: bulkData.length });
  }

  // Normal single answer upsert
  await prisma.arenaAnswer.upsert({
    where: { userId_questionId: { userId: session.userId, questionId } },
    create: {
      userId: session.userId,
      questionId,
      selectedOption: String(selectedOption ?? ""),
      isCorrect: Boolean(isCorrect),
      explanation: explanation ?? "",
    },
    update: {
      selectedOption: String(selectedOption ?? ""),
      isCorrect: Boolean(isCorrect),
      explanation: explanation ?? "",
    },
  });

  return NextResponse.json({ success: true });
}

// GET: retrieve all answers of the current user
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ authenticated: false, answers: [] });
  }
  const answers = await prisma.arenaAnswer.findMany({
    where: { userId: session.userId },
    orderBy: { questionId: "asc" },
  });
  return NextResponse.json({ authenticated: true, answers });
}
