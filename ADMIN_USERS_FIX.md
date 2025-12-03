# Selector Admin Vacío - Diagnóstico y Solución

## 🔍 Problema

El selector admin aparece pero NO muestra otros usuarios que existen en la base de datos.

---

## 📋 PASO 1: Diagnosticar el Problema

Ejecuta estas queries en **Supabase SQL Editor** para verificar:

### Query 1: ¿Cuántos usuarios hay en auth.users?
```sql
SELECT COUNT(*) as total_usuarios FROM auth.users;
```

**¿Qué significa?**
- Si retorna 0 → No hay usuarios registrados
- Si retorna > 1 → Hay usuarios pero posiblemente no están en tabla `users`

### Query 2: ¿Cuántos usuarios hay en tabla users?
```sql
SELECT COUNT(*) as usuarios_en_tabla FROM public.users;
```

**¿Qué significa?**
- Si retorna 0 → Tabla vacía (PROBLEMA!)
- Si retorna > 1 → Usuarios están en tabla pero selector no los ve

### Query 3: Ver usuarios en tabla users
```sql
SELECT id, email, full_name FROM public.users ORDER BY email;
```

**¿Qué significa?**
- Deberías ver lista de emails de usuarios

---

## 🔧 SOLUCIÓN

### Opción A: Si tabla users está vacía (0 usuarios)

**Causa:** Usuarios se registraron ANTES de crear tabla `users`

**Solución:** Ejecuta migration script:

```sql
-- Copiar usuarios de auth.users a tabla users
INSERT INTO public.users (id, email, full_name)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', '')
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users);

-- Verificar
SELECT COUNT(*) as usuarios_migrados FROM public.users;
```

**Después:**
1. Recarga la app (Ctrl+F5)
2. Abre selector admin
3. ¿Ves usuarios? ✅

---

### Opción B: Si tabla users tiene usuarios pero selector sigue vacío

**Causa:** Posiblemente RLS policy bloqueando acceso del admin a tabla `users`

**Verificación:**
```sql
-- Ver si hay RLS policies en tabla users
SELECT policyname FROM pg_policies WHERE tablename = 'users';
```

**Si hay policies que bloquean:**

```sql
-- Crear policy que permite a admin ver todos
CREATE POLICY "Admin can read all users"
ON public.users FOR SELECT
USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_admin = true)
);

-- O simplemente permitir lectura pública (temporal para testing)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
```

**Después:**
1. Recarga la app
2. Abre selector
3. ¿Ves usuarios? ✅

---

### Opción C: Verificar que función `loadAllUsers` en AppContext funciona

En **browser console** (F12), ejecuta:

```javascript
// Ver si hay error en la carga de usuarios
const supabase = window.supabase; // Si no funciona, el problema es diferente
```

Si ves errores como "relation users does not exist", significa tabla no existe.

---

## ✅ PASO 2: Verificar Que Todo Funciona

Después de ejecutar la solución:

1. **Browser Console (F12):**
   - No debe haber errores rojos
   - Busca por "users" en console

2. **Reload app (Ctrl+F5):**
   - Inicia sesión como admin
   - Ve a Equipos
   - Abre selector
   - ¿Ves usuarios? ✅

3. **Supabase Query:**
   ```sql
   SELECT COUNT(*) FROM public.users;
   ```
   - Debe retornar > 0

---

## 🎯 Checklist de Solución

- [ ] Ejecuté Query 1 (contar usuarios en auth.users)
- [ ] Ejecuté Query 2 (contar usuarios en tabla users)
- [ ] Ejecuté Query 3 (ver usuarios)
- [ ] Identifiqué el problema (Opción A, B o C)
- [ ] Ejecuté la solución correspondiente
- [ ] Recargué la app (Ctrl+F5)
- [ ] Reabrí selector
- [ ] ¡Ves usuarios! ✅

---

## 📝 Resumen Rápido

| Problema | Solución |
|----------|----------|
| Tabla users vacía | Migration script (Opción A) |
| RLS bloqueando | Ajustar RLS policies (Opción B) |
| AppContext error | Ver console (Opción C) |

---

## 💡 Si Nada Funciona

1. Verifica archivo **AppContext.jsx** línea 56-57:
   ```javascript
   const { data, error } = await supabase
     .from('users')
     .select('id, email, full_name')
   ```

2. ¿Dice `from('users')` o `from('public.users')`?
   - Si dice `public.users`, cámbialo a `users`

3. Reabre selector

---

**Ahora ejecuta las queries de diagnóstico y dime qué retornan** 👇
