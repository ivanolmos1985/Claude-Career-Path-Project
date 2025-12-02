# ⚡ Guía Rápida: Setup Base de Datos (5 Minutos)

## 🎯 Tu Objetivo en 5 Pasos

```
1. Abrir Supabase SQL Editor        (30 segundos)
2. Ejecutar 5 scripts SQL            (3 minutos)
3. Verificar tablas creadas          (30 segundos)
4. Habilitar Realtime (opcional)     (30 segundos)
5. ¡Listo! Base de datos conectada   (menos de 5 minutos)
```

---

## 🚀 PASO A PASO RÁPIDO

### PASO 1️⃣: Abre SQL Editor (30 segundos)

1. Ve a: https://app.supabase.com/
2. Haz clic en tu proyecto
3. Menú izquierdo → **SQL Editor**
4. Botón azul **+ New Query**

✅ Listo para copiar SQL

---

### PASO 2️⃣: Copia y Ejecuta 5 Scripts (3 minutos)

#### Script 1: TEAMS
```bash
COPIAR → PEGAR en SQL Editor → Ctrl+Enter
```

📋 **[VER SCRIPT COMPLETO EN SUPABASE_DATABASE_SETUP.md - TABLA 1]**

Verás ✅ verde = funcionó

---

#### Script 2: MEMBERS
```bash
COPIAR → PEGAR en SQL Editor → Ctrl+Enter
```

📋 **[VER SCRIPT COMPLETO EN SUPABASE_DATABASE_SETUP.md - TABLA 2]**

Verás ✅ verde = funcionó

---

#### Script 3: EVALUATIONS
```bash
COPIAR → PEGAR en SQL Editor → Ctrl+Enter
```

📋 **[VER SCRIPT COMPLETO EN SUPABASE_DATABASE_SETUP.md - TABLA 3]**

Verás ✅ verde = funcionó

---

#### Script 4: EVIDENCE
```bash
COPIAR → PEGAR en SQL Editor → Ctrl+Enter
```

📋 **[VER SCRIPT COMPLETO EN SUPABASE_DATABASE_SETUP.md - TABLA 4]**

Verás ✅ verde = funcionó

---

#### Script 5: COMPETENCIES (con datos)
```bash
COPIAR → PEGAR en SQL Editor → Ctrl+Enter
```

📋 **[VER SCRIPT COMPLETO EN SUPABASE_DATABASE_SETUP.md - TABLA 5]**

Verás ✅ verde = funcionó

---

### PASO 3️⃣: Verificar (30 segundos)

1. Menú izquierdo → **Table Editor**
2. Deberías ver:
   - ✅ teams
   - ✅ members
   - ✅ evaluations
   - ✅ evidence
   - ✅ competencies

3. Haz clic en `competencies`
4. Deberías ver ~42 filas de competencias

Si ves todo, ¡perfecto! ✨

---

### PASO 4️⃣: Habilitar Realtime (Opcional - 30 segundos)

1. Menú izquierdo → **Realtime**
2. Busca: `teams` → Activa la palanca
3. Busca: `members` → Activa la palanca
4. Busca: `evaluations` → Activa la palanca
5. Busca: `evidence` → Activa la palanca

(competencies no necesita realtime)

---

### PASO 5️⃣: ¡Listo!

Tu base de datos está creada y conectada.

Ahora necesitas:
1. Actualizar `.env.local` con las credenciales de Supabase
2. Hacer push a GitHub
3. Cloudflare hace deploy automático
4. ¡Tu app está lista con BD!

---

## 📋 Checklist Final

- [ ] Script 1 (TEAMS) ejecutado ✅
- [ ] Script 2 (MEMBERS) ejecutado ✅
- [ ] Script 3 (EVALUATIONS) ejecutado ✅
- [ ] Script 4 (EVIDENCE) ejecutado ✅
- [ ] Script 5 (COMPETENCIES) ejecutado ✅
- [ ] Todas las 5 tablas visibles en Table Editor
- [ ] Competencies tabla tiene ~42 filas
- [ ] Realtime habilitado (opcional)

**Si todo tiene ✅, ¡tu BD está lista!**

---

## ⚠️ Si algo falla:

1. Copia el mensaje de error
2. Comparte conmigo
3. Lo arreglamos

---

**Documentación completa:** Ver `SUPABASE_DATABASE_SETUP.md`
**Esquema detallado:** Ver `DATABASE_SCHEMA.md`
