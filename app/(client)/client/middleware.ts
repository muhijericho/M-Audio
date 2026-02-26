// middleware.ts  (place this in the root of your Next.js project)
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "change-this-secret-in-production"
);

// Routes that require client authentication
const CLIENT_PROTECTED = ["/client/dashboard", "/client/booking", "/client/profile"];
const ADMIN_PROTECTED  = ["/admin/dashboard"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Client routes ────────────────────────────────────────────────
  if (CLIENT_PROTECTED.some((p) => pathname.startsWith(p))) {
    const token = req.cookies.get("client-token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/client/login", req.url));
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      if (payload.role !== "CLIENT") throw new Error("Not a client");
    } catch {
      const res = NextResponse.redirect(new URL("/client/login", req.url));
      res.cookies.delete("client-token");
      return res;
    }
  }

  // ── Admin routes ─────────────────────────────────────────────────
  if (ADMIN_PROTECTED.some((p) => pathname.startsWith(p))) {
    const token = req.cookies.get("auth-token")?.value; // your existing admin cookie name

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      await jwtVerify(token, JWT_SECRET);
    } catch {
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.delete("auth-token");
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/client/:path*", "/admin/:path*"],
};