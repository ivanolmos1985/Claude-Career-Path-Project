# Configurar Row Level Security (RLS) - Políticas de Acceso

## ¿Qué es RLS?

Row Level Security garantiza que cada usuario SOLO vea y edite sus propios datos en Supabase.

## ✅ IMPORTANTE: Estas Políticas son OBLIGATORIAS

Si no configuras las políticas, los usuarios NO podrán:
- ❌ Crear equipos
- ❌ Agregar miembros
- ❌ Hacer evaluaciones
- ❌ Ver sus datos

---

## 🚀 PASOS PARA CONFIGURAR RLS

### PASO 1: Habilitar RLS en las Tablas

1. Ve a Supabase Dashboard → **SQL Editor**
2. Copia y ejecuta este script:

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;

-- competencies NO necesita RLS (es pública)
```

**Ejecuta con Ctrl+Enter**

---

### PASO 2: Crear Políticas para TEAMS

```sql
-- Política SELECT: Usuario solo ve sus equipos
CREATE POLICY "Users can read their own teams"
ON teams FOR SELECT
USING (auth.uid() = user_id);

-- Política INSERT: Usuario solo crea sus equipos
CREATE POLICY "Users can create their own teams"
ON teams FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Política UPDATE: Usuario solo actualiza sus equipos
CREATE POLICY "Users can update their own teams"
ON teams FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Política DELETE: Usuario solo elimina sus equipos
CREATE POLICY "Users can delete their own teams"
ON teams FOR DELETE
USING (auth.uid() = user_id);
```

**Ejecuta con Ctrl+Enter**

---

### PASO 3: Crear Políticas para MEMBERS

```sql
-- Política SELECT: Usuario ve miembros de SUS equipos
CREATE POLICY "Users can read members of their teams"
ON members FOR SELECT
USING (
  team_id IN (
    SELECT id FROM teams WHERE user_id = auth.uid()
  )
);

-- Política INSERT: Usuario agrega miembros a SUS equipos
CREATE POLICY "Users can create members in their teams"
ON members FOR INSERT
WITH CHECK (
  team_id IN (
    SELECT id FROM teams WHERE user_id = auth.uid()
  )
);

-- Política UPDATE: Usuario actualiza miembros de SUS equipos
CREATE POLICY "Users can update members in their teams"
ON members FOR UPDATE
USING (
  team_id IN (
    SELECT id FROM teams WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  team_id IN (
    SELECT id FROM teams WHERE user_id = auth.uid()
  )
);

-- Política DELETE: Usuario elimina miembros de SUS equipos
CREATE POLICY "Users can delete members in their teams"
ON members FOR DELETE
USING (
  team_id IN (
    SELECT id FROM teams WHERE user_id = auth.uid()
  )
);
```

**Ejecuta con Ctrl+Enter**

---

### PASO 4: Crear Políticas para EVALUATIONS

```sql
-- Política SELECT: Usuario ve evaluaciones de SUS miembros
CREATE POLICY "Users can read evaluations of their members"
ON evaluations FOR SELECT
USING (
  member_id IN (
    SELECT id FROM members
    WHERE team_id IN (
      SELECT id FROM teams WHERE user_id = auth.uid()
    )
  )
);

-- Política INSERT: Usuario crea evaluaciones en SUS miembros
CREATE POLICY "Users can create evaluations for their members"
ON evaluations FOR INSERT
WITH CHECK (
  member_id IN (
    SELECT id FROM members
    WHERE team_id IN (
      SELECT id FROM teams WHERE user_id = auth.uid()
    )
  )
);

-- Política UPDATE: Usuario actualiza evaluaciones de SUS miembros
CREATE POLICY "Users can update evaluations of their members"
ON evaluations FOR UPDATE
USING (
  member_id IN (
    SELECT id FROM members
    WHERE team_id IN (
      SELECT id FROM teams WHERE user_id = auth.uid()
    )
  )
)
WITH CHECK (
  member_id IN (
    SELECT id FROM members
    WHERE team_id IN (
      SELECT id FROM teams WHERE user_id = auth.uid()
    )
  )
);

-- Política DELETE: Usuario elimina evaluaciones de SUS miembros
CREATE POLICY "Users can delete evaluations of their members"
ON evaluations FOR DELETE
USING (
  member_id IN (
    SELECT id FROM members
    WHERE team_id IN (
      SELECT id FROM teams WHERE user_id = auth.uid()
    )
  )
);
```

**Ejecuta con Ctrl+Enter**

---

### PASO 5: Crear Políticas para EVIDENCE

```sql
-- Política SELECT: Usuario ve evidencias de SUS miembros
CREATE POLICY "Users can read evidence of their members"
ON evidence FOR SELECT
USING (
  member_id IN (
    SELECT id FROM members
    WHERE team_id IN (
      SELECT id FROM teams WHERE user_id = auth.uid()
    )
  )
);

-- Política INSERT: Usuario crea evidencias en SUS miembros
CREATE POLICY "Users can create evidence for their members"
ON evidence FOR INSERT
WITH CHECK (
  member_id IN (
    SELECT id FROM members
    WHERE team_id IN (
      SELECT id FROM teams WHERE user_id = auth.uid()
    )
  )
);

-- Política UPDATE: Usuario actualiza evidencias de SUS miembros
CREATE POLICY "Users can update evidence of their members"
ON evidence FOR UPDATE
USING (
  member_id IN (
    SELECT id FROM members
    WHERE team_id IN (
      SELECT id FROM teams WHERE user_id = auth.uid()
    )
  )
)
WITH CHECK (
  member_id IN (
    SELECT id FROM members
    WHERE team_id IN (
      SELECT id FROM teams WHERE user_id = auth.uid()
    )
  )
);

-- Política DELETE: Usuario elimina evidencias de SUS miembros
CREATE POLICY "Users can delete evidence of their members"
ON evidence FOR DELETE
USING (
  member_id IN (
    SELECT id FROM members
    WHERE team_id IN (
      SELECT id FROM teams WHERE user_id = auth.uid()
    )
  )
);
```

**Ejecuta con Ctrl+Enter**

---

## ✅ VERIFICAR QUE RLS ESTÁ CONFIGURADO

### En Supabase Dashboard:

1. Ve a **Table Editor**
2. Selecciona tabla **teams**
3. Haz clic en el icono de **RLS** (arriba a la derecha)
4. Verás todas las políticas que creaste

### Deberías ver:
- ✅ `teams` con 4 políticas (SELECT, INSERT, UPDATE, DELETE)
- ✅ `members` con 4 políticas
- ✅ `evaluations` con 4 políticas
- ✅ `evidence` con 4 políticas
- ℹ️ `competencies` SIN RLS (es correcta así)

---

## 🧪 TEST: Verificar que funciona

### Probar agregación de miembros:

1. Abre tu app
2. Crea un equipo
3. Intenta agregar un miembro
4. Debería guardar sin errores ✅

Si ves error de "permission denied", significa que las políticas no están correctas.

---

## ❌ Si Algo Falla

### Error: "permission denied"
Significa: Las políticas RLS no permiten la operación
Solución: Verifica que ejecutaste TODOS los scripts arriba

### Error: "relation does not exist"
Significa: Olvidaste crear las tablas primero
Solución: Corre primero `SUPABASE_DATABASE_SETUP.md`

### Error: "duplicate policy"
Significa: Ya creaste esa política antes
Solución: Elimina la política vieja desde el UI de Supabase, luego crea de nuevo

---

## 📋 CHECKLIST

- [ ] ✅ Ejecuté script para habilitar RLS en todas las tablas
- [ ] ✅ Creé todas las políticas para `teams` (4 políticas)
- [ ] ✅ Creé todas las políticas para `members` (4 políticas)
- [ ] ✅ Creé todas las políticas para `evaluations` (4 políticas)
- [ ] ✅ Creé todas las políticas para `evidence` (4 políticas)
- [ ] ✅ Verifiqué en Supabase Dashboard que todas están creadas
- [ ] ✅ Probé crear un equipo
- [ ] ✅ Probé agregar un miembro
- [ ] ✅ Funciona sin errores

---

**Estado:** 🟢 Listo para usar
**Última actualización:** 2025-12-02
**Nivel de Dificultad:** 🔴 OBLIGATORIO (la app NO funciona sin esto)

