import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { levelEditSchema } from "@/lib/validators";
export const dynamic = 'force-dynamic';

function clampRank(rank: number) {
  return Math.max(1, Math.min(75, rank));
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const payload = await request.json();

    const current = await prisma.level.findUnique({ where: { id: params.id } });
    if (!current) {
      return NextResponse.json({ error: "Nivel no encontrado" }, { status: 404 });
    }

    const merged = {
      rank: typeof payload.rank === "number" ? payload.rank : current.rank,
      name: payload.name ?? current.name,
      creator: payload.creator ?? current.creator,
      videoUrl: payload.videoUrl ?? current.videoUrl,
      description: payload.description ?? current.description,
      points: typeof payload.points === "number" ? payload.points : current.points,
    };

    const parsed = levelEditSchema.safeParse({ ...merged, rank: clampRank(merged.rank) });
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos", details: parsed.error.flatten() }, { status: 400 });
    }

    const targetRank = clampRank(parsed.data.rank);
    const oldRank = current.rank;

    await prisma.$transaction(async (tx) => {
      if (targetRank !== oldRank) {
        if (targetRank < oldRank) {
          await tx.level.updateMany({
            where: {
              rank: { gte: targetRank, lt: oldRank },
              id: { not: current.id },
            },
            data: {
              rank: {
                increment: 1,
              },
            },
          });
        } else {
          await tx.level.updateMany({
            where: {
              rank: { gt: oldRank, lte: targetRank },
              id: { not: current.id },
            },
            data: {
              rank: {
                decrement: 1,
              },
            },
          });
        }
      }

      await tx.level.update({
        where: { id: current.id },
        data: {
          rank: targetRank,
          name: parsed.data.name,
          creator: parsed.data.creator,
          videoUrl: parsed.data.videoUrl,
          description: parsed.data.description,
          points: parsed.data.points,
        },
      });
    });

    const updated = await prisma.level.findUnique({ where: { id: params.id } });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
