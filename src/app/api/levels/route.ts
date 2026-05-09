import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const levels = await prisma.level.findMany({
      orderBy: { rank: "asc" },
      include: {
        records: {
          where: { status: "APPROVED" },
          select: { playerName: true },
        },
      },
      take: 75,
    });

    return NextResponse.json(
      levels.map((level) => ({
        id: level.id,
        rank: level.rank,
        name: level.name,
        creator: level.creator,
        videoUrl: level.videoUrl,
        description: level.description,
        points: level.points,
        victors: level.records.map((record) => record.playerName),
      })),
    );
  } catch {
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json([]);
    }

    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
