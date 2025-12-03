# Migrar Usuarios Existentes a Tabla `users`

## ¿Cuál es el Problema?

Si ya creaste usuarios en Supabase Auth ANTES de crear la tabla `users`, esos usuarios NO aparecen automáticamente en la tabla nueva.

**Solución:** Ejecutar un script SQL que copie todos los usuarios existentes de `auth.users` a la tabla `users`.

---

## ⚡ PASO 1: Crear la Tabla (Si no la has creado)

Si ya creaste la tabla `users`, salta al PASO 2.

Si NO la has creado aún, primero:
1. Abre [QUICK_START_USERS.md](QUICK_START_USERS.md)
2. Copia el SQL
3. Ejecuta en Supabase

---

## ⚡ PASO 2: Migrar Usuarios Existentes

1. **Abre Supabase Dashboard → SQL Editor**
2. **Copia ESTE script completo:**

```sql
-- Migrar todos los usuarios existentes de auth.users a tabla users
INSERT INTO public.users (id, email, full_name)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', '') as full_name
FROM auth.users
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  updated_at = NOW();

-- Mostrar cuántos usuarios se migraron
SELECT COUNT(*) as usuarios_migrados FROM public.users;
```

3. **Presiona Ctrl+Enter**
4. **Espera a ver ✅ verde**

---

## 📊 ¿Qué Hace Este Script?

```
Para CADA usuario en auth.users:
  ├─ Copia su ID
  ├─ Copia su email
  ├─ Copia su nombre completo (si existe)
  └─ Inserta en tabla 'users'
```

Si el usuario ya existe en `users`, lo actualiza.

---

## ✅ Verificar que Funcionó

1. **Abre Supabase Dashboard**
2. **Ve a Table Editor**
3. **Selecciona tabla `users`**
4. **¿Ves todos tus usuarios listados?** ✅

**Resultado esperado:**
```
id          | email              | full_name      | created_at
------------|--------------------|-----------------|-----------
uuid-123    | usuario1@email.com | Juan Pérez     | 2025-12-03
uuid-456    | usuario2@email.com | María García   | 2025-12-03
uuid-789    | usuario3@email.com |                | 2025-12-03
```

Si ves tus usuarios, ¡funcionó! 🎉

---

## 🔄 ¿Qué Pasa Ahora?

Después de ejecutar este script:

✅ **Usuarios nuevos:** Se crean automáticamente en tabla `users` (el trigger funciona)
✅ **Usuarios existentes:** Ya están migrados
✅ **Todo sincronizado:** auth.users ↔ tabla users

---

## 🆘 Si Algo Falla

### Error: "relation users does not exist"
**Significa:** La tabla `users` no existe
**Solución:** Primero crea la tabla (sigue PASO 1)

### Error: "constraint violation"
**Significa:** Hay un problema con los datos
**Solución:** Intenta este script alternativo más simple:

```sql
-- Versión segura (sin actualizar conflictos)
INSERT INTO public.users (id, email, full_name)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', '')
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users);
```

### No ves cantidad de usuarios migrados
**Significa:** El script ejecutó pero algo pasó
**Solución:** Ejecuta esta query para verificar:

```sql
SELECT COUNT(*) FROM public.users;
```

---

## 📋 Después de Migrar

Una vez migrados, el flujo es:

```
Usuario nuevo se registra
    ↓
TRIGGER automático (handle_new_user)
    ↓
Se inserta en tabla users
    ↓
✅ Listo

Usuario existente ya está en tabla users
    ↓
App puede acceder a sus datos
    ↓
✅ Funciona normalmente
```

---

## 🎯 Pasos Resumidos

1. ✅ Crear tabla `users` (si no existe)
2. ✅ Ejecutar script de migración
3. ✅ Verificar en Table Editor que los usuarios aparecen
4. ✅ ¡Listo! Todos tus usuarios están sincronizados

---

## 📝 Documentación Relacionada

- [QUICK_START_USERS.md](QUICK_START_USERS.md) - Crear tabla desde cero
- [USERS_TABLE_SETUP.md](USERS_TABLE_SETUP.md) - Documentación completa
- [README_USERS.md](README_USERS.md) - Guía general

---

**Tiempo:** ~2 minutos
**Dificultad:** Muy fácil (solo copiar-pegar)
**Estado:** Listo

