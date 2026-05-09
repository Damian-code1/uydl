# Uruguay Demon List (UYDL)

Stack principal:

- Next.js 14 (App Router) + TypeScript
- PostgreSQL (Supabase) + Prisma ORM
- NextAuth.js (Discord OAuth + Credentials con bcrypt)
- Framer Motion + Lucide React
- TanStack Query + Fuse.js
- Shadcn-style UI sobre Radix UI
- Resend para correos HTML de registro

## Arquitectura

Estructura aplicada:

- `src/app/(auth)` login y registro
- `src/app/(admin)` panel admin protegido por middleware
- `src/app/api` endpoints para levels, submissions, auth y administración
- `src/components/ui` componentes base
- `src/components/list` lista de niveles animada
- `src/hooks` lógica de búsqueda y filtrado
- `prisma/schema.prisma` modelos User, Level, Record

## Modelos Prisma

- `User`: role (`ADMIN | EDITOR | PLAYER`), email, password hash, discord
- `Level`: rank, name, creator, video_url, description, points
- `Record`: status (`PENDING | APPROVED | REJECTED`), video_url, raw_footage, player_name, timestamp

## Setup local

1. Copiar variables:

```bash
cp .env.example .env
```

2. Completar `.env`:

- `DATABASE_URL` (Supabase Postgres connection string)
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`

3. Instalar e inicializar:

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

## Seed desde XLSX

El seed busca automáticamente el archivo:

- `prisma/data/uydl.xlsx`

Columnas esperadas (case-insensitive):

- `rank`, `name`, `creator`, `video_url` (o `videoUrl`), `description`, `points`

Si no existe el XLSX, el seed genera 75 niveles de ejemplo.

## Panel admin y reordenamiento

- Ruta: `/admin`
- Protegida por `middleware.ts` (solo `ADMIN`/`EDITOR`)
- Al cambiar `rank` de un nivel, el endpoint reordena automáticamente los demás niveles para mantener Top 1-75 consistente.

## Deploy 24/7 gratis (Supabase + Vercel)

1. Crear proyecto en Supabase y obtener `DATABASE_URL` (pooling o direct connection).
2. Ejecutar en local:

```bash
npm run db:push
npm run db:seed
```

3. Subir repo a GitHub.
4. Importar proyecto en Vercel.
5. En Vercel → Settings → Environment Variables, cargar todas las variables de `.env.example`.
6. Redeploy.

Resultado: frontend y API de Next.js en Vercel, base PostgreSQL en Supabase, ambos con plan gratuito y disponibilidad 24/7.
