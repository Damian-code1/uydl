import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const existing = await prisma.record.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ error: "Record no encontrado" }, { status: 404 });
  }

  const record = await prisma.record.update({
    where: { id: params.id },
    data: { status: "APPROVED" },
  });

  return NextResponse.json({ ok: true, record });
}
