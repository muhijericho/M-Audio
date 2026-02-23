import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Set a simple cookie to mark as logged in
  const response = NextResponse.json({ success: true });
  response.cookies.set("auth", "true", {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });

  return response;
}