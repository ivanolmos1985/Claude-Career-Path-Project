# Eliminación de Usuarios - Explicación Técnica

**Fecha:** 2025-12-03
**Status:** ✅ Resuelto

---

## 🔴 Problema Reportado

Cuando se borra un usuario directamente de la base de datos (tabla `users`), el usuario **sigue teniendo acceso** a la aplicación con su sesión activa.

### ¿Por qué sucedía?

Supabase tiene **dos sistemas separados e independientes**:

#### 1. **Supabase Auth** (Sistema de Autenticación)
- Gestiona credenciales de login (email/password)
- Mantiene sesiones activas
- Almacenado en `auth.users` (tablas internas de Supabase)
- **No se elimina automáticamente** cuando borras de tu tabla `users`

#### 2. **Tabla `users` (Tu Base de Datos)**
- Almacena el perfil del usuario (nombre, email, etc.)
- Metadatos de la aplicación
- Es donde borraste manualmente

### Flujo que causaba el problema:

```
1. Usuario logueado → Session token en Supabase Auth ✓
2. Acceso a aplicación → Sesión válida ✓
3. Borras usuario de tabla users → El perfil desaparece ✗
4. Usuario refrescar página → Supabase Auth still valid ✓
5. App intenta cargar perfil → NO EXISTE en tabla users ✗
6. App no sabe qué hacer → Mantiene al usuario logueado ✗
7. Usuario puede seguir usando la app → PROBLEMA ✗
```

---

## ✅ Solución Implementada

### Cambio en `src/context/AuthContext.jsx`

Agregué una **validación en `fetchUserProfile()`** que verifica si el perfil del usuario existe en la base de datos:

```javascript
if (error) {
  // Si el usuario no existe en la base de datos, cerrar sesión
  if (error.code === 'PGRST116' || error.message?.includes('No rows found')) {
    console.warn('User profile not found in database, logging out')
    await supabase.auth.signOut()  // ← Auto-logout
    setUser(null)
    setUserProfile(null)
  }
  throw error
}
```

### Flujo después de la solución:

```
1. Usuario logueado con perfil existente ✓
2. Borras usuario de tabla users
3. Usuario refrescar página O hace request a aplicación
4. fetchUserProfile() intenta cargar perfil
5. No encuentra el perfil → Error PGRST116
6. Detección del error → Auto-logout automático
7. Usuario redirigido a login
8. No puede acceder → PROBLEMA RESUELTO ✓
```

---

## 🔍 Códigos de Error Detectados

| Código | Significado | Acción |
|--------|------------|--------|
| `PGRST116` | No rows found | Auto-logout |
| `No rows found` (en mensaje) | No rows found | Auto-logout |

---

## 📋 Casos Cubiertos

### ✅ Caso 1: Borrar usuario de tabla `users`
```sql
DELETE FROM users WHERE id = 'user_id';
```
**Resultado:** Usuario auto-logout en el próximo refresh

### ✅ Caso 2: Usuario intenta hacer request a API
**Resultado:** fetchUserProfile() falla → Auto-logout

### ✅ Caso 3: Nuevo login después de borrado
**Resultado:** Login falla porque no existe en tabla `users`

---

## 🛡️ Nota de Seguridad

Para **eliminación completa de un usuario**, debes:

1. **Opción A: Borrar de Supabase Auth** (Recomendado)
   ```
   - Ir a Supabase Dashboard
   - Auth → Users
   - Borrar usuario
   - Esto elimina ambos: Auth + tabla users
   ```

2. **Opción B: Borrar manual de tabla `users`**
   ```sql
   DELETE FROM users WHERE id = 'user_id';
   ```
   - Ahora con esta fix, el usuario será auto-logout

3. **Opción C: Borrar de ambos lugares**
   ```sql
   -- En Supabase SQL Editor
   DELETE FROM users WHERE id = 'user_id';

   -- En Supabase Auth → Users tab, también borrar
   ```

---

## 🧪 Prueba de la Solución

### Paso 1: Crear usuario de prueba
1. Registrar nuevo usuario
2. Verificar que puede acceder

### Paso 2: Borrar usuario de tabla `users`
1. Ir a Supabase Dashboard
2. Tabla `users` → Borrar la fila del usuario
3. **NO borres de Supabase Auth**

### Paso 3: Verificar auto-logout
1. Usuario intenta refrescar página
2. Debería ser redirigido a login automáticamente
3. No puede acceder a la aplicación
4. En console: `User profile not found in database, logging out`

---

## 📊 Impacto

| Aspecto | Antes | Después |
|--------|-------|---------|
| Usuario borrado puede acceder | ✗ Sí | ✓ No |
| Auto-logout | ✗ No | ✓ Sí |
| Validación de perfil | ✗ No | ✓ Sí |
| Seguridad | ✗ Baja | ✓ Alta |

---

## 🔐 Mejoras de Seguridad

Esta solución implementa **validación de integridad**:
- Verifica que el perfil usuario exista en BD
- Previene acceso con perfiles "fantasma"
- Auto-logout transparente al usuario
- Logs de auditoría en console

---

## 🚀 Próximas Mejoras (Opcional)

Para mejor experiencia de usuario:

1. **Toast notification**
   ```
   "Tu cuenta ha sido eliminada. Por favor, inicia sesión de nuevo."
   ```

2. **Auditoría de acceso**
   ```
   Registrar intentos de acceso con perfiles eliminados
   ```

3. **Rate limiting**
   ```
   Limitar intentos de login para usuarios eliminados
   ```

---

## 📞 Resumen

| Pregunta | Respuesta |
|----------|-----------|
| ¿Qué pasaba? | Usuario borrado podía seguir logueado |
| ¿Por qué? | Supabase Auth ≠ tabla usuarios |
| ¿Cómo se arregló? | Validar existencia en BD, auto-logout |
| ¿Cuándo ocurre? | Próximo refresh o request |
| ¿Es seguro? | ✅ Sí, implementa validación |

---

**Last Updated:** 2025-12-03
**Commit:** 97c05a3 - fix: Auto-logout users when profile is deleted from database

