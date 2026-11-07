import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSessionToken, AUTH_COOKIE } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, phoneNumber, identifier, password } = body;

    let searchEmail: string | null = null;
    let searchPhone: string | null = null;

    if (email) {
      searchEmail = email.trim().toLowerCase();
    } else if (identifier && identifier.includes("@")) {
      searchEmail = identifier.trim().toLowerCase();
    }

    if (phoneNumber) {
      searchPhone = phoneNumber.trim();
    } else if (identifier && !identifier.includes("@")) {
      searchPhone = identifier.trim();
    }

    const rawIdentifier = (identifier || email || phoneNumber || "").trim();
    if (!rawIdentifier) {
      return NextResponse.json(
        { success: false, error: "กรุณาระบุชื่อผู้ใช้ อีเมล หรือเบอร์โทรศัพท์" },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { success: false, error: "กรุณาระบุรหัสผ่าน" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(searchEmail ? [{ email: searchEmail }] : []),
          ...(searchPhone ? [{ phoneNumber: searchPhone }] : []),
          { name: rawIdentifier },
          { email: rawIdentifier.toLowerCase() },
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "ไม่พบบัญชีผู้ใช้นี้ กรุณาตรวจสอบข้อมูลหรือสมัครสมาชิกใหม่" },
        { status: 404 }
      );
    }

    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง" },
        { status: 401 }
      );
    }

    const token = createSessionToken({
      userId: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: (user as { role?: string }).role || (user.name === "admin" ? "admin" : "user"),
      selectedMascot: user.selectedMascot,
    });

    const response = NextResponse.json({
      success: true,
      message: "เข้าสู่ระบบสำเร็จ",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: (user as { role?: string }).role || (user.name === "admin" ? "admin" : "user"),
        selectedMascot: user.selectedMascot,
        xp: user.xp,
        streak: user.streak,
        level: user.level,
      },
    });

    response.cookies.set(AUTH_COOKIE.name, token, AUTH_COOKIE.options);
    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการเข้าสู่ระบบ";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
