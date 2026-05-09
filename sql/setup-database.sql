-- UYDL Database Setup SQL
-- Ejecuta este código en Supabase SQL Editor si las tablas no tienen enums, foreign keys o índices

-- ============================================
-- 1. CREATE ENUMS (si no existen)
-- ============================================

CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'EDITOR', 'PLAYER');

CREATE TYPE "RecordStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

CREATE TYPE "Difficulty" AS ENUM ('EASY', 'NORMAL', 'HARD', 'INSANE', 'EXTREME');

-- ============================================
-- 2. ALTER TABLES / ADD CONSTRAINTS
-- ============================================

-- Agregar UNIQUE constraint en email
ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email);

-- Cambiar tipo de columna role a enum (si es text)
ALTER TABLE users ALTER COLUMN role TYPE "UserRole" USING role::"UserRole";

-- Agregar UNIQUE constraint en rank
ALTER TABLE levels ADD CONSTRAINT levels_rank_key UNIQUE (rank);

-- Cambiar tipo de columna difficulty a enum (si es text)
ALTER TABLE levels ALTER COLUMN difficulty TYPE "Difficulty" USING difficulty::"Difficulty";

-- Cambiar tipo de columna status a enum (si es text)
ALTER TABLE records ALTER COLUMN status TYPE "RecordStatus" USING status::"RecordStatus";

-- ============================================
-- 3. ADD FOREIGN KEYS
-- ============================================

-- Foreign key: records.level_id -> levels.id
ALTER TABLE records 
ADD CONSTRAINT records_level_id_fkey 
FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE;

-- Foreign key: records.user_id -> users.id
ALTER TABLE records 
ADD CONSTRAINT records_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

-- ============================================
-- 4. CREATE INDEXES
-- ============================================

-- Index para filtrar por difficulty
CREATE INDEX levels_rank_difficulty_idx ON levels(rank, difficulty);

-- Index para filtrar records por status y fecha
CREATE INDEX records_status_recorded_at_idx ON records(status, recorded_at);

-- Index para búsquedas rápidas por level_id
CREATE INDEX records_level_id_idx ON records(level_id);

-- ============================================
-- VERIFICACIÓN: Ejecuta esto para confirmar
-- ============================================

-- Ver estructura de users
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Ver estructura de levels
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'levels'
ORDER BY ordinal_position;

-- Ver estructura de records
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'records'
ORDER BY ordinal_position;

-- Ver foreign keys
SELECT constraint_name, table_name, column_name
FROM information_schema.key_column_usage
WHERE table_name IN ('users', 'levels', 'records')
AND constraint_name LIKE '%fkey%'
ORDER BY table_name;

-- Ver índices
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename IN ('users', 'levels', 'records')
AND indexname NOT LIKE 'pg_toast%';
