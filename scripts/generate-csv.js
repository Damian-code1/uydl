const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");
const { v4: uuidv4 } = require("uuid");

// Map tier names to difficulty
function mapTierToDifficulty(tier) {
  if (!tier) return "EXTREME";
  const tierLower = tier.toLowerCase();
  if (["beginner", "easy", "medium"].includes(tierLower)) return "EASY";
  if (["hard", "very hard"].includes(tierLower)) return "HARD";
  if (tierLower === "insane") return "INSANE";
  return "EXTREME";
}

// Load Excel file
const excelPath = path.join(process.cwd(), "Extreme demon completions in Uruguay.xlsx");
const workbook = xlsx.readFile(excelPath);
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const rawData = xlsx.utils.sheet_to_json(worksheet);

console.log(`📊 Loaded ${rawData.length} rows from Excel`);

// Parse levels
const levels = rawData
  .filter((row) => row.__EMPTY && row.Placement)
  .map((row) => {
    const rank = Number(row.Placement);
    const name = String(row.__EMPTY).trim();
    const tier = String(row.Tier || "Extreme").trim();
    const victorString = String(row.Victors || "").trim();

    const victorList = victorString
      .split(/,|;/)
      .map((v) => v.trim())
      .filter((v) => v.length > 0);

    const difficulty = mapTierToDifficulty(tier);
    const durationSeconds =
      difficulty === "EXTREME"
        ? Math.floor(Math.random() * 300 + 600)
        : difficulty === "INSANE"
          ? Math.floor(Math.random() * 180 + 300)
          : difficulty === "HARD"
            ? Math.floor(Math.random() * 120 + 180)
            : 120;

    return {
      rank,
      name,
      creator: "Uruguay Community",
      difficulty,
      durationSeconds,
      recordRequirement: "100%",
      videoUrl: "https://youtu.be/placeholder",
      description: `A challenging demon level: ${name}`,
      points: Math.max(1, 301 - rank * 2),
      thumbnailUrl: `https://img.youtube.com/vi/placeholder-${rank}/maxresdefault.jpg`,
      victors: victorList,
    };
  })
  .sort((a, b) => a.rank - b.rank);

console.log(`✓ Parsed ${levels.length} levels`);

// Generate IDs
const adminId = uuidv4();
const levelIds = {};
levels.forEach((level) => {
  levelIds[level.rank] = uuidv4();
});

// Create users CSV
const usersCsvHeaders = ["id", "email", "password_hash", "role", "discord", "created_at", "updated_at"];
const bcrypt = require("bcryptjs");
const adminPasswordHash = "$2a$12$vI8aWBYW2e9Vt.tIemZzeO7DlH.PKZbv5H8KnzzQgXXbVNruy.pFm"; // bcrypt("Admin1234!", 12)
const adminRow = [adminId, "admin@uydl.gg", adminPasswordHash, "ADMIN", "uyadmin#0001", new Date().toISOString(), new Date().toISOString()];

const usersContent = [
  usersCsvHeaders.join(","),
  adminRow.join(",")
].join("\n");

// Create levels CSV
const levelsCsvHeaders = [
  "id",
  "rank",
  "name",
  "creator",
  "video_url",
  "description",
  "points",
  "difficulty",
  "duration_seconds",
  "record_requirement",
  "thumbnail_url",
  "created_at",
  "updated_at",
];
const levelsRows = levels.map((level) => [
  levelIds[level.rank],
  level.rank,
  `"${level.name.replace(/"/g, '""')}"`, // Escape quotes
  `"${level.creator}"`,
  level.videoUrl,
  `"${level.description.replace(/"/g, '""')}"`,
  level.points,
  level.difficulty,
  level.durationSeconds,
  level.recordRequirement,
  level.thumbnailUrl,
  new Date().toISOString(),
  new Date().toISOString(),
]);

const levelsContent = [
  levelsCsvHeaders.join(","),
  ...levelsRows.map((row) => row.join(","))
].join("\n");

// Create records CSV
const recordsCsvHeaders = [
  "id",
  "status",
  "proof_url",
  "player_name",
  "recorded_at",
  "level_id",
  "user_id",
];
const recordsRows = [];
let recordCount = 0;

levels.forEach((level) => {
  level.victors.forEach((victor) => {
    const recordedAt = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);
    recordsRows.push([
      uuidv4(),
      "APPROVED",
      `https://youtu.be/proof-${level.rank}-${victor.replace(/\s+/g, "-")}`,
      `"${victor}"`,
      recordedAt.toISOString(),
      levelIds[level.rank],
      adminId,
    ]);
    recordCount++;
  });
});

const recordsContent = [
  recordsCsvHeaders.join(","),
  ...recordsRows.map((row) => row.join(","))
].join("\n");

// Write CSV files
const outputDir = path.join(process.cwd(), "csv-import");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(path.join(outputDir, "users.csv"), usersContent);
fs.writeFileSync(path.join(outputDir, "levels.csv"), levelsContent);
fs.writeFileSync(path.join(outputDir, "records.csv"), recordsContent);

console.log(`\n✓ CSV files generated in ${outputDir}/`);
console.log(`  📋 users.csv: 1 admin user`);
console.log(`  📋 levels.csv: ${levels.length} levels`);
console.log(`  📋 records.csv: ${recordCount} approved records`);
console.log(`\n📤 Import order (in Supabase):`);
console.log(`  1. users.csv → users table`);
console.log(`  2. levels.csv → levels table`);
console.log(`  3. records.csv → records table`);
