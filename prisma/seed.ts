import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import xlsx from "xlsx";

const prisma = new PrismaClient();

type Difficulty = "EASY" | "NORMAL" | "HARD" | "INSANE" | "EXTREME";

type ParsedLevel = {
  rank: number;
  name: string;
  creator: string;
  difficulty: Difficulty;
  durationSeconds: number;
  recordRequirement: string;
  victors: string[];
};

// Map tier names from Excel to difficulty enum
function mapTierToDifficulty(tier: string | undefined): Difficulty {
  if (!tier) return "EXTREME";

  const tierLower = tier.toLowerCase();

  // Easy tiers
  if (["beginner", "easy", "medium"].includes(tierLower)) return "EASY";

  // Normal/Hard tiers
  if (["hard", "very hard"].includes(tierLower)) return "HARD";

  // Insane tier
  if (tierLower === "insane") return "INSANE";

  // Everything else is EXTREME (Monstrous, Merciless, Excruciating, Inexorable, Fuck, etc.)
  return "EXTREME";
}

function loadLevelsFromXlsx(filePath: string): ParsedLevel[] {
  if (!fs.existsSync(filePath)) {
    console.log(`Excel file not found at ${filePath}`);
    return [];
  }

  console.log(`Loading levels from ${filePath}`);
  const workbook = xlsx.readFile(filePath);
  const firstSheet = workbook.SheetNames[0];
  const raw = xlsx.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[firstSheet]);

  return raw
    .filter((row) => row.__EMPTY && row.Placement) // Must have level name and placement
    .map((row) => {
      const rank = Number(row.Placement);
      const name = String(row.__EMPTY).trim();
      const tier = String(row.Tier || "Extreme").trim();
      const victorString = String(row.Victors || "").trim();
      const numVictors = Number(row["N° victors"] || 1);

      // Parse victors - handle both comma-separated and single names
      const victorList = victorString
        .split(/,|;/)
        .map((v) => v.trim())
        .filter((v) => v.length > 0);

      // Estimate duration based on difficulty
      const difficulty = mapTierToDifficulty(tier);
      const durationSeconds =
        difficulty === "EXTREME"
          ? Math.random() * 300 + 600 // 10-15 minutes
          : difficulty === "INSANE"
            ? Math.random() * 180 + 300 // 5-8 minutes
            : difficulty === "HARD"
              ? Math.random() * 120 + 180 // 3-5 minutes
              : 120; // 2 minutes for easy/normal

      return {
        rank,
        name,
        creator: "Uruguay Community",
        difficulty,
        durationSeconds: Math.floor(durationSeconds),
        recordRequirement: "100%",
        victors: victorList.length > 0 ? victorList : ["Player"],
      };
    })
    .sort((a, b) => a.rank - b.rank);
}

async function main() {
  try {
    // Look for Excel file in project root or prisma/data folder
    let xlsxPath = path.join(process.cwd(), "Extreme demon completions in Uruguay.xlsx");
    if (!fs.existsSync(xlsxPath)) {
      xlsxPath = path.join(process.cwd(), "prisma", "data", "uydl.xlsx");
    }

    const parsedLevels = loadLevelsFromXlsx(xlsxPath);

    // If no Excel data, use fallback
    if (parsedLevels.length === 0) {
      console.log("No Excel data found. Using fallback seed data.");
    }

    const levels: ParsedLevel[] =
      parsedLevels.length > 0
        ? parsedLevels
        : Array.from({ length: 75 }, (_, idx) => ({
            rank: idx + 1,
            name: `UY Demon ${idx + 1}`,
            creator: "Uruguay Community",
            difficulty: idx < 10 ? "EXTREME" : idx < 30 ? "INSANE" : idx < 50 ? "HARD" : "NORMAL",
            durationSeconds: 600 + idx * 10,
            recordRequirement: "100%",
            victors: [`Player ${idx + 1}`],
          }));

    console.log(`Seeding database with ${levels.length} levels...`);

    // Test connection first
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log("✓ Database connection successful");
    } catch (error) {
      console.error("✗ Database connection failed:", error);
      throw error;
    }

    // Clear existing data
    try {
      console.log("Clearing existing records...");
      const deletedRecords = await prisma.record.deleteMany();
      console.log(`  Deleted ${deletedRecords.count} records`);

      console.log("Clearing existing levels...");
      const deletedLevels = await prisma.level.deleteMany();
      console.log(`  Deleted ${deletedLevels.count} levels`);

      console.log("Clearing existing users...");
      const deletedUsers = await prisma.user.deleteMany();
      console.log(`  Deleted ${deletedUsers.count} users`);
    } catch (error) {
      console.warn("⚠ Could not clear existing data (tables may be already clear):", error instanceof Error ? error.message : error);
    }

    // Create admin user
    console.log("Creating admin user...");
    const adminPassword = await bcrypt.hash("Admin1234!", 12);
    const admin = await prisma.user.create({
      data: {
        email: "admin@uydl.gg",
        passwordHash: adminPassword,
        role: "ADMIN",
        discord: "uyadmin#0001",
      },
    });

    console.log("✓ Admin user created:", admin.email);

    // Create levels and records
    let levelsCreated = 0;
    let recordsCreated = 0;

    console.log("Creating levels and records...");

    for (const level of levels) {
      const createdLevel = await prisma.level.create({
        data: {
          rank: level.rank,
          name: level.name,
          creator: level.creator,
          difficulty: level.difficulty,
          durationSeconds: level.durationSeconds,
          recordRequirement: level.recordRequirement,
          thumbnailUrl: `https://img.youtube.com/vi/placeholder-${level.rank}/maxresdefault.jpg`,
          // Keep these for backward compatibility if schema still expects them
          videoUrl: "https://youtu.be/placeholder",
          description: `A challenging demon level: ${level.name}`,
          points: Math.max(1, 301 - level.rank * 2),
        },
      });

      levelsCreated++;

      // Create records for each victor
      for (const victor of level.victors) {
        await prisma.record.create({
          data: {
            levelId: createdLevel.id,
            playerName: victor,
            proofUrl: `https://youtu.be/proof-${level.rank}-${victor.replace(/\s+/g, "-")}`,
            status: "APPROVED",
            recordedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Random date in last 90 days
            userId: admin.id,
          },
        });
        recordsCreated++;
      }

      if (levelsCreated % 25 === 0) {
        console.log(`  Progress: ${levelsCreated}/${levels.length} levels created...`);
      }
    }

    console.log(`\n✓ Seeding complete!`);
    console.log(`  📊 Levels created: ${levelsCreated}`);
    console.log(`  🏆 Records created: ${recordsCreated}`);
    console.log(`  👤 Admin email: ${admin.email}`);
  } catch (error) {
    console.error("\n✗ Seeding failed:");
    console.error(error instanceof Error ? error.message : error);
    throw error;
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
