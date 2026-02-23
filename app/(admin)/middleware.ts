import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const auth = req.cookies.get("auth")?.value;

  if (!auth && req.nextUrl.pathname.startsWith("/admin/dashboard")) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};