import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminToken, ADMIN_COOKIE } from "@/lib/admin-auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get(ADMIN_COOKIE)?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    try {
      await verifyAdminToken(token);
      return NextResponse.next();
    } catch {
      const res = NextResponse.redirect(new URL("/admin/login", req.url));
      res.cookies.delete(ADMIN_COOKIE);
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
