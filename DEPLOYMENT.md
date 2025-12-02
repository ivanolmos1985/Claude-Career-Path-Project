# Guía de Deployment - Career Path System

## Deployment en Cloudflare Pages

Esta guía te muestra cómo deployar la aplicación en Cloudflare Pages conectada a GitHub.

---

## Requisitos Previos
- [ ] Cuenta de GitHub
- [ ] Cuenta de Cloudflare (gratuita funciona)
- [ ] Git instalado en tu máquina
- [ ] Variables de Supabase (VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY)

---

## PASO 1: Configurar Git Localmente

### 1.1 Inicializar repositorio git (si no está inicializado)
```bash
cd "c:\Users\Arkus Nexus\Desktop\Calude Proyecto Career Path en React"
git init
```

### 1.2 Agregar archivos al staging
```bash
git add .
```

### 1.3 Hacer el primer commit
```bash
git commit -m "Initial commit: Career Path System setup for Cloudflare deployment"
```

### 1.4 Cambiar rama a main (si está en master)
```bash
git branch -M main
```

---

## PASO 2: Crear Repositorio en GitHub

### 2.1 Ir a GitHub.com
- Accede a https://github.com
- Inicia sesión o crea cuenta

### 2.2 Crear nuevo repositorio
- Click en "+" (arriba a la derecha)
- Selecciona "New repository"
- Nombre: `career-path-react` (o el que prefieras)
- Descripción: "Career Path Evaluation System with React, Vite, and Supabase"
- Selecciona "Public" o "Private" (recomendado Private si contiene credenciales)
- NO inicialices con README, .gitignore ni licencia (ya los tenemos)
- Click "Create repository"

### 2.3 Copiar la URL HTTPS
En GitHub, después de crear el repo, verás la URL HTTPS. Cópiala (algo como: `https://github.com/TU_USUARIO/career-path-react.git`)

---

## PASO 3: Conectar Repositorio Local a GitHub

En tu terminal (en la carpeta del proyecto):

```bash
git remote add origin https://github.com/TU_USUARIO/career-path-react.git
git push -u origin main
```

Reemplaza `TU_USUARIO` con tu usuario de GitHub.

---

## PASO 4: Configurar Cloudflare Pages

### 4.1 Acceder a Cloudflare Dashboard
- Ve a https://dash.cloudflare.com
- Inicia sesión o crea cuenta gratis

### 4.2 Crear nuevo proyecto en Pages
- En el sidebar izquierdo, selecciona "Pages"
- Click en "Create a project"
- Selecciona "Connect to Git"

### 4.3 Autorizar GitHub
- Click en "GitHub" (si te pide autorización, autoriza)
- Selecciona tu repositorio `career-path-react`
- Click "Begin setup"

### 4.4 Configurar el Build y Deploy
En la pantalla "Set up builds and deployments":

**Framework preset**: Vite (o None si no aparece)

**Build command**:
```
npm run build
```

**Deploy command** (⚠️ CRÍTICO - Cambiar si es necesario):
```
npm run preview
```

Si ves `npx wrangler deploy` en Deploy command, **CÁMBIALO a `npm run preview`**. Este comando es seguro y no causa errores en Cloudflare Pages.

**Build output directory**:
```
dist
```

Click "Save and Deploy"

### 4.5 Configurar Variables de Entorno
Cloudflare mostrará un screen de configuración. Aquí debes agregar:

**Environment variables** (Production):
- Name: `VITE_SUPABASE_URL`
  Value: Tu URL de Supabase (ej: `https://xrkriumgdrhbmoakusai.supabase.co`)

- Name: `VITE_SUPABASE_ANON_KEY`
  Value: Tu clave anónima de Supabase

Click "Deploy"

---

## PASO 5: Verificar el Deployment

### 5.1 Esperar a que compile
Cloudflare compilará tu proyecto automáticamente. Verás un link como:
```
https://career-path-react.pages.dev
```

### 5.2 Probar la aplicación
- Abre el link en tu navegador
- Intenta registrarte y login
- Verifica que la autenticación con Supabase funciona

### 5.3 Ver logs de build
En el dashboard de Cloudflare > Pages > Tu proyecto > Deployments, puedes ver logs si algo falla.

---

## PASO 6: Configurar Dominio Personalizado (Opcional)

Si tienes un dominio propio:

1. En Cloudflare Pages > Tu proyecto
2. Click en "Custom domains"
3. Agrega tu dominio
4. Sigue los pasos para actualizar DNS

---

## Flujo Futuro: Deployments Automáticos

A partir de ahora, cada vez que hagas push a GitHub:

```bash
git add .
git commit -m "Tu mensaje"
git push origin main
```

**Cloudflare detectará automáticamente el cambio y hará deploy en ~2-5 minutos.**

---

## Troubleshooting

### Error: "Build failed" con Deploy command incorrecto
**SOLUCIÓN**: Este es el error más común. Cloudflare por defecto pone `npx wrangler deploy` en Deploy command, que no funciona con Pages.

1. Ve a Cloudflare Dashboard > Tu Proyecto > Settings
2. En "Build configuration", busca **"Deploy command"**
3. **Cambia de**: `npx wrangler deploy` ❌
4. **Cambia a**: `npm run preview` ✅
5. Asegúrate que "Build command" sea `npm run build`
6. Guarda los cambios
7. Cloudflare hará redeploy automáticamente (~2-5 minutos)

### Error: "Build failed" con otro mensaje
- Verifica que el comando `npm run build` funciona localmente (corre: `npm run build`)
- Revisa los logs detallados en Cloudflare dashboard > Deployments > último deployment
- Si ves error de módulos faltantes, intenta `npm install` localmente

### Variables de entorno no funcionan
- Asegúrate de estar en la sección "Production" al agregar variables
- Los nombres deben ser exactos: `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
- Después de agregar variables, Cloudflare debe hacer un redeploy automático
- Espera 2-5 minutos

### Página en blanco
- Abre DevTools (F12) y ve la consola para errores
- Verifica que Supabase está respondiendo (check Status Page)
- Verifica que las variables de entorno están configuradas correctamente

### Auth no funciona
- Verifica que las variables de Supabase están correctas en Cloudflare
- Comprueba que tu proyecto Supabase está activo
- En Supabase, verifica que tienes configurada la URL de tu app en "Authentication Settings"

---

## Información Importante

- **Build output**: `dist/` (creado automáticamente con `npm run build`)
- **Entorno**: Las variables VITE_ se injectan en build time (no en runtime)
- **Cold starts**: Cloudflare Pages es muy rápido, sin cold starts
- **Gratuito**: El tier gratuito de Cloudflare Pages es suficiente

---

## Contacto/Support

- Docs Cloudflare Pages: https://developers.cloudflare.com/pages/
- Status Supabase: https://status.supabase.com
- GitHub Help: https://docs.github.com

---

**Última actualización**: 2025-12-02
