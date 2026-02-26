// app/api/inquiry/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
      include: { venue: true },
    });

    // Extract venues from inquiries that have one, with submitter info attached
    const venues = inquiries
      .filter((i: any) => i.venue !== null && i.venue !== undefined)
      .map((i: any) => ({
        ...i.venue,
        id: i.venue.id,                        // ensure id is always present
        inquiryFullName: i.fullName,
        inquiryEmail: i.email,
        inquiryEventType: i.eventType,
      }));

    return NextResponse.json({ inquiries, venues });
  } catch (error) {
    console.error("INQUIRY GET ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch inquiries." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, eventType, preferredDate, message } = body;

    if (!fullName || !email || !eventType) {
      return NextResponse.json(
        { error: "fullName, email, and eventType are required." },
        { status: 400 }
      );
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        fullName,
        email,
        phone: phone ?? null,
        eventType,
        preferredDate: preferredDate ?? null,
        message: message ?? null,
        status: "pending",
      },
    });

    return NextResponse.json(inquiry, { status: 201 });
  } catch (error) {
    console.error("INQUIRY POST ERROR:", error);
    return NextResponse.json({ error: "Failed to create inquiry." }, { status: 500 });
  }
}