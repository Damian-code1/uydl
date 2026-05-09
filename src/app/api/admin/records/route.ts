import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const records = await prisma.record.findMany({
      where: { status: "PENDING" },
      include: {
        level: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { timestamp: "desc" },
    });

    return NextResponse.json(
      records.map((record) => ({
        id: record.id,
        playerName: record.playerName,
        videoUrl: record.videoUrl,
        levelName: record.level.name,
      })),
    );
  } catch {
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json([]);
    }
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
