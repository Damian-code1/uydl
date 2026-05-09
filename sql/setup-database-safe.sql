-- UYDL Database Setup SQL (Sin ENUMs - evita conflictos)
-- Ejecuta este código si los ENUMs ya existen

-- ============================================
-- CONSTRAINTS Y ALTERACIONES
-- ============================================

-- Agregar UNIQUE constraint en email (si no existe)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'users_email_key' AND table_name = 'users'
    ) THEN
        ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email);
    END IF;
END $$;

-- Agregar UNIQUE constraint en rank (si no existe)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'levels_rank_key' AND table_name = 'levels'
    ) THEN
        ALTER TABLE levels ADD CONSTRAINT levels_rank_key UNIQUE (rank);
    END IF;
END $$;

-- Convertir columna role a enum si es texto
-- ALTER TABLE users ALTER COLUMN role TYPE "UserRole" USING role::"UserRole";

-- Convertir columna difficulty a enum si es texto
-- ALTER TABLE levels ALTER COLUMN difficulty TYPE "Difficulty" USING difficulty::"Difficulty";

-- Convertir columna status a enum si es texto
-- ALTER TABLE records ALTER COLUMN status TYPE "RecordStatus" USING status::"RecordStatus";

-- ============================================
-- FOREIGN KEYS (si no existen)
-- ============================================

BEGIN;

-- Intentar agregar foreign key: records.level_id -> levels.id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'records_level_id_fkey'
    ) THEN
        ALTER TABLE records 
        ADD CONSTRAINT records_level_id_fkey 
        FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Intentar agregar foreign key: records.user_id -> users.id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'records_user_id_fkey'
    ) THEN
        ALTER TABLE records 
        ADD CONSTRAINT records_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
    END IF;
END $$;

COMMIT;

-- ============================================
-- CREATE INDEXES (si no existen)
-- ============================================

CREATE INDEX IF NOT EXISTS levels_rank_difficulty_idx ON levels(rank, difficulty);

CREATE INDEX IF NOT EXISTS records_status_recorded_at_idx ON records(status, recorded_at);

CREATE INDEX IF NOT EXISTS records_level_id_idx ON records(level_id);

-- ============================================
-- VERIFICACIÓN
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

-- Ver foreign keys creadas
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
