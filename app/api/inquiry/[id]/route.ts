// app/api/inquiry/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { status } = await req.json();
    const inquiry = await prisma.inquiry.update({
      where: { id: parseInt(id) },
      data: { status },
    });
    return NextResponse.json(inquiry);
  } catch (error) {
    console.error("INQUIRY PATCH ERROR:", error);
    return NextResponse.json({ error: "Failed to update inquiry." }, { status: 500 });
  }
}

export async function DELETE(
  _: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await prisma.inquiry.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("INQUIRY DELETE ERROR:", error);
    return NextResponse.json({ error: "Failed to delete inquiry." }, { status: 500 });
  }
}