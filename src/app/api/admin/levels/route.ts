import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const levels = await prisma.level.findMany({
      orderBy: { rank: "asc" },
      take: 75,
    });

    return NextResponse.json(levels);
  } catch {
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json([]);
    }
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
