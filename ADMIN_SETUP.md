# Sistema de Admin - Configuración Completa

## 📋 Resumen

Crear un usuario **admin** (`iolmos@arkusnexus.com`) que:
- ✅ Ve TODOS los equipos de TODOS los usuarios
- ✅ Ve TODOS los miembros de TODOS los usuarios
- ✅ Ve TODAS las evaluaciones
- ✅ Ve TODAS las evidencias
- ✅ Puede seleccionar qué usuario ver en el UI
- ✅ Puede hacer sus propias evaluaciones también
- ✅ Acceso completo al sistema

---

## 🎯 ¿Cómo Funciona?

### Flujo Normal (Usuario Regular)
```
Usuario regular inicia sesión
    ↓
Ve SOLO sus propios equipos
    ↓
Ve SOLO sus propios miembros
    ↓
Puede evaluar solo sus propios miembros
```

### Flujo Admin
```
Admin (iolmos@arkusnexus.com) inicia sesión
    ↓
Ve TODOS los equipos de TODOS los usuarios
    ↓
Selector: "¿A qué usuario quieres ver?"
    ↓
Elige usuario (ej: Juan)
    ↓
Ve equipos de Juan
    ↓
Ve miembros de Juan
    ↓
Ve evaluaciones de Juan
    ↓
Puede evaluarlos O hacer sus propias evaluaciones
```

---

## 🚀 PASO 1: Crear Tabla de Admins

En **Supabase Dashboard → SQL Editor**, ejecuta:

```sql
-- Tabla para marcar quién es admin
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  is_admin BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para búsquedas rápidas
CREATE INDEX idx_admin_users_email ON admin_users(email);

-- Insertar el admin (REEMPLAZA UUID con el ID real de iolmos@arkusnexus.com)
-- Primero, obtén el UUID con esta query:
-- SELECT id, email FROM auth.users WHERE email = 'iolmos@arkusnexus.com';
-- Luego copia el ID y reemplaza 'UUID-AQUI' en la siguiente línea:

INSERT INTO admin_users (id, email, is_admin) VALUES
  ('UUID-AQUI', 'iolmos@arkusnexus.com', true);

-- NO necesita RLS porque solo se verifica si existe
```

---

## 🚀 PASO 2: Obtener UUID del Admin

1. En Supabase SQL Editor, ejecuta:

```sql
SELECT id, email FROM auth.users WHERE email = 'iolmos@arkusnexus.com';
```

2. Copia el `id` (UUID)
3. Reemplaza `'UUID-AQUI'` en el INSERT anterior
4. Ejecuta el INSERT

**Resultado esperado:**
```
id                                   | email
-------------------------------------|--------------------
550e8400-e29b-41d4-a716-446655440000 | iolmos@arkusnexus.com
```

---

## 🚀 PASO 3: Modificar RLS en Tabla `teams`

Agregar política que permita al admin ver TODOS los equipos:

```sql
-- Política para admins: ver todos los equipos
CREATE POLICY "Admins can read all teams"
ON teams FOR SELECT
USING (
  -- Admin puede ver todos
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_admin = true)
  OR
  -- Usuario normal solo ve los suyos
  auth.uid() = user_id
);

-- Política para admins: insertar equipos
CREATE POLICY "Admins can create teams for any user"
ON teams FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_admin = true)
  OR
  auth.uid() = user_id
);

-- Política para admins: actualizar equipos
CREATE POLICY "Admins can update any team"
ON teams FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_admin = true)
  OR
  auth.uid() = user_id
)
WITH CHECK (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_admin = true)
  OR
  auth.uid() = user_id
);

-- Política para admins: eliminar equipos
CREATE POLICY "Admins can delete any team"
ON teams FOR DELETE
USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_admin = true)
  OR
  auth.uid() = user_id
);
```

**⚠️ IMPORTANTE:** Primero ELIMINA las políticas antiguas:

```sql
DROP POLICY IF EXISTS "Users can read their own teams" ON teams;
DROP POLICY IF EXISTS "Users can create their own teams" ON teams;
DROP POLICY IF EXISTS "Users can update their own teams" ON teams;
DROP POLICY IF EXISTS "Users can delete their own teams" ON teams;
```

---

## 🚀 PASO 4: Modificar RLS en Tabla `members`

```sql
-- ELIMINA políticas antiguas primero
DROP POLICY IF EXISTS "Users can read members of their teams" ON members;
DROP POLICY IF EXISTS "Users can create members in their teams" ON members;
DROP POLICY IF EXISTS "Users can update members in their teams" ON members;
DROP POLICY IF EXISTS "Users can delete members in their teams" ON members;

-- NUEVAS políticas con acceso admin
CREATE POLICY "Users and admins can read members"
ON members FOR SELECT
USING (
  -- Admin ve todos
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_admin = true)
  OR
  -- Usuario normal solo ve sus propios miembros
  team_id IN (SELECT id FROM teams WHERE user_id = auth.uid())
);

CREATE POLICY "Users and admins can create members"
ON members FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_admin = true)
  OR
  team_id IN (SELECT id FROM teams WHERE user_id = auth.uid())
);

CREATE POLICY "Users and admins can update members"
ON members FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_admin = true)
  OR
  team_id IN (SELECT id FROM teams WHERE user_id = auth.uid())
)
WITH CHECK (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_admin = true)
  OR
  team_id IN (SELECT id FROM teams WHERE user_id = auth.uid())
);

CREATE POLICY "Users and admins can delete members"
ON members FOR DELETE
USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_admin = true)
  OR
  team_id IN (SELECT id FROM teams WHERE user_id = auth.uid())
);
```

---

## 🚀 PASO 5: Modificar RLS en Tabla `evaluations`

```sql
-- ELIMINA políticas antiguas
DROP POLICY IF EXISTS "Users can read evaluations of their members" ON evaluations;
DROP POLICY IF EXISTS "Users can create evaluations for their members" ON evaluations;
DROP POLICY IF EXISTS "Users can update evaluations of their members" ON evaluations;
DROP POLICY IF EXISTS "Users can delete evaluations of their members" ON evaluations;

-- NUEVAS políticas
CREATE POLICY "Users and admins can read evaluations"
ON evaluations FOR SELECT
USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_admin = true)
  OR
  member_id IN (SELECT id FROM members WHERE team_id IN (SELECT id FROM teams WHERE user_id = auth.uid()))
);

CREATE POLICY "Users and admins can create evaluations"
ON evaluations FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_admin = true)
  OR
  member_id IN (SELECT id FROM members WHERE team_id IN (SELECT id FROM teams WHERE user_id = auth.uid()))
);

CREATE POLICY "Users and admins can update evaluations"
ON evaluations FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_admin = true)
  OR
  member_id IN (SELECT id FROM members WHERE team_id IN (SELECT id FROM teams WHERE user_id = auth.uid()))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_admin = true)
  OR
  member_id IN (SELECT id FROM members WHERE team_id IN (SELECT id FROM teams WHERE user_id = auth.uid()))
);

CREATE POLICY "Users and admins can delete evaluations"
ON evaluations FOR DELETE
USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_admin = true)
  OR
  member_id IN (SELECT id FROM members WHERE team_id IN (SELECT id FROM teams WHERE user_id = auth.uid()))
);
```

---

## 🚀 PASO 6: Modificar RLS en Tabla `evidence`

Mismo patrón que `evaluations`:

```sql
-- ELIMINA políticas antiguas
DROP POLICY IF EXISTS "Users can read evidence of their members" ON evidence;
DROP POLICY IF EXISTS "Users can create evidence for their members" ON evidence;
DROP POLICY IF EXISTS "Users can update evidence of their members" ON evidence;
DROP POLICY IF EXISTS "Users can delete evidence of their members" ON evidence;

-- NUEVAS políticas
CREATE POLICY "Users and admins can read evidence"
ON evidence FOR SELECT
USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_admin = true)
  OR
  member_id IN (SELECT id FROM members WHERE team_id IN (SELECT id FROM teams WHERE user_id = auth.uid()))
);

CREATE POLICY "Users and admins can create evidence"
ON evidence FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_admin = true)
  OR
  member_id IN (SELECT id FROM members WHERE team_id IN (SELECT id FROM teams WHERE user_id = auth.uid()))
);

CREATE POLICY "Users and admins can update evidence"
ON evidence FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_admin = true)
  OR
  member_id IN (SELECT id FROM members WHERE team_id IN (SELECT id FROM teams WHERE user_id = auth.uid()))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_admin = true)
  OR
  member_id IN (SELECT id FROM members WHERE team_id IN (SELECT id FROM teams WHERE user_id = auth.uid()))
);

CREATE POLICY "Users and admins can delete evidence"
ON evidence FOR DELETE
USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_admin = true)
  OR
  member_id IN (SELECT id FROM members WHERE team_id IN (SELECT id FROM teams WHERE user_id = auth.uid()))
);
```

---

## 📋 Resumen de Pasos SQL

1. ✅ Crear tabla `admin_users`
2. ✅ Obtener UUID de `iolmos@arkusnexus.com`
3. ✅ Insertar admin en tabla
4. ✅ Eliminar políticas antiguas de `teams`
5. ✅ Crear nuevas políticas en `teams`
6. ✅ Eliminar y crear políticas en `members`
7. ✅ Eliminar y crear políticas en `evaluations`
8. ✅ Eliminar y crear políticas en `evidence`

---

## ✅ Verificación

Después de crear todo en Supabase:

1. **Inicia sesión como admin** (iolmos@arkusnexus.com)
2. **Deberías ver todos los equipos**
3. **Deberías ver todos los miembros**
4. **Deberías ver todas las evaluaciones**

---

## 🎨 UI Changes (Próximo Paso - Se hace en el código React)

Se modificará:
- ✅ Página de Equipos: Mostrar botón "Seleccionar Usuario" si es admin
- ✅ Crear selector: Dropdown con lista de usuarios
- ✅ AppContext: Filtrar datos por usuario seleccionado
- ✅ Dashboard Admin: Ver que usuario está seleccionado

---

**Estado:** Base de datos lista
**Próximo:** Modificar UI en React

