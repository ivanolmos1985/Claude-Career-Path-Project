# Configurar Tabla de Usuarios en Supabase

## ¿Por Qué Necesitamos Esta Tabla?

Supabase `auth.users` es la tabla de autenticación, pero NO es accesible desde la aplicación por razones de seguridad.

Esta tabla `users` sincroniza automáticamente con `auth.users` y permite:
- ✅ Registrar metadata del usuario (nombre, photo, etc.)
- ✅ Trackear cuando se registró
- ✅ Acceder a datos del usuario desde la app
- ✅ RLS para proteger datos

---

## 🚀 PASO 1: Crear la Tabla en Supabase

1. Ve a **Supabase Dashboard → SQL Editor**
2. Copia el siguiente SQL completo:

```sql
-- TABLA: users (Perfil de usuario)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para búsquedas rápidas
CREATE INDEX idx_users_email ON users(email);

-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política: Usuarios ven solo su propio perfil
CREATE POLICY "Users can read their own profile"
ON users FOR SELECT
USING (auth.uid() = id);

-- Política: Usuarios actualizan su propio perfil
CREATE POLICY "Users can update their own profile"
ON users FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Política: Crear su propio perfil (usado por trigger)
CREATE POLICY "Allow insert own profile"
ON users FOR INSERT
WITH CHECK (auth.uid() = id);
```

3. **Ejecuta con Ctrl+Enter**
4. Deberías ver ✅ verde

---

## 🚀 PASO 2: Crear Trigger para Sincronización Automática

Este trigger automáticamente crea un registro en la tabla `users` cuando se registra un usuario nuevo en `auth.users`.

En el mismo SQL Editor, copia y ejecuta:

```sql
-- Función para crear usuario automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    updated_at = NOW();

  RETURN new;
END;
$$;

-- Trigger que ejecuta la función cuando se crea usuario en auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

3. **Ejecuta con Ctrl+Enter**
4. Deberías ver ✅ verde

---

## ✅ Verificación

### Probar que funciona:

1. **Abre tu app**
2. **Crea una cuenta nueva** (Register)
3. **Abre Supabase Dashboard → Table Editor**
4. **Selecciona tabla `users`**
5. **Deberías ver tu usuario listado** con:
   - ✅ id (del auth)
   - ✅ email
   - ✅ full_name
   - ✅ created_at

Si aparece, ¡el trigger funciona! 🎉

---

## 📋 Estructura de la Tabla

```sql
Column       | Type                     | Constraints
-------------|--------------------------|---------------------
id           | UUID                     | PRIMARY KEY, FK auth.users
email        | VARCHAR(255)             | NOT NULL, UNIQUE
full_name    | VARCHAR(255)             | NULL (opcional)
created_at   | TIMESTAMP WITH TIME ZONE | DEFAULT NOW()
updated_at   | TIMESTAMP WITH TIME ZONE | DEFAULT NOW()
```

---

## 🔒 Seguridad (RLS Policies)

✅ **SELECT:** Users can read their own profile
- Usuario SOLO ve su propio perfil
- No puede ver otros usuarios

✅ **UPDATE:** Users can update their own profile
- Usuario SOLO actualiza su propio perfil

✅ **INSERT:** Allow insert own profile
- Usado por el trigger automáticamente

---

## 🧪 Queries Útiles

### Ver todos los usuarios (solo para testing):
```sql
SELECT * FROM users;
```

### Ver un usuario específico:
```sql
SELECT * FROM users WHERE email = 'usuario@example.com';
```

### Ver cuándo se registró un usuario:
```sql
SELECT email, created_at FROM users ORDER BY created_at DESC;
```

---

## ❌ Si Algo Falla

### Error: "relation users already exists"
**Solución:** La tabla ya existe. Ve a Table Editor y verifica que `users` está lista.

### Error: "permission denied"
**Solución:** Las políticas RLS pueden estar incorrectas. Verifica que las 3 políticas existen.

### Usuario no aparece después de registrar
**Solución:** El trigger puede no funcionar. Verifica:
1. La función `handle_new_user` existe
2. El trigger `on_auth_user_created` existe
3. Mira los logs en Supabase

---

## 📚 Próximos Pasos

1. **Ejecuta el SQL de la tabla**
2. **Ejecuta el SQL del trigger**
3. **Prueba registrando un usuario**
4. **Verifica que aparece en tabla `users`**
5. **¡Listo!**

---

**Estado:** 🟢 Listo para configurar
**Última actualización:** 2025-12-02
**Nivel:** Intermedio (requiere entender triggers)

