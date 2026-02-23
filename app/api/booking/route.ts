import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, eventType, eventDate, message } = await req.json();

    if (!name || !email || !phone || !eventType || !eventDate) {
      return NextResponse.json({ error: "Please fill in all required fields" }, { status: 400 });
    }

    const booking = await prisma.booking.create({
      data: { name, email, phone, eventType, eventDate, message },
    });

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    console.error("Booking POST error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Booking GET error:", error);
    return NextResponse.json([], { status: 200 });
  }
}