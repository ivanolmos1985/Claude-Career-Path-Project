# Tabla de Usuarios - Guía Rápida (5 minutos)

## ¿Qué necesito hacer?

Crear una tabla en Supabase que registre automáticamente cada usuario que se registra en la app.

---

## ⚡ PASO 1: Copiar y Ejecutar SQL (2 minutos)

1. **Abre Supabase Dashboard**
2. **Ve a SQL Editor**
3. **Copia ESTE SQL completo:**

```sql
-- Crear tabla users
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own profile"
ON users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON users FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow insert own profile"
ON users FOR INSERT
WITH CHECK (auth.uid() = id);

-- Función y Trigger para sincronización
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

4. **Presiona Ctrl+Enter**
5. **Espera a ver ✅ verde**

---

## ⚡ PASO 2: Verificar que funciona (3 minutos)

1. **Abre tu app**
2. **Haz clic en "Crear Cuenta"** (Register)
3. **Completa email y contraseña**
4. **Espera el email de confirmación**
5. **Vuelve a Supabase → Table Editor**
6. **Selecciona tabla `users`**
7. **¿Ves tu usuario registrado?** ✅

Si SÍ → **¡LISTO!** La tabla funciona

Si NO → Verifica que:
- El SQL ejecutó sin errores
- La función `handle_new_user` fue creada
- El trigger `on_auth_user_created` fue creado

---

## 📊 ¿Qué es esta tabla?

| Campo | Descripción |
|-------|------------|
| **id** | Tu ID único en Supabase Auth |
| **email** | Tu email |
| **full_name** | Tu nombre completo (si lo proporcionaste) |
| **created_at** | Cuándo te registraste |
| **updated_at** | Última actualización |

---

## 🔒 Seguridad

✅ Cada usuario SOLO ve su propio perfil
✅ No puede ver otros usuarios
✅ No puede modificar su email (excepto a sí mismo)

---

## 🎯 ¡Eso es todo!

La tabla ahora sincroniza automáticamente cada nuevo usuario que se registra.

**Próximo paso:** Continúa usando la app normalmente. Cuando nuevos usuarios se registren, aparecerán automáticamente en la tabla `users`.

---

**Tiempo:** ~5 minutos
**Dificultad:** Muy fácil (solo copiar-pegar)
**Estado:** Listo

