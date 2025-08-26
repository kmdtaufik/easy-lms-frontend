// middleware.js - Fixed version
import { authClient } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    const session = await authClient.getSession({
      query: {
        disableCookieCache: true,
      },
    });
    try {
      // Check if user exists and is admin
      if (!session || !session.user || session.user.role !== "admin") {
        console.log("Unauthorized admin access attempt:", {
          pathname,
          userRole: session?.user?.role || "no session",
        });
        return NextResponse.redirect(new URL("/", request.url));
      }

      // User is admin, allow access
      console.log(
        "Admin access granted:",
        session.user.email || session.user.id,
      );
      return NextResponse.next();
    } catch (error) {
      console.error("Auth verification failed:", error);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
