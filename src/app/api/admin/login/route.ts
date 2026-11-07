import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSessionToken, hashPassword, AUTH_COOKIE } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    const trimmedUser = (username || "").trim();
    const trimmedPass = (password || "").trim();

    if (!trimmedUser || !trimmedPass) {
      return NextResponse.json(
        { success: false, error: "กรุณาระบุชื่อผู้ใช้และรหัสผ่าน" },
        { status: 400 }
      );
    }

    // Find admin user by name or email
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { name: trimmedUser },
          { email: trimmedUser.toLowerCase() },
          { email: "admin@pystep.com" },
        ],
      },
    });

    // If logging in with the designated admin credentials ("admin" / "admin123")
    // and no admin exists yet in database, auto-initialize admin
    if (!user && trimmedUser === "admin" && trimmedPass === "admin123") {
      const hashedPassword = await hashPassword("admin123");
      user = await prisma.user.create({
        data: {
          name: "admin",
          email: "admin@pystep.com",
          phoneNumber: "080-000-0000",
          password: hashedPassword,
          role: "admin",
          xp: 9999,
          level: 10,
          streak: 99,
          hearts: 5,
          selectedMascot: "StarPy",
        },
      });
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: "ไม่พบชื่อผู้ใช้งานนี้ในระบบ" },
        { status: 404 }
      );
    }

    // Verify role
    if (user.role !== "admin" && user.name !== "admin") {
      return NextResponse.json(
        { success: false, error: "บัญชีนี้ไม่มีสิทธิ์เข้าถึงระบบผู้ดูแลระบบ (Admin Only)" },
        { status: 403 }
      );
    }

    // Verify password
    const isMatch = await verifyPassword(trimmedPass, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง" },
        { status: 401 }
      );
    }

    // Create session token with admin role
    const token = createSessionToken({
      userId: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: "admin",
      selectedMascot: user.selectedMascot,
    });

    const response = NextResponse.json({
      success: true,
      message: "เข้าสู่ระบบผู้ดูแลระบบสำเร็จ",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: "admin",
        selectedMascot: user.selectedMascot,
      },
    });

    response.cookies.set(AUTH_COOKIE.name, token, AUTH_COOKIE.options);
    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการเข้าสู่ระบบ";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
