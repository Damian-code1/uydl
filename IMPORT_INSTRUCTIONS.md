# 📥 Instrucciones de Importación CSV a Supabase

## Archivos Generados
✅ **csv-import/** (en la raíz del proyecto)
- `users.csv` - 1 usuario admin
- `levels.csv` - 173 niveles demon
- `records.csv` - 173 records aprobados

## Pasos para Importar

### 1️⃣ Importar USERS
1. Abre Supabase Dashboard: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Table Editor** → **users**
4. Haz clic en el botón **↓ Import data** (arriba a la derecha)
5. Selecciona **Users CSV from CSV** (o arrastra y suelta)
6. Selecciona `csv-import/users.csv`
7. Haz clic en **Import** ✓

**Credenciales del admin creado:**
- Email: `admin@uydl.gg`
- Password: `Admin1234!`

---

### 2️⃣ Importar LEVELS
1. Ve a **Table Editor** → **levels**
2. Haz clic en el botón **↓ Import data**
3. Selecciona `csv-import/levels.csv`
4. Espera a que cargue todas las 173 filas ✓

---

### 3️⃣ Importar RECORDS
1. Ve a **Table Editor** → **records**
2. Haz clic en el botón **↓ Import data**
3. Selecciona `csv-import/records.csv`
4. Espera a que cargue todos los 173 records ✓

---

## ✅ Verificación

Una vez importado, deberías ver:
- **users table**: 1 fila (admin@uydl.gg)
- **levels table**: 173 filas (niveles demon)
- **records table**: 173 filas (records aprobados)

## 🚀 Próximos Pasos

Una vez confirmado que los datos están en Supabase:

1. Ejecuta el build:
   ```bash
   npm run build
   ```

2. Inicia el servidor local:
   ```bash
   npm run dev
   ```

3. Abre http://localhost:3000 y verás la demon list con todos los 173 niveles! 🎮

---

## 📋 Contenido de los CSVs

### users.csv
Contiene 1 usuario admin:
- `id`: UUID generado
- `email`: admin@uydl.gg
- `password_hash`: Hash bcrypt de "Admin1234!"
- `role`: ADMIN
- `discord`: uyadmin#0001

### levels.csv
Contiene 173 niveles con:
- `rank`: Posición en la lista (1-173)
- `name`: Nombre del nivel
- `creator`: "Uruguay Community"
- `difficulty`: EASY, NORMAL, HARD, INSANE, o EXTREME (mapeado desde el tier del Excel)
- `durationSeconds`: Duración estimada en segundos
- `recordRequirement`: "100%"
- Metadata: videoUrl, thumbnailUrl, description, points

### records.csv
Contiene 173 records aprobados:
- Cada record linked a su level por `level_id`
- `playerName`: Nombre del victor del Excel
- `status`: APPROVED (todos verificados)
- `recordedAt`: Fecha aleatoria en últimos 90 días
- `user_id`: Linked al admin user

---

## ⚠️ Notas Importantes

1. **Orden de importación**: Importa USERS primero, luego LEVELS, luego RECORDS
2. **Los records necesitan los levels**: Los records tienen foreign keys a levels
3. **El admin creado está listo**: Puedes loguearte con admin@uydl.gg / Admin1234!
4. **Las tablas deben estar vacías**: Si alguna tabla ya tiene datos, Supabase pedirá confirmación

---

¿Necesitas ayuda con los pasos? Avísame cuando termines de importar! 🚀
