# 📚 Documentación de Usuarios y Autenticación

## 📖 Índice

Este proyecto tiene documentación sobre cómo registrar y gestionar usuarios:

---

### 1. **QUICK_START_USERS.md** ⚡ (COMIENZA AQUÍ)
**Para:** Los que quieren implementar RÁPIDO (5 minutos)

📄 Guía ultra-rápida con:
- 1 script SQL para copiar-pegar
- Verificación inmediata
- Perfecto si tienes prisa

**Tiempo:** ~5 minutos
**Nivel:** Para no-programadores

**👉 Lee esto primero si quieres empezar ya**

---

### 2. **USERS_TABLE_SETUP.md** 📋 (IMPLEMENTACIÓN DETALLADA)
**Para:** Entender qué estás haciendo y por qué

📄 Guía completa con:
- Explicación de qué es cada columna
- Por qué necesitamos esta tabla
- Cómo funcionan los triggers
- Troubleshooting detallado
- Queries útiles para testing

**Tiempo:** ~15 minutos
**Nivel:** Técnico pero claro

**👉 Lee esto si quieres entender todo**

---

## 🎯 ¿Qué Hace Esta Tabla?

### Problema Original
Supabase tiene `auth.users` (tabla de autenticación), pero la aplicación NO puede acceder a ella directamente por seguridad.

### Solución
Crear tabla `users` que:
- ✅ Se sincroniza automáticamente con `auth.users`
- ✅ Permite que la app acceda a datos del usuario
- ✅ Tiene Row Level Security para proteger datos
- ✅ Se llena automáticamente al registrar

---

## 📊 Estructura de la Tabla

```
users
├── id (UUID) - Tu ID único de Supabase
├── email (VARCHAR) - Tu email
├── full_name (VARCHAR) - Tu nombre (opcional)
├── created_at (TIMESTAMP) - Cuándo te registraste
└── updated_at (TIMESTAMP) - Última actualización
```

---

## 🔄 Flujo Automático

```
Usuario hace clic en "Crear Cuenta"
    ↓
Supabase Auth crea registro en auth.users
    ↓
TRIGGER automático ejecuta función handle_new_user()
    ↓
Se inserta registro en tabla users
    ↓
Usuario aparece en Table Editor
```

---

## 🚀 Pasos para Implementar

### Opción A: Rápida (5 minutos)
1. Abre `QUICK_START_USERS.md`
2. Copia el SQL
3. Ejecuta en Supabase SQL Editor
4. ¡Listo!

### Opción B: Entender Todo (15 minutos)
1. Lee `USERS_TABLE_SETUP.md` (PASO 1)
2. Copia y ejecuta SQL de tabla
3. Lee `USERS_TABLE_SETUP.md` (PASO 2)
4. Copia y ejecuta SQL del trigger
5. Verifica siguiendo pasos de verificación
6. ¡Listo!

---

## 📝 Después de Implementar

La tabla `users` ahora registra automáticamente:

✅ Cada nuevo usuario que se registra
✅ Su email
✅ Cuándo se registró
✅ Metadata del usuario

**La app puede acceder a estos datos sin problemas.**

---

## 🔍 Verificación Rápida

1. **Abre tu app**
2. **Crea una cuenta nueva**
3. **Ve a Supabase Dashboard**
4. **Table Editor → users**
5. **¿Ves tu usuario?** → ¡Funciona! 🎉

---

## 📚 Documentación del Proyecto

Archivos relacionados en el proyecto:

```
├── QUICK_START_USERS.md          ← Guía rápida (5 min)
├── USERS_TABLE_SETUP.md          ← Implementación (15 min)
├── README_USERS.md               ← Este archivo
│
├── README_DATABASE.md            ← Guía de base de datos general
├── SUPABASE_DATABASE_SETUP.md    ← Setup de tablas (teams, members, etc)
├── DATABASE_SCHEMA.md            ← Esquema técnico
├── RLS_POLICIES_SETUP.md         ← Políticas de seguridad
│
├── GIT_DEPLOY_GUIDE.md           ← Cómo hacer deploy
├── VERIFY_RLS.md                 ← Verificar RLS
```

---

## ❓ Preguntas Frecuentes

**P: ¿Qué diferencia hay entre auth.users y la tabla users?**
A: `auth.users` es de Supabase Auth (privado, no accesible). La tabla `users` es tu copia sincronizada (accesible desde la app).

**P: ¿Qué pasa si me registro dos veces con el mismo email?**
A: El trigger actualiza el registro existente. No hay duplicados.

**P: ¿Puedo modificar la tabla users manualmente?**
A: Sí, pero los cambios se sobrescriben si Supabase Auth se actualiza.

**P: ¿Es obligatorio crear esta tabla?**
A: No, pero es muy recomendable si quieres acceder a datos de usuario desde la app.

---

## 🆘 Troubleshooting

### Usuario no aparece después de registrar
**Verificar:**
1. ¿Se ejecutó el SQL sin errores?
2. ¿La función `handle_new_user` existe?
3. ¿El trigger `on_auth_user_created` existe?
4. Abre Supabase Logs para ver si hay errores

### Error "relation users already exists"
**Solución:** La tabla ya existe. Ve a Table Editor y verifica.

### Error "permission denied"
**Solución:** Las políticas RLS pueden estar incorrectas.

---

## 🎓 Conceptos Clave

**Tabla:** Estructura con filas y columnas que guarda datos
**Trigger:** Función que ejecuta automáticamente cuando algo pasa
**RLS:** Row Level Security - cada usuario ve solo sus datos
**UUID:** ID único universal (no es un número simple)
**Foreign Key:** Conexión entre tablas

---

## 📞 Soporte

Si algo no funciona:
1. Lee el section "Troubleshooting" arriba
2. Verifica que copiaste el SQL correctamente
3. Comparte el error con el mensaje exacto

---

## ✨ Status

- [x] Documentación creada
- [x] Scripts SQL listos
- [x] Ejemplos incluidos
- [ ] Tabla creada en tu Supabase (tú lo haces)

**Próximo paso:** Abre `QUICK_START_USERS.md` y sigue los pasos.

---

**Última actualización:** 2025-12-02
**Versión:** 1.0
**Estado:** Listo para implementar

