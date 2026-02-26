// app/api/venue/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const venues = await prisma.venue.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(venues);
  } catch (error) {
    console.error("VENUE GET ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch venues." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { inquiryId, venueName, address, city, notes, lat, lng } = body;

    if (!inquiryId || !venueName) {
      return NextResponse.json(
        { error: "inquiryId and venueName are required." },
        { status: 400 }
      );
    }

    const venue = await prisma.venue.create({
      data: {
        inquiryId: parseInt(inquiryId),
        venueName,
        address: address ?? null,
        city: city ?? null,
        notes: notes ?? null,
        lat: lat ?? null,
        lng: lng ?? null,
      },
    });

    return NextResponse.json(venue, { status: 201 });
  } catch (error) {
    console.error("VENUE POST ERROR:", error);
    return NextResponse.json({ error: "Failed to create venue." }, { status: 500 });
  }
}