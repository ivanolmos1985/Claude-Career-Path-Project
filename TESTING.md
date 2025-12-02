# Testing Checklist - Career Path System en Cloudflare Pages

Cuando tu app esté live en Cloudflare, sigue estos pasos para validar que todo funciona correctamente.

## 1. Acceso Inicial

- [ ] Abre la URL de tu app en Cloudflare Pages
- [ ] ¿La página carga sin errores de red?
- [ ] ¿Ves la pantalla de Login?
- [ ] Abre DevTools (F12) y ve la consola - ¿hay errores rojos?

## 2. Pruebas de Autenticación

### 2.1 Registro
- [ ] Haz click en "Crear una cuenta"
- [ ] Llena los campos: email, contraseña, confirmar contraseña
- [ ] ¿Se valida que las contraseñas tengan al menos 6 caracteres?
- [ ] ¿Coinciden las contraseñas correctamente?
- [ ] Haz click en "Crear cuenta"
- [ ] ¿Ves el mensaje de éxito "🎉 Tu cuenta fue creada correctamente"?
- [ ] ¿Te dice que revises tu email para confirmar?

### 2.2 Login
- [ ] Haz click en "Ir a Iniciar Sesión"
- [ ] Ingresa el email y contraseña que acabas de registrar
- [ ] Haz click en "Entrar"
- [ ] ¿Se redirige a /teams automáticamente?
- [ ] ¿Ves el mensaje de carga mientras valida la sesión?

## 3. Pruebas de Funcionalidad Principal

### 3.1 Gestión de Equipos
- [ ] ¿Estás en la página de Equipos?
- [ ] Llena el campo "Cliente/Proyecto" (ej: "FIGO Team")
- [ ] Llena el campo "Descripción" (ej: "Equipo de desarrollo principal")
- [ ] Haz click en "➕ Crear Equipo"
- [ ] ¿Ves el equipo creado en la lista abajo?
- [ ] ¿Puedes ver el nombre del cliente y la descripción?
- [ ] Haz click en "Gestionar" - ¿te redirige a Miembros?

### 3.2 Gestión de Miembros
- [ ] Llena los campos:
  - Nombre completo: "Juan Pérez"
  - Rol: "developer"
  - Nivel actual: "jr"
  - Nivel objetivo: "mid"
  - Email: "juan@example.com"
- [ ] Haz click en "➕ Agregar Miembro del Equipo"
- [ ] ¿Ves el miembro en la lista?
- [ ] ¿Aparece su nombre, rol y email correctamente?
- [ ] Haz click en "Evaluar" - ¿te redirige a Evaluación?

### 3.3 Evaluación de Competencias
- [ ] ¿Ves el nombre "Juan Pérez" en el título?
- [ ] ¿Ves los botones Q1, Q2, Q3, Q4 para seleccionar trimestre?
- [ ] Selecciona Q1
- [ ] ¿Aparecen las competencias para Developer?
- [ ] Para la primera competencia, haz click en rating 4
- [ ] ¿Se marca como seleccionado (azul)?
- [ ] Escribe algo en el campo "Evidencia..."
- [ ] ¿Se guarda el texto mientras escribes?
- [ ] Haz click en "💾 Guardar Evaluación"
- [ ] ¿Te redirige a Progreso automáticamente?

### 3.4 Progreso
- [ ] ¿Ves "Progreso - Juan Pérez" como título?
- [ ] ¿Ves el objetivo "jr → mid"?
- [ ] ¿Ves los cuatro trimestres (Q1, Q2, Q3, Q4)?
- [ ] ¿Q1 muestra un score (ej: 4/40)?
- [ ] ¿Los otros Q muestran 0/40?
- [ ] Haz click en "Ver Decisión" - ¿te redirige a Decisión?

### 3.5 Decisión
- [ ] ¿Ves "Decisión - Juan Pérez" como título?
- [ ] ¿Ves "Score Q4: X/40"?
- [ ] ¿Ves "Promedio anual (estimado): X/40"?
- [ ] ¿Ves "Umbral requerido: X"?
- [ ] ¿Ves el estado (PROMOCIÓN APROBADA, PENDIENTE, o NO APROBADA)?
- [ ] Haz click en "📄 Exportar Reporte"
- [ ] ¿Descarga un archivo .txt?
- [ ] ¿El contenido del reporte es correcto?

### 3.6 Navegación
- [ ] Haz click en el sidebar "🏢 Equipos" - ¿te redirige a Equipos?
- [ ] Haz click en "👥 Miembros" - ¿te redirige a Miembros?
- [ ] Haz click en "Cerrar sesión" (botón rojo arriba) - ¿te redirige a Login?

## 4. Pruebas de Edición

### 4.1 Eliminar Miembro
- [ ] Login nuevamente
- [ ] Ve a Miembros
- [ ] En la lista de miembros, haz click en "Eliminar" (botón rojo)
- [ ] ¿Pide confirmación ("¿Eliminar miembro...")?
- [ ] Haz click en OK
- [ ] ¿Desaparece de la lista?

### 4.2 Eliminar Equipo
- [ ] Ve a Equipos
- [ ] En la lista de equipos, haz click en "Eliminar" (botón rojo)
- [ ] ¿Pide confirmación ("¿Eliminar equipo...")?
- [ ] Haz click en OK
- [ ] ¿Desaparece de la lista?

## 5. Pruebas de Errores

### 5.1 Validación de Campos
- [ ] Ve a Equipos
- [ ] Intenta crear un equipo sin nombre del cliente
- [ ] ¿Aparece alerta "Cliente requerido"?
- [ ] Ve a Miembros
- [ ] Intenta agregar miembro sin nombre
- [ ] ¿Aparece alerta "Completa nombre y email"?

### 5.2 Validación de Contraseña
- [ ] Logout
- [ ] Ve a Crear Cuenta
- [ ] Intenta contraseña menor a 6 caracteres
- [ ] ¿Aparece error "La contraseña debe tener al menos 6 caracteres"?
- [ ] Intenta contraseñas que no coinciden
- [ ] ¿Aparece error "Las contraseñas no coinciden"?

## 6. Pruebas de Persistencia

### 6.1 Guardar en localStorage
- [ ] Crea un equipo y un miembro
- [ ] Recarga la página (F5)
- [ ] ¿Siguen ahí el equipo y el miembro?

### 6.2 Logout y Reapertura
- [ ] Haz logout
- [ ] Cierra completamente el navegador
- [ ] Abre la app nuevamente
- [ ] ¿Te pide login?
- [ ] ¿Después de login vuelves a ver los datos?

## 7. Pruebas de Rendimiento

- [ ] ¿La app carga en menos de 3 segundos?
- [ ] ¿Los clics responden inmediatamente?
- [ ] ¿No hay lag al escribir en los campos?
- [ ] ¿Las transiciones entre páginas son suaves?

## 8. Pruebas Avanzadas (Opcional)

### 8.1 Múltiples Equipos y Miembros
- [ ] Crea 3 equipos diferentes
- [ ] En cada equipo, crea 2-3 miembros
- [ ] Completa evaluaciones para varios miembros
- [ ] ¿Todo funciona sin problemas?

### 8.2 Múltiples Trimestres
- [ ] Evalúa a un miembro en Q1, Q2, Q3, Q4
- [ ] En cada trimestre, califica todas las competencias
- [ ] Ve a Progreso - ¿muestra scores para todos los Q?
- [ ] Ve a Decisión - ¿el promedio es correcto?

---

## Resumen

Si ✅ pasas todas las pruebas, tu app está **100% lista para producción**.

Si ❌ encuentras errores, anota el paso exacto y el error, y reporta para arreglar.

---

**Última actualización**: 2025-12-02
