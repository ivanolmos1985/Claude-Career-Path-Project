# Cómo Crear Usuarios en la Base de Datos

**Fecha:** 2025-12-03
**Status:** ✅ Registro público deshabilitado

---

## 📋 Resumen

Ya no hay acceso público a `/register`. Solo administradores pueden crear usuarios manualmente.

Hay **3 formas** de crear usuarios:

1. **Opción A:** Supabase Auth Console (Recomendado)
2. **Opción B:** Base de datos SQL directa
3. **Opción C:** API de Supabase (con token de admin)

---

## ✅ Opción A: Supabase Auth Console (RECOMENDADO)

Esta es la **forma más segura y recomendada** porque:
- Crea usuario en Auth y tabla `users` automáticamente
- Genera contraseña segura
- Envía email de confirmación
- Fácil de reversar si hay error

### Pasos:

1. **Ir a Supabase Dashboard**
   ```
   https://app.supabase.com/
   ```

2. **Seleccionar tu proyecto**

3. **Ir a Authentication → Users**
   ```
   Left sidebar → Authentication → Users
   ```

4. **Click en "Invite user"** (botón azul arriba)
   ```
   O si no ves el botón:
   → "Invite new user" en la esquina
   ```

5. **Llenar el formulario:**
   ```
   Email: usuario@empresa.com
   Password: [Supabase genera una automática]
           O escribe una manualmente
   ```

6. **Click "Send invite"**

7. **El usuario recibe:**
   - Email de confirmación
   - Link para verificar email
   - Puede entrar al sistema

### Ventajas:
- ✅ Automático en ambos sistemas (Auth + BD)
- ✅ Validación integrada
- ✅ Email de confirmación automático
- ✅ Fácil de gestionar
- ✅ Seguro

### Desventajas:
- ✗ Requiere acceso a Supabase Dashboard

---

## 📊 Opción B: Crear Manual en Base de Datos

Si necesitas **crear usuario sin enviar email de invitación**:

### Paso 1: Crear usuario en Supabase Auth

En Supabase Dashboard:
1. Authentication → Users
2. Buscar usuario que ya existe
3. O crear manualmente (ver Opción A)

**Nota:** Para acceso offline o automatizado, ver Opción C

### Paso 2: Crear perfil en tabla `users`

En Supabase Dashboard:
1. SQL Editor → New Query
2. Copiar y ejecutar este SQL:

```sql
INSERT INTO users (
  id,
  email,
  full_name,
  created_at
)
VALUES (
  'user-id-aqui',  -- ID del usuario de Auth
  'usuario@empresa.com',
  'Nombre del Usuario',
  NOW()
)
ON CONFLICT (id) DO NOTHING;
```

**Donde obtener el `user-id`:**
1. Ir a Authentication → Users
2. Click en el usuario
3. Copiar el campo "ID"

### Ejemplo completo:

```sql
-- Crear usuario con ID conocido
INSERT INTO users (
  id,
  email,
  full_name,
  created_at
)
VALUES (
  '123e4567-e89b-12d3-a456-426614174000',
  'juan.perez@empresa.com',
  'Juan Pérez',
  NOW()
);
```

### Verificar que se creó:

```sql
SELECT id, email, full_name, created_at
FROM users
WHERE email = 'juan.perez@empresa.com';
```

**Resultado esperado:**
```
id                                   | email                  | full_name    | created_at
-------------------------------------+------------------------+--------------+------------------
123e4567-e89b-12d3-a456-426614174000 | juan.perez@empresa.com | Juan Pérez   | 2025-12-03...
```

---

## 🔐 Opción C: API REST de Supabase (Avanzado)

Para **crear usuarios programáticamente** sin Dashboard:

### Requisitos:
- Token de Admin de Supabase
- URL del proyecto
- Conocimiento de API REST

### Paso 1: Obtener Token de Admin

En Supabase Dashboard:
1. Settings → API
2. Copiar "service_role key" (⚠️ MUY SECRETO)
   ```
   Never commit this to Git!
   Keep it in environment variables only
   ```

### Paso 2: Usar cURL para crear usuario

```bash
curl -X POST \
  'https://YOUR_PROJECT.supabase.co/auth/v1/admin/users' \
  -H 'Authorization: Bearer YOUR_SERVICE_ROLE_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "usuario@empresa.com",
    "password": "TemporaryPassword123!",
    "email_confirm": true
  }'
```

**Reemplazar:**
- `YOUR_PROJECT` → Tu project ID
- `YOUR_SERVICE_ROLE_KEY` → Token copiado arriba

### Paso 3: Crear perfil en tabla `users`

```bash
curl -X POST \
  'https://YOUR_PROJECT.supabase.co/rest/v1/users' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "id": "USER_ID_FROM_AUTH",
    "email": "usuario@empresa.com",
    "full_name": "Nombre del Usuario"
  }'
```

### Versión con Node.js:

```javascript
const createUser = async (email, password, fullName) => {
  // Crear en Auth
  const authResponse = await fetch(
    'https://YOUR_PROJECT.supabase.co/auth/v1/admin/users',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: true
      })
    }
  )

  const authUser = await authResponse.json()
  const userId = authUser.user.id

  // Crear perfil en BD
  const profileResponse = await fetch(
    'https://YOUR_PROJECT.supabase.co/rest/v1/users',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: userId,
        email,
        full_name: fullName
      })
    }
  )

  return profileResponse.json()
}

// Usar
await createUser(
  'nuevo@empresa.com',
  'password123',
  'Nuevo Usuario'
)
```

---

## 📋 Comparación de Métodos

| Aspecto | Opción A (Dashboard) | Opción B (SQL) | Opción C (API) |
|--------|---------------------|----------------|----------------|
| **Facilidad** | ⭐⭐⭐⭐⭐ (Muy fácil) | ⭐⭐⭐ (Media) | ⭐ (Compleja) |
| **Seguridad** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Automático** | ✓ Sí | ✗ Manual | ✓ Sí |
| **Email enviado** | ✓ Sí | ✗ No | ✓ Sí |
| **Requiere Dashboard** | ✓ Sí | ✓ Sí (SQL Editor) | ✗ No |
| **Mejor para** | Creación manual | Scripts rápidos | Automatización |

---

## ⚠️ Errores Comunes

### Error 1: "Duplicate key value violates unique constraint"

**Causa:** El usuario ya existe

**Solución:**
```sql
-- Verificar si existe
SELECT * FROM users WHERE email = 'usuario@empresa.com';

-- Si ya existe, actualizar en lugar de insertar
UPDATE users
SET full_name = 'Nuevo Nombre'
WHERE email = 'usuario@empresa.com';
```

### Error 2: "Foreign key constraint violated"

**Causa:** El ID de Auth no existe

**Solución:**
1. Crear usuario en Auth primero (Opción A)
2. Copiar el ID exacto
3. Luego crear en tabla `users` con ese ID

### Error 3: "user_id does not exist"

**Causa:** El usuario de Auth no está ligado a tabla `users`

**Solución:**
```sql
-- Verificar que existe en Auth
SELECT id FROM auth.users WHERE email = 'usuario@empresa.com';

-- Crear en tabla users con el mismo ID
INSERT INTO users (id, email, full_name)
VALUES ('ID_COPIADO_ARRIBA', 'usuario@empresa.com', 'Nombre');
```

---

## 🔄 Flujo Completo de Creación (Opción A)

```
1. Dashboard → Authentication → Users
                    ↓
2. Click "Invite user"
                    ↓
3. Email: usuario@empresa.com
   Password: [Auto-generada o manual]
                    ↓
4. Click "Send invite"
                    ↓
5. Usuario recibe email
                    ↓
6. Usuario verifica email
                    ↓
7. Usuario va a /login
                    ↓
8. Ingresa credenciales
                    ↓
9. ✅ Acceso completo al sistema
```

---

## 🔐 Seguridad

### ✅ Buenas prácticas:

1. **Usar Opción A (Dashboard)**
   - Más seguro
   - Integrado con Supabase
   - Auditoría automática

2. **Nunca compartir credenciales**
   - Service role key solo en servidor
   - Nunca en Git
   - Usar environment variables

3. **Verificar email siempre**
   - Asegura que usuario es real
   - Previene spam

4. **Usar contraseñas seguras**
   - Mínimo 8 caracteres
   - Incluir mayúsculas, números, símbolos
   - Cambiar en primer login

### ❌ No hacer:

- ✗ Commitear tokens en Git
- ✗ Enviar credenciales por email
- ✗ Crear usuarios sin verificar email
- ✗ Usar contraseña default forever

---

## 📞 Troubleshooting

### Usuario creado pero no puede loguearse

1. Verificar que email está confirmado:
   ```sql
   SELECT email, confirmed_at FROM auth.users WHERE email = 'usuario@empresa.com';
   ```

2. Si `confirmed_at` es NULL, confirmar:
   ```sql
   UPDATE auth.users
   SET confirmed_at = NOW()
   WHERE email = 'usuario@empresa.com';
   ```

3. Verificar que perfil existe en tabla `users`:
   ```sql
   SELECT * FROM users WHERE email = 'usuario@empresa.com';
   ```

### Usuario aparece duplicado

No debería pasar con Opción A (Dashboard).

Si pasó con SQL:
```sql
-- Buscar duplicados
SELECT email, COUNT(*)
FROM users
GROUP BY email
HAVING COUNT(*) > 1;

-- Borrar duplicado (mantener el más reciente)
DELETE FROM users
WHERE email = 'usuario@empresa.com'
AND id NOT IN (
  SELECT id FROM users
  WHERE email = 'usuario@empresa.com'
  ORDER BY created_at DESC
  LIMIT 1
);
```

---

## 📊 Información de Usuario

Después de crear, puedes ver:

```sql
-- Ver todos los usuarios
SELECT id, email, full_name, created_at
FROM users
ORDER BY created_at DESC;

-- Ver usuario específico
SELECT *
FROM users
WHERE email = 'usuario@empresa.com';

-- Contar usuarios
SELECT COUNT(*) as total_usuarios
FROM users;
```

---

## 🎯 Resumen Rápido

**Para crear usuario:**

### Opción A (Recomendada):
1. Dashboard → Auth → Users
2. "Invite user"
3. Email + Password
4. Send invite ✓

### Opción B (Quick):
1. SQL Editor
2. INSERT INTO users (id, email, full_name)
3. VALUES ('...', '...', '...')
4. Execute ✓

### Opción C (Advanced):
1. API call con token admin
2. Crear en Auth
3. Crear en BD ✓

---

**Last Updated:** 2025-12-03
**Status:** Registro público deshabilitado
**Ruta /register:** ❌ No accesible

