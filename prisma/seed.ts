import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import xlsx from "xlsx";

const prisma = new PrismaClient();

type ParsedLevel = {
  rank: number;
  name: string;
  creator: string;
  videoUrl: string;
  description: string;
  points: number;
};

function loadLevelsFromXlsx(filePath: string): ParsedLevel[] {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const workbook = xlsx.readFile(filePath);
  const firstSheet = workbook.SheetNames[0];
  const raw = xlsx.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[firstSheet]);

  return raw
    .map((row, index) => ({
      rank: Number(row.rank ?? row.Rank ?? index + 1),
      name: String(row.name ?? row.Name ?? `Level ${index + 1}`),
      creator: String(row.creator ?? row.Creator ?? "Unknown"),
      videoUrl: String(row.video_url ?? row.videoUrl ?? row.Video ?? "https://youtu.be/placeholder"),
      description: String(row.description ?? row.Description ?? "Sin descripción"),
      points: Number(row.points ?? row.Points ?? Math.max(1, 151 - (index + 1) * 2)),
    }))
    .filter((level) => level.rank >= 1 && level.rank <= 75)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 75);
}

async function main() {
  const xlsxPath = path.join(process.cwd(), "prisma", "data", "uydl.xlsx");
  const parsedLevels = loadLevelsFromXlsx(xlsxPath);

  const levels: ParsedLevel[] =
    parsedLevels.length > 0
      ? parsedLevels
      : Array.from({ length: 75 }, (_, idx) => ({
          rank: idx + 1,
          name: `UY Demon ${idx + 1}`,
          creator: "UY Creator",
          videoUrl: "https://youtu.be/placeholder",
          description: "Nivel de ejemplo generado automáticamente para seed inicial.",
          points: Math.max(1, 200 - idx * 2),
        }));

  await prisma.record.deleteMany();
  await prisma.level.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash("Admin1234!", 12);

  const admin = await prisma.user.create({
    data: {
      email: "admin@uydl.gg",
      passwordHash: adminPassword,
      role: "ADMIN",
      discord: "uyadmin#0001",
    },
  });

  for (const level of levels) {
    await prisma.level.create({
      data: {
        rank: level.rank,
        name: level.name,
        creator: level.creator,
        videoUrl: level.videoUrl,
        description: level.description,
        points: level.points,
      },
    });
  }

  const top1 = await prisma.level.findUnique({ where: { rank: 1 } });
  if (top1) {
    await prisma.record.create({
      data: {
        levelId: top1.id,
        playerName: "UY Player",
        videoUrl: "https://youtu.be/approved-record",
        rawFootage: "https://drive.google.com/raw-footage",
        status: "APPROVED",
        userId: admin.id,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
