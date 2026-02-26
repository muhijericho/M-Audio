// middleware.ts — place at project root next to package.json
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "change-this-secret-in-production"
);

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Protect Admin routes
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const payload = await verifyToken(token);

    if (!payload || payload.role !== "ADMIN") {
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.delete("auth-token");
      return res;
    }
  }

  // ── Protect Client routes
  if (pathname.startsWith("/client") && !pathname.startsWith("/client/login")) {
    const token = req.cookies.get("client-token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/client/login", req.url));
    }

    const payload = await verifyToken(token);

    if (!payload || payload.role !== "CLIENT") {
      const res = NextResponse.redirect(new URL("/client/login", req.url));
      res.cookies.delete("client-token");
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/client/:path*"],
};