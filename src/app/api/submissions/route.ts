import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { submissionSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const payload = await request.json();
    const parsed = submissionSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos", details: parsed.error.flatten() }, { status: 400 });
    }

    const level = await prisma.level.findUnique({ where: { id: parsed.data.levelId } });
    if (!level) {
      return NextResponse.json({ error: "Nivel no encontrado" }, { status: 404 });
    }

    const created = await prisma.record.create({
      data: {
        levelId: parsed.data.levelId,
        playerName: parsed.data.playerName,
        videoUrl: parsed.data.videoUrl,
        rawFootage: parsed.data.rawFootage,
        status: "PENDING",
        userId: session?.user?.id,
      },
    });

    return NextResponse.json({ ok: true, id: created.id });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
