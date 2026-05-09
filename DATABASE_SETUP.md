# UYDL Database Setup Guide

## Current Status
- ✅ Excel file found: `Extreme demon completions in Uruguay.xlsx` (178 levels)
- ✅ Seed script created: `prisma/seed.ts`
- ❌ Supabase connection failing: "FATAL: Tenant or user not found"

## Options to Fix

### Option 1: Create New Supabase Project (Recommended)
1. Go to https://supabase.com
2. Create a new project
3. Copy the Connection String (Database URL)
4. Update `.env` with new `DATABASE_URL`
5. Run: `npx prisma db push`
6. Run: `npx tsx prisma/seed.ts`

### Option 2: Use Free PostgreSQL Hosting
- **Render.com**: Free PostgreSQL tier (https://render.com)
- **Railway.app**: $5 starter credit
- **Vercel Postgres**: Free tier available

### Option 3: Seed Data Without Live Connection
If you want to test the UI with seed data without database:
1. Update `.env` to point to a working PostgreSQL
2. All 178 levels will be imported with:
   - Proper difficulty tiers mapped
   - All victors as approved records
   - Random recordedAt dates (last 90 days)

## Current Excel Data Summary
- Total Levels: 178
- Tier Distribution:
  - Beginner/Easy/Medium (EASY)
  - Hard/Very Hard (HARD)
  - Insane (INSANE)
  - Monstrous/Merciless/Excruciating/etc (EXTREME)
- All have approved victors from the sheet

## Seed Script Details
The `prisma/seed.ts` script will:
1. ✅ Parse Excel file automatically
2. ✅ Map tier names to difficulty enums
3. ✅ Create Level records with all fields
4. ✅ Create Record entries for each victor
5. ✅ Create admin user: `admin@uydl.gg` / `Admin1234!`

## Next Steps
1. Verify Supabase project is active or create new project
2. Update DATABASE_URL in `.env`
3. Run `npx prisma db push` to sync schema
4. Run `npx tsx prisma/seed.ts` to import data

Contact: github.com/damian091489860
