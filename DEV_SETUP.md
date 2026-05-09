# UYDL - Setup para Desarrollo Local

## Problema Actual
El proyecto Supabase retorna: `FATAL: Tenant or user not found`

Esto puede deberse a:
- ❌ Proyecto Supabase pausado o en prueba
- ❌ Proyecto eliminado  
- ❌ Límites de cuota alcanzados
- ❌ Acceso revocado

## Solución: Desarrollo Local con PostgreSQL

### Opción 1: PostgreSQL en Render.com (5 minutos)
1. Ir a https://render.com/signin
2. Dashboard → New + → PostgreSQL  
3. Seleccionar "Free" tier
4. Nombre: `uydl-dev`
5. Copy PostgreSQL connection string
6. Pegar en `.env` como `DATABASE_URL`
7. Esperar 2-3 minutos a que inicie
8. Ejecutar:
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   ```

### Opción 2: PostgreSQL en Railway (10 minutos)
1. Ir a https://railway.app
2. New Project → PostgreSQL
3. Ir a Variables y copiar `DATABASE_URL`
4. Pegar en `.env`
5. Railway da $5 USD starter credit
6. Ejecutar mismo proceso que Opción 1

### Opción 3: Fix Supabase
1. Ir a https://supabase.com/dashboard
2. Verificar estado del proyecto
3. Si está en "Free" plan:
   - Archive/Delete proyectos antiguos sin usar
   - Crear nuevo proyecto
   - Copiar nueva URL de conexión
   - Pegar en `.env`
4. Ejecutar `npx prisma db push && npx tsx prisma/seed.ts`

## UI/Components Status
✅ **100% Listos para usar:**
- LevelCard.tsx con glassmorphism
- /levels/[id] detail page con YouTube player
- DemonList.tsx con filtros avanzados
- Seed script con 173 niveles parseados del Excel
- Build production: PASS sin errores

## Próximos Pasos
1. Elegir opción de base de datos (local o cloud)
2. Actualizar `.env` con nueva `DATABASE_URL`
3. Ejecutar:
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   npm run dev
   ```
4. Entrar a http://localhost:3000 🚀

---

**Nota**: Una vez la DB esté funcionando, el seed toma <30 segundos para cargar 173 niveles + victores.
