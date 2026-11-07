import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_COOKIE_NAME = "pystep_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "pystep-secret-jwt-key-2026-safe-production";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

interface SessionData {
  userId: string;
  name: string;
  email?: string | null;
  phoneNumber?: string | null;
  role?: string;
  selectedMascot: string;
}

export function createSessionToken(data: SessionData): string {
  const payload = JSON.stringify({ ...data, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 });
  const hmac = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
  return Buffer.from(payload).toString("base64url") + "." + hmac;
}

export function verifySessionToken(token: string): SessionData | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [payloadB64, hmac] = parts;
    const payload = Buffer.from(payloadB64, "base64url").toString("utf-8");
    const expectedHmac = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
    if (hmac !== expectedHmac) return null;

    const data = JSON.parse(payload);
    if (data.exp && Date.now() > data.exp) return null;
    return {
      userId: data.userId,
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      role: data.role || (data.name === "admin" ? "admin" : "user"),
      selectedMascot: data.selectedMascot,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export const AUTH_COOKIE = {
  name: SESSION_COOKIE_NAME,
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  },
};
