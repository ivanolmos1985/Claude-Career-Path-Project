# Verificar que RLS está Configurado Correctamente

## ✅ Las políticas YA EXISTEN

El error "policy already exists" significa que las políticas de RLS ya fueron creadas en Supabase.

**Esto es BUENO** - significa que tu base de datos ya está configurada correctamente.

---

## 🔍 PASOS PARA VERIFICAR

### En Supabase Dashboard:

1. **Ve a Table Editor**
2. **Selecciona la tabla `teams`**
3. **Busca el icono de RLS** (arriba a la derecha, parece un candado o escudo)
4. **Haz clic en el icono RLS**
5. **Deberías ver estas 4 políticas:**
   - ✅ Users can read their own teams (SELECT)
   - ✅ Users can create their own teams (INSERT)
   - ✅ Users can update their own teams (UPDATE)
   - ✅ Users can delete their own teams (DELETE)

### Repite para cada tabla:
- ✅ teams (4 políticas)
- ✅ members (4 políticas)
- ✅ evaluations (4 políticas)
- ✅ evidence (4 políticas)
- ℹ️ competencies (0 políticas - es correcta así, es pública)

---

## ✅ Si todo está en verde:

¡Significa que tu base de datos está COMPLETAMENTE configurada!

Ahora prueba:

1. **Abre tu app**
2. **Crea un equipo** - Debería funcionar ✅
3. **Intenta agregar un miembro** - Debería funcionar ✅
4. **Verifica en Supabase que los datos se guardaron** ✅

---

## 🆘 Si algo no funciona:

### Opción 1: Las políticas NO están
Si NO ves ninguna política en una tabla, copia los scripts de `RLS_POLICIES_SETUP.md` para ESA tabla solamente.

### Opción 2: Las políticas están pero dice "permission denied"
- Significa: Las políticas están correctas pero Supabase las está rechazando
- Solución: Verifica que tu `user_id` esté correctamente configurado en las tablas

### Opción 3: Quieres empezar de cero
Si quieres eliminar todas las políticas y crearlas de nuevo:

```sql
-- Elimina todas las políticas
DROP POLICY IF EXISTS "Users can read their own teams" ON teams;
DROP POLICY IF EXISTS "Users can create their own teams" ON teams;
DROP POLICY IF EXISTS "Users can update their own teams" ON teams;
DROP POLICY IF EXISTS "Users can delete their own teams" ON teams;

-- Luego copia los scripts de RLS_POLICIES_SETUP.md
```

---

## 🎯 Próximo Paso:

**Prueba ahora mismo agregando un miembro desde tu app.**

Si funciona, ¡felicidades! Tu base de datos está lista.

Si no funciona, abre la consola (F12) y dame el error que ves.

---

**Resumen:** Las políticas ya existen. Verifica que estén todas en Supabase y luego prueba la app.
