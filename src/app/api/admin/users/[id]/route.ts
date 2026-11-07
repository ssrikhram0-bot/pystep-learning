import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { hashPassword } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        progress: {
          orderBy: { stepId: "asc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        selectedMascot: user.selectedMascot,
        xp: user.xp,
        streak: user.streak,
        level: user.level,
        hearts: user.hearts,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        completedSteps: user.progress,
        isCertificateUnlocked: user.progress.length >= 24,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching user";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const {
      name,
      email,
      phoneNumber,
      password,
      role,
      selectedMascot,
      xp,
      level,
      streak,
      hearts,
      action, // 'unlock_all_steps', 'reset_progress'
    } = body;

    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: { progress: true },
    });

    if (!existingUser) {
      return NextResponse.json({ success: false, error: "ไม่พบผู้ใช้นี้ในระบบ" }, { status: 404 });
    }

    // Special bulk actions for testing/admin convenience
    if (action === "unlock_all_steps") {
      // Create userProgress for all 24 steps
      for (let stepId = 1; stepId <= 24; stepId++) {
        await prisma.userProgress.upsert({
          where: {
            userId_stepId: {
              userId: id,
              stepId,
            },
          },
          update: { xpEarned: 100 },
          create: {
            userId: id,
            stepId,
            xpEarned: 100,
          },
        });
      }

      await prisma.user.update({
        where: { id },
        data: {
          xp: Math.max(existingUser.xp, 2400),
          level: Math.max(existingUser.level, 5),
        },
      });

      return NextResponse.json({
        success: true,
        message: "ปลดล็อกบทเรียนครบทั้ง 24 Step เรียบร้อยแล้ว (ได้รับใบประกาศนียบัตร)",
      });
    }

    if (action === "reset_progress") {
      await prisma.userProgress.deleteMany({
        where: { userId: id },
      });

      await prisma.user.update({
        where: { id },
        data: {
          xp: 0,
          level: 1,
          streak: 1,
          hearts: 5,
        },
      });

      return NextResponse.json({
        success: true,
        message: "รีเซ็ตความคืบหน้าของบทเรียนเรียบร้อยแล้ว",
      });
    }

    // Standard field updates
    const updateData: Record<string, unknown> = {};

    if (name !== undefined) updateData.name = name.trim();
    if (email !== undefined) updateData.email = email ? email.trim().toLowerCase() : null;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber ? phoneNumber.trim() : null;
    if (role !== undefined) updateData.role = role === "admin" ? "admin" : "user";
    if (selectedMascot !== undefined) updateData.selectedMascot = selectedMascot;
    if (xp !== undefined) updateData.xp = Number(xp);
    if (level !== undefined) updateData.level = Number(level);
    if (streak !== undefined) updateData.streak = Number(streak);
    if (hearts !== undefined) updateData.hearts = Number(hearts);

    if (password && password.trim().length >= 6) {
      updateData.password = await hashPassword(password.trim());
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "อัปเดตข้อมูลผู้ใช้สำเร็จ",
      user: updatedUser,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update user";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Prevent admin from deleting themselves
    if (admin.userId === id) {
      return NextResponse.json(
        { success: false, error: "ไม่อนุญาตให้ลบบัญชีผู้ดูแลระบบที่กำลังใช้งานอยู่" },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "ลบบัญชีผู้ใช้งานเรียบร้อยแล้ว",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete user";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
