import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("pystep_session");
  const isAuthenticated = !!sessionCookie?.value;

  // Redirect legacy /welcome route directly to /learn
  if (pathname.startsWith("/welcome")) {
    return NextResponse.redirect(new URL("/learn", request.url));
  }

  // Admin protection
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      if (isAuthenticated) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    if (!isAuthenticated) {
      const adminLoginUrl = new URL("/admin/login", request.url);
      adminLoginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(adminLoginUrl);
    }
  }

  // Protected routes: /learn, /certificate
  const isProtectedRoute =
    pathname.startsWith("/learn") ||
    pathname.startsWith("/certificate");

  // If trying to access protected route without session, redirect to /auth
  if (isProtectedRoute && !isAuthenticated) {
    const authUrl = new URL("/auth", request.url);
    authUrl.searchParams.set("from", pathname);
    authUrl.searchParams.set("mode", "signup");
    return NextResponse.redirect(authUrl);
  }

  // If already logged in and visiting /auth, redirect to /learn
  if (pathname === "/auth" && isAuthenticated) {
    return NextResponse.redirect(new URL("/learn", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/learn/:path*", "/welcome/:path*", "/certificate/:path*", "/auth", "/admin/:path*"],
};
