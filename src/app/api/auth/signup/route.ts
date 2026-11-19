import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSessionToken, AUTH_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phoneNumber, identifier, password, selectedMascot } = body;

    // Determine actual email or phone number from input
    let cleanEmail: string | null = null;
    let cleanPhone: string | null = null;

    if (email) {
      cleanEmail = email.trim().toLowerCase();
    } else if (identifier && identifier.includes("@")) {
      cleanEmail = identifier.trim().toLowerCase();
    }

    if (phoneNumber) {
      cleanPhone = phoneNumber.trim();
    } else if (identifier && !identifier.includes("@")) {
      cleanPhone = identifier.trim();
    }

    if (!cleanEmail && !cleanPhone) {
      return NextResponse.json(
        { success: false, error: "กรุณาระบุอีเมลหรือเบอร์โทรศัพท์" },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร" },
        { status: 400 }
      );
    }

    const displayName = (name && name.trim()) || (cleanEmail ? cleanEmail.split("@")[0] : "Learner");

    // Check existing user
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          ...(cleanEmail ? [{ email: cleanEmail }] : []),
          ...(cleanPhone ? [{ phoneNumber: cleanPhone }] : []),
        ],
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: "บัญชีนี้เคยลงทะเบียนแล้ว กรุณาเข้าสู่ระบบ",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name: displayName,
        email: cleanEmail,
        phoneNumber: cleanPhone,
        password: hashedPassword,
        selectedMascot: selectedMascot || "StarPy",
        xp: 0,
        streak: 1,
        level: 1,
        hearts: 5,
      },
    });

    const token = createSessionToken({
      userId: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      selectedMascot: user.selectedMascot,
    });

    const response = NextResponse.json({
      success: true,
      message: "ลงทะเบียนสมาชิกสำเร็จ ยินดีต้อนรับสู่ PyStep!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        selectedMascot: user.selectedMascot,
        xp: user.xp,
        streak: user.streak,
        level: user.level,
      },
    });

    response.cookies.set(AUTH_COOKIE.name, token, AUTH_COOKIE.options);
    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการลงทะเบียน";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
