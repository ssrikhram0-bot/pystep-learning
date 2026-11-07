import { getSession } from "@/lib/auth";

export async function requireAdmin() {
  const session = await getSession();
  if (!session) return null;
  if (session.role === "admin" || session.name === "admin") {
    return session;
  }
  return null;
}
