# SQL Setup para Supabase

He generado el SQL completo que necesitas ejecutar en caso de que falten cosas.

## 📍 Ubicación
`sql/setup-database.sql`

## 🚀 Cómo Ejecutar

1. **Abre Supabase Dashboard** → Tu proyecto
2. **Ve a SQL Editor** (esquina inferior izquierda)
3. **Click en "New query"**
4. **Copiar todo el contenido de `sql/setup-database.sql`**
5. **Pega en el SQL Editor**
6. **Click en "Run"** (botón azul)

## ✅ Qué hace el SQL

### 1️⃣ Crea ENUMS (tipos de datos)
```sql
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'EDITOR', 'PLAYER');
CREATE TYPE "RecordStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'NORMAL', 'HARD', 'INSANE', 'EXTREME');
```

### 2️⃣ Agrega Constraints
- Email único en users
- Rank único en levels
- Convierte columnas a tipos ENUM

### 3️⃣ Agrega Foreign Keys
- `records.level_id` → `levels.id` (ON DELETE CASCADE)
- `records.user_id` → `users.id` (ON DELETE SET NULL)

### 4️⃣ Crea Índices (para performance)
- `levels(rank, difficulty)` - búsquedas rápidas
- `records(status, recorded_at)` - filtros rápidos
- `records(level_id)` - relaciones rápidas

## 📋 Verificación

El script incluye queries de verificación al final para confirmar que todo está correcto.

## ⚠️ Si hay errores

Si algún constraint ya existe, Supabase dirá algo como:
```
ERROR: constraint "users_email_key" already exists
```

En ese caso, **simplemente ignora ese error** - significa que ya estaba creado.

---

Ejecuta el SQL y luego corre:
```bash
npm run dev
```

¡Los 173 niveles deberían aparecer en http://localhost:3000! 🎮
