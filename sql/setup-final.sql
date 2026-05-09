-- UYDL Database Setup SQL - Version Simplificada
-- Solo agrega Foreign Keys e Índices (los constraints ya existen)

-- ============================================
-- FOREIGN KEYS
-- ============================================

ALTER TABLE records 
ADD CONSTRAINT records_level_id_fkey 
FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE;

ALTER TABLE records 
ADD CONSTRAINT records_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

-- ============================================
-- CREATE INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS levels_rank_difficulty_idx ON levels(rank, difficulty);

CREATE INDEX IF NOT EXISTS records_status_recorded_at_idx ON records(status, recorded_at);

CREATE INDEX IF NOT EXISTS records_level_id_idx ON records(level_id);

-- ============================================
-- VERIFICACIÓN - Ejecuta esto para confirmar
-- ============================================

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

-- Contar datos
SELECT 'users' as table_name, COUNT(*) as rows FROM users
UNION ALL
SELECT 'levels' as table_name, COUNT(*) as rows FROM levels
UNION ALL
SELECT 'records' as table_name, COUNT(*) as rows FROM records;
