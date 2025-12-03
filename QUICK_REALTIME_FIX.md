# Quick Real-Time Fix - 10 Minutes

Real-time no está funcionando? Sigue estos pasos:

---

## 🔴 Problema: Real-Time No Funciona

### Síntomas:
- ❌ Contador de usuarios no actualiza
- ❌ Equipos no se sincronizan entre pestañas
- ❌ Miembros no aparecen en tiempo real
- ❌ Cambios requieren refresh manual

---

## ⚡ Solución Rápida (Opción A: 5 min)

### Paso 1: Habilitar Realtime en Supabase

1. Abre https://app.supabase.com/
2. Selecciona tu proyecto
3. Ve a **Settings** → **Database**
4. Busca sección **Realtime**
5. Asegúrate que esté **ON** (verde)
6. Si hay lista de tablas, habilita:
   - ✅ online_users
   - ✅ teams
   - ✅ members
   - ✅ users

### Paso 2: Refresh la App

Haz hard refresh en tu navegador:
```
Windows: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

### ¿Funciona ahora?
- ✅ SÍ → ¡Listo! Realtime está activo
- ❌ NO → Continúa con Opción B

---

## 🔧 Solución Intermedia (Opción B: 8 min)

Si Realtime sigue sin funcionar, es probablemente un problema de **Row Level Security (RLS)**.

### Paso 1: Verifica RLS Policies

Ve a **Supabase Dashboard** → **SQL Editor** → Copia y ejecuta esto:

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('online_users', 'teams', 'members', 'users');
```

**Resultado esperado:**
```
tablename    | rowsecurity
─────────────┼────────────
online_users | t
teams        | t
members      | t
users        | t
```

Si `rowsecurity` es **f** (falso), ejecuta esto:

```sql
ALTER TABLE online_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

### Paso 2: Crear Políticas RLS Correctas

Ejecuta este SQL en Supabase SQL Editor:

```sql
-- Política para online_users (readable por todos)
CREATE POLICY "Anyone can view online users"
ON online_users
FOR SELECT
USING (true);

CREATE POLICY "Users can manage their own session"
ON online_users
FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own session"
ON online_users
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own session"
ON online_users
FOR DELETE
USING (auth.uid() = id);

-- Política para teams
CREATE POLICY "Users can see their own teams"
ON teams
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create teams"
ON teams
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own teams"
ON teams
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own teams"
ON teams
FOR DELETE
USING (auth.uid() = user_id);
```

### Paso 3: Refresh la App

```
Ctrl + Shift + R (Windows)
o
Cmd + Shift + R (Mac)
```

### ¿Funciona ahora?
- ✅ SÍ → ¡Listo!
- ❌ NO → Continúa con Opción C

---

## 🔍 Diagnóstico Avanzado (Opción C: 10 min)

Si aún no funciona, necesitamos diagnosticar más profundamente.

### Paso 1: Abre Browser Console

1. Presiona **F12**
2. Ve a pestaña **Console**
3. Copia y ejecuta esto:

```javascript
// Ver channels activos
console.log('Canales activos:')
console.log(supabase.getChannels())
```

**Esperado:**
```
[
  RealtimeChannel { topic: 'online_users:all', state: 'joined' },
  RealtimeChannel { topic: 'teams:user_id=eq.xxx', state: 'joined' },
  RealtimeChannel { topic: 'members:all', state: 'joined' }
]
```

### Paso 2: Revisa errores en Console

Busca mensajes rojos que digan:
- "permission denied"
- "WebSocket closed"
- "CORS error"

### Paso 3: Ejecuta diagnóstico automático

En browser console:

```javascript
// Copiar y pegar esto:
import('./src/utils/realtimeDiagnostics.js').then(module => {
  module.diagnoseRealtime(supabase).then(results => {
    console.log(results)
  })
})
```

Esto te mostrará qué está fallando exactamente.

### Paso 4: Monitorea eventos en vivo

```javascript
import('./src/utils/realtimeDiagnostics.js').then(module => {
  const monitor = module.monitorRealtimeEvents(supabase)
  console.log('Monitor iniciado. Haz cambios y mira aquí...')
})
```

Ahora haz cambios en otra pestaña y verás eventos aparecer en console.

---

## 📋 Checklist de Verificación

Después de aplicar cualquier solución, verifica:

### En Supabase Dashboard:
- [ ] Realtime está **ON** en Settings
- [ ] RLS está **ENABLED** en todas las tablas
- [ ] RLS policies existen para cada tabla

### En tu App (Browser Console):
- [ ] Sin errores rojos
- [ ] `supabase.getChannels()` muestra "joined"
- [ ] Al hacer cambios, ves eventos en console

### En UI:
- [ ] Contador de usuarios actualiza al login/logout
- [ ] Equipos aparecen sin refresh en otra pestaña
- [ ] Miembros se sincronizan en tiempo real

---

## 🆘 Si Aún No Funciona

### Opción 1: Reset Completo de Realtime

1. Ve a Supabase Dashboard
2. Settings → Database → Realtime
3. Desactiva (OFF) todas las tablas
4. Espera 30 segundos
5. Activa (ON) todas las tablas
6. Espera 1 minuto
7. Refresh la app

### Opción 2: Revisar Supabase Status

Ve a https://status.supabase.com/ y verifica:
- ¿Hay outages en Realtime?
- ¿Está todo green?

Si hay outage, espera a que se resuelva.

### Opción 3: Test Manual en Base de Datos

1. Ve a Supabase → Tu tabla (ej: online_users)
2. Click **Insert Row**
3. Agrega una fila manualmente
4. ¿Ves cambios en tu app en tiempo real?
   - ✅ SÍ → Realtime funciona, problema en código
   - ❌ NO → Problema con Realtime/RLS

---

## 📞 Información a Proporcionar si Necesitas Ayuda

Si aún necesitas ayuda, recopila esto:

1. **Error exact** (texto completo del error)
2. **Resultado de diagnóstico** (ejecuta en console y copia output)
3. **Estado de Realtime** (ON/OFF)
4. **Resultado de RLS check** (tu resultado del SQL)
5. **Browser** (Chrome, Firefox, Safari, Edge)

---

## 🎯 Resumen

**3 Opciones:**

| Opción | Tiempo | Complejidad | Para |
|--------|--------|-------------|------|
| A | 5 min | Muy fácil | Problema simple |
| B | 8 min | Media | RLS policies |
| C | 10 min | Avanzado | Debugging profundo |

**Comienza con A, si no funciona → B, si no → C**

---

**Last Updated:** 2025-12-03
**Status:** Quick Fix Guide
