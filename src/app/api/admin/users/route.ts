import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { hashPassword } from "@/lib/auth";

export async function GET(req: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim().toLowerCase() || "";
    const roleFilter = searchParams.get("role") || "all";
    const statusFilter = searchParams.get("status") || "all"; // 'all', 'certificate', 'in_progress'
    const mascotFilter = searchParams.get("mascot") || "all";

    const users = await prisma.user.findMany({
      include: {
        progress: {
          select: { stepId: true, completedAt: true, xpEarned: true },
          orderBy: { stepId: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    let filtered = users;

    // Search filter
    if (search) {
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(search) ||
          (u.email && u.email.toLowerCase().includes(search)) ||
          (u.phoneNumber && u.phoneNumber.includes(search))
      );
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }

    // Mascot filter
    if (mascotFilter !== "all") {
      filtered = filtered.filter((u) => u.selectedMascot === mascotFilter);
    }

    // Status filter
    if (statusFilter === "certificate") {
      filtered = filtered.filter((u) => u.progress.length >= 24);
    } else if (statusFilter === "in_progress") {
      filtered = filtered.filter((u) => u.progress.length < 24);
    }

    const sanitizedUsers = filtered.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phoneNumber: u.phoneNumber,
      role: u.role || (u.name === "admin" ? "admin" : "user"),
      selectedMascot: u.selectedMascot,
      xp: u.xp,
      streak: u.streak,
      level: u.level,
      hearts: u.hearts,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
      completedStepsCount: u.progress.length,
      isCertificateUnlocked: u.role !== "admin" && u.name !== "admin" && u.progress.length >= 24,
      completedStepIds: u.progress.map((p) => p.stepId),
    }));

    return NextResponse.json({
      success: true,
      users: sanitizedUsers,
      totalCount: sanitizedUsers.length,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load users";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      name,
      email,
      phoneNumber,
      password,
      role = "user",
      selectedMascot = "StarPy",
      xp = 0,
      level = 1,
      streak = 1,
      hearts = 5,
      unlockCertificate = false,
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: "กรุณาระบุชื่อผู้ใช้" }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร" },
        { status: 400 }
      );
    }

    // Check if email or phone already exists
    if (email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: email.trim().toLowerCase() },
      });
      if (existingEmail) {
        return NextResponse.json(
          { success: false, error: "อีเมลนี้ถูกใช้งานแล้วในระบบ" },
          { status: 409 }
        );
      }
    }

    if (phoneNumber) {
      const existingPhone = await prisma.user.findUnique({
        where: { phoneNumber: phoneNumber.trim() },
      });
      if (existingPhone) {
        return NextResponse.json(
          { success: false, error: "เบอร์โทรศัพท์นี้ถูกใช้งานแล้วในระบบ" },
          { status: 409 }
        );
      }
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email ? email.trim().toLowerCase() : null,
        phoneNumber: phoneNumber ? phoneNumber.trim() : null,
        password: hashedPassword,
        role: role === "admin" ? "admin" : "user",
        selectedMascot,
        xp: Number(xp) || 0,
        level: Number(level) || 1,
        streak: Number(streak) || 1,
        hearts: Number(hearts) || 5,
      },
    });

    // If unlock certificate requested, add all 24 progress steps
    if (unlockCertificate) {
      for (let stepId = 1; stepId <= 24; stepId++) {
        await prisma.userProgress.create({
          data: {
            userId: newUser.id,
            stepId,
            xpEarned: 100,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "สร้างบัญชีผู้ใช้ใหม่เรียบร้อยแล้ว",
      user: newUser,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create user";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
