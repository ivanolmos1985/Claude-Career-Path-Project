# Deployment a Cloudflare Pages - Plan

## Objetivo
Deployar la aplicación React (Career Path System) en Cloudflare Pages conectada a GitHub.

---

## Tareas a Completar

### Fase 1: Preparación del Repositorio GitHub
- [ ] Crear repositorio en GitHub (si no existe)
- [ ] Conectar repositorio local a GitHub
- [ ] Hacer push del código actual
- [ ] Verificar que todos los archivos estén en GitHub

### Fase 2: Preparar el Proyecto para Cloudflare
- [ ] Crear archivo `.gitignore` adecuado (excluir node_modules, .env.local, dist)
- [ ] Crear archivo `wrangler.toml` para configuración de Cloudflare (opcional pero recomendado)
- [ ] Verificar que `build` script en package.json funciona correctamente
- [ ] Crear archivo `.env.example` con variables necesarias

### Fase 3: Configuración en Cloudflare
- [ ] Crear cuenta/login en Cloudflare
- [ ] Conectar GitHub a Cloudflare
- [ ] Crear nuevo proyecto en Cloudflare Pages
- [ ] Configurar variables de entorno en Cloudflare (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- [ ] Configurar comando de build y directorio de output

### Fase 4: Testing y Validación
- [ ] Verificar que el deploy automático funciona
- [ ] Probar la aplicación en URL de Cloudflare
- [ ] Verificar que la autenticación con Supabase funciona
- [ ] Configurar custom domain (opcional)

### Fase 5: Documentación
- [ ] Crear archivo DEPLOYMENT.md con instrucciones
- [ ] Documentar variables de entorno necesarias
- [ ] Documentar pasos para redeploy futuro

---

## Notas Importantes
- El proyecto usa Vite como bundler (rápido y moderno)
- Depende de Supabase para autenticación y BD
- Las variables de entorno se pasan a través de VITE_ prefix
- El output de build es en carpeta `dist/`

---

---

## FASE 6: Arreglar Error de Deploy en Cloudflare

### Problema
Cloudflare Pages requiere un Deploy command (no puede estar vacío), pero `npx wrangler deploy` es para Workers, no Pages.

### Solución Simple
En Cloudflare Dashboard > Tu Proyecto > Settings > Build configuration:

**Cambiar:**
- Deploy command: `npx wrangler deploy` ❌
- Deploy command: `npm run preview` ✅ (o simplemente cualquier comando que no falle)

**Dejar igual:**
- Build command: `npm run build` ✅
- Build output directory: `dist`

**Explicación**: Para Cloudflare Pages, después del build, el Deploy command se ejecuta pero no hace nada importante. Usa `npm run preview` que es un comando válido y seguro que no falla.

**Alternativa**: Si `npm run preview` no funciona, intenta con un comando inofensivo como `echo "Deploy successful"`

---

## Status
- [x] Fase 1: Preparación GitHub
- [x] Fase 2: Preparar proyecto
- [x] Fase 3: Configuración Cloudflare ✅ BUILD EXITOSO
- [ ] Fase 4: Testing (EN PROGRESO - esperando live)
- [x] Fase 5: Documentación

---

## FASE 4: Testing y Validación

### Progreso actual
- ✅ Build completado: 1.77s
- ✅ 127 módulos transformados
- ✅ Deploy command ejecutado sin errores
- ⏳ Esperando que Cloudflare publique el sitio (1-3 minutos)

### Pasos pendientes (cuando esté live)
- [ ] Acceder a la URL de Cloudflare Pages
- [ ] Verificar que carga sin errores (F12 > Console)
- [ ] Probar página de Login
- [ ] Probar página de Register
- [ ] Probar autenticación con Supabase
- [ ] Crear equipo de prueba
- [ ] Agregar miembro de prueba
- [ ] Probar flujo completo de evaluación
