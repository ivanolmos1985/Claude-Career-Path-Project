# Admin Setup - Guía Rápida (10 minutos)

## 🎯 Objetivo

Configurar `iolmos@arkusnexus.com` como **admin** con acceso a TODOS los datos del sistema.

---

## ⚡ PASO 1: Obtener UUID del Admin (2 minutos)

1. **Abre Supabase Dashboard → SQL Editor**
2. **Ejecuta esta query:**

```sql
SELECT id, email FROM auth.users WHERE email = 'iolmos@arkusnexus.com';
```

3. **Copia el `id` (es un UUID largo)**

Ejemplo:
```
id                                   | email
-------------------------------------|--------------------
550e8400-e29b-41d4-a716-446655440000 | iolmos@arkusnexus.com
```

Copia: `550e8400-e29b-41d4-a716-446655440000`

---

## ⚡ PASO 2: Crear Tabla de Admins (2 minutos)

En el mismo SQL Editor, ejecuta:

```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  is_admin BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_admin_users_email ON admin_users(email);
```

**Resultado esperado:** ✅ verde

---

## ⚡ PASO 3: Insertar Admin (1 minuto)

Ejecuta (reemplaza UUID-AQUI con el UUID del paso 1):

```sql
INSERT INTO admin_users (id, email, is_admin) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'iolmos@arkusnexus.com', true);
```

**Resultado esperado:** ✅ 1 row inserted

---

## ⚡ PASO 4: Actualizar RLS Policies (5 minutos)

Abre [ADMIN_SETUP.md](ADMIN_SETUP.md) y sigue:
- PASO 3: Modificar RLS en `teams`
- PASO 4: Modificar RLS en `members`
- PASO 5: Modificar RLS en `evaluations`
- PASO 6: Modificar RLS en `evidence`

**Nota:** Cada sección primero ELIMINA las políticas antiguas, luego CREA las nuevas.

---

## ✅ Verificación

1. **Cierra sesión de cualquier usuario**
2. **Inicia sesión como admin:** `iolmos@arkusnexus.com`
3. **Deberías ver:**
   - ✅ TODOS los equipos (no solo los tuyos)
   - ✅ TODOS los miembros
   - ✅ TODAS las evaluaciones

Si ves todos los datos, ¡funciona! 🎉

---

## 📝 Lo Que Pasó

| Antes | Después |
|-------|---------|
| Admin solo ve sus datos | Admin ve TODOS los datos |
| Usuario normal ve sus datos | Usuario normal sigue viendo solo sus datos |
| No hay distinción | Admin identificado en tabla |

---

## 🎨 UI (Próximo Paso)

Después, modificaremos la app para que:
- ✅ Admin vea un selector de usuarios
- ✅ Admin pueda elegir qué usuario ver
- ✅ Admin pueda hacer sus propias evaluaciones

---

## ❓ Preguntas

**P: ¿Qué pasa si elimino el admin?**
A: Ya no tendrá acceso especial. Será un usuario normal.

**P: ¿Puedo tener múltiples admins?**
A: Sí. Solo inserta otro registro en tabla `admin_users`.

**P: ¿El admin ve datos del admin de otros?**
A: Sí, todos los admins ven todos los datos de todos.

---

## 📋 Checklist

- [ ] ✅ Obtuviste el UUID de `iolmos@arkusnexus.com`
- [ ] ✅ Creaste tabla `admin_users`
- [ ] ✅ Insertaste admin en la tabla
- [ ] ✅ Eliminaste políticas antiguas en `teams`
- [ ] ✅ Creaste nuevas políticas en `teams`
- [ ] ✅ Eliminaste y creaste políticas en `members`
- [ ] ✅ Eliminaste y creaste políticas en `evaluations`
- [ ] ✅ Eliminaste y creaste políticas en `evidence`
- [ ] ✅ Probaste iniciando sesión como admin

---

**Tiempo total:** ~10 minutos
**Dificultad:** Fácil (copiar-pegar SQL)
**Estado:** Listo para implementar

