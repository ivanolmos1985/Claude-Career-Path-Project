# Agregar columna job_role a tabla users

## Descripción
Se necesita agregar una columna `job_role` a la tabla `users` para poder almacenar el rol de trabajo del usuario y mostrarlo en el Dashboard.

## Script SQL

Ejecuta este script en la consola SQL de Supabase:

```sql
-- Agregar columna job_role a la tabla users
ALTER TABLE users
ADD COLUMN job_role VARCHAR(255) DEFAULT 'Not Set';

-- Agregar comentario a la columna (opcional)
COMMENT ON COLUMN users.job_role IS 'El rol de trabajo del usuario (ej: Senior Developer, Project Manager, etc.)';
```

## Pasos para ejecutar en Supabase:

1. Ve a tu proyecto Supabase en https://supabase.com
2. Abre el "SQL Editor"
3. Copia y pega el script SQL anterior
4. Haz click en "Run"
5. Verifica que la columna se agregó correctamente

## Cómo llenar la columna:

Después de agregar la columna, puedes actualizar los valores con un UPDATE como este:

```sql
-- Actualizar un usuario específico
UPDATE users
SET job_role = 'Senior Developer'
WHERE id = 'user-id-here';

-- O actualizar múltiples usuarios
UPDATE users
SET job_role = 'Project Manager'
WHERE email LIKE '%@example.com';
```

## Verificar la columna

Para verificar que la columna fue agregada correctamente, ejecuta:

```sql
SELECT id, email, full_name, job_role FROM users LIMIT 10;
```

## Después de agregar la columna

Una vez que la columna esté agregada, el Dashboard automáticamente:
- Mostrará el `job_role` del usuario logueado en el card "Job Role"
- Si no hay valor, mostrará "Not Set" como default

No se necesitan cambios en el código de la aplicación, ya que el Dashboard está preparado para obtener este dato del usuario.
