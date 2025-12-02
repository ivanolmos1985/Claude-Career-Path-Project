# 📚 Documentación de Base de Datos - Career Path System

## 📖 Índice de Documentos

Este proyecto tiene **3 guías de base de datos** para diferentes necesidades:

### 1. **QUICK_START_DATABASE.md** ⚡ (COMIENZA AQUÍ)
**Para:** Los que quieren implementar RÁPIDO (5 minutos)

📄 Guía ultra-rápida con:
- 5 pasos simples
- Checklist visual
- Instrucciones directas sin explicaciones largas
- Perfecto si tienes prisa

**Tiempo:** ~5 minutos
**Nivel:** Para no-programadores

---

### 2. **SUPABASE_DATABASE_SETUP.md** 📋 (IMPLEMENTACIÓN)
**Para:** Seguir paso a paso la implementación

📄 Guía detallada con:
- Scripts SQL completos listos para copiar-pegar
- Explicaciones de cada tabla
- Políticas de Row Level Security
- Instrucciones para verificar
- Datos de prueba

**Tiempo:** ~15-20 minutos
**Nivel:** Para todos (simple de seguir)

---

### 3. **DATABASE_SCHEMA.md** 📊 (REFERENCIA TÉCNICA)
**Para:** Entender la estructura completa

📄 Documentación técnica con:
- Diagramas visuales
- Definición de cada tabla
- Campos, tipos de datos, restricciones
- Relaciones entre tablas
- Consultas útiles
- Explicación de seguridad (RLS)

**Tiempo:** Referencia (leer cuando necesites)
**Nivel:** Técnico pero claramente explicado

---

## 🎯 ¿Por Dónde Empiezo?

### Opción A: Quiero hacerlo YA (Recomendado)
```
1. Abre: QUICK_START_DATABASE.md
2. Sigue los 5 pasos
3. Listo en 5 minutos
```

### Opción B: Quiero entender bien
```
1. Abre: SUPABASE_DATABASE_SETUP.md (PARTE 1: Preparación)
2. Lee qué necesitas
3. Luego sigue PARTE 2: Crear las Tablas paso a paso
4. Verifica PARTE 3
5. Listo en 15-20 minutos
```

### Opción C: Quiero entender TODO
```
1. Abre: DATABASE_SCHEMA.md (entiende la estructura)
2. Abre: SUPABASE_DATABASE_SETUP.md (implementa)
3. Abre: QUICK_START_DATABASE.md (checklist final)
```

---

## 📊 Resumen Rápido: ¿Qué se crea?

| Tabla | Propósito | Filas esperadas |
|-------|----------|-----------------|
| **teams** | Tus equipos/proyectos | 1-10 por usuario |
| **members** | Personas en equipos | 5-100 por equipo |
| **evaluations** | Calificaciones 1-5 | 4 trimestres × competencias |
| **evidence** | Justificaciones | 1 por evaluación |
| **competencies** | Competencias por rol | 42 totales (estáticas) |

---

## 🔒 Seguridad (¿Quién ve qué?)

```
Usuario A ve:        Usuario B ve:
├─ Sus equipos       ├─ Sus equipos
│  ├─ Sus miembros   │  ├─ Sus miembros
│  └─ Sus datos      │  └─ Sus datos
│
NO ve datos de Usuario B
```

**Protección:** Row Level Security (RLS) en Supabase

---

## 📝 Pasos Principales

### Nivel 1: Crear estructura
```
1. Abrir Supabase SQL Editor
2. Copiar-pegar 5 scripts SQL
3. Ejecutar (Ctrl+Enter)
4. ✅ Tablas creadas
```

### Nivel 2: Verificar
```
1. Ir a Table Editor
2. Ver todas las tablas
3. Verificar competencies (~42 filas)
4. ✅ Datos insertados
```

### Nivel 3: Conectar a la app
```
1. Actualizar .env.local
2. Push a GitHub
3. Cloudflare deploy automático
4. ✅ App funcionando con BD
```

---

## 💡 Consejos Importantes

### ✅ HACER:
- Copiar scripts completos (no a mitades)
- Ejecutar uno a uno (Ctrl+Enter)
- Verificar que cada uno tenga ✅ verde
- Habilitar Realtime (recomendado)
- Usar Supabase SQL Editor (no otras herramientas)

### ❌ NO HACER:
- No modificar scripts SQL
- No saltarse pasos
- No ejecutar todo junto
- No cambiar nombres de tablas
- No editar manualmente sin saber qué haces

---

## 🆘 Si Algo Falla

### Error: "relation already exists"
```
Significa: Ya existe una tabla con ese nombre
Solución: En Supabase Table Editor, elimina la tabla
         Luego ejecuta el script de nuevo
```

### Error: "User does not have CONNECT privilege"
```
Significa: Problema de permisos
Solución: Contacta a soporte Supabase
         O crea nuevo proyecto
```

### Error: "Violates foreign key constraint"
```
Significa: Intentaste insertar sin las relaciones correctas
Solución: Verifica que el team_id/member_id existan
         Antes de insertar
```

---

## 📋 Checklist Completo

Cuando hayas terminado, verifica:

- [ ] ✅ Tabla `teams` creada
- [ ] ✅ Tabla `members` creada
- [ ] ✅ Tabla `evaluations` creada
- [ ] ✅ Tabla `evidence` creada
- [ ] ✅ Tabla `competencies` creada (42 filas)
- [ ] ✅ RLS habilitado en 4 tablas
- [ ] ✅ Índices creados
- [ ] ✅ Realtime habilitado (opcional)
- [ ] ✅ Variables de entorno actualizadas
- [ ] ✅ App conectada a Supabase

---

## 🔗 Archivos del Proyecto

En tu carpeta del proyecto encontrarás:

```
├── QUICK_START_DATABASE.md          ← COMIENZA AQUÍ (5 min)
├── SUPABASE_DATABASE_SETUP.md       ← Implementación paso a paso
├── DATABASE_SCHEMA.md               ← Referencia técnica
├── README_DATABASE.md               ← Este archivo
│
├── GIT_DEPLOY_GUIDE.md              ← Guía de Git/Deploy
├── DEPLOYMENT.md                    ← Deployment info
├── TESTING.md                       ← Testing checklist
├── TROUBLESHOOTING_DEPLOY.md        ← Solución de problemas
│
└── src/
    ├── context/AppContext.jsx       ← Donde iría BD
    ├── context/AuthContext.jsx      ← Autenticación Supabase
    ├── pages/                       ← Páginas de la app
    └── ...
```

---

## 🚀 Próximos Pasos Después de BD

1. **Conectar app a BD**
   - Actualizar variables de entorno
   - Modificar AppContext para leer de Supabase

2. **Testing**
   - Crear equipo de prueba
   - Crear miembros
   - Hacer evaluaciones
   - Verificar cálculos

3. **Deploy**
   ```bash
   git add .
   git commit -m "Conectar BD Supabase"
   git push
   ```
   Cloudflare hace deploy automático

4. **Monitoreo**
   - Ver datos en Supabase
   - Verificar que la app funciona
   - Hacer ajustes si necesita

---

## 📞 Preguntas Frecuentes

**P: ¿Puedo eliminar una tabla?**
A: Sí, pero perderás los datos. En Supabase Table Editor, haz clic en tabla → Delete. Luego ejecuta el script de nuevo.

**P: ¿Cuántos equipos puedo crear?**
A: Ilimitados. Supabase escala automáticamente.

**P: ¿Qué pasa si ejecuto el script dos veces?**
A: Fallará (tabla ya existe). No es problema, solo no guarda datos duplicados.

**P: ¿Los datos se sincronizan en tiempo real?**
A: Sí, si activas Realtime. Sin Realtime, tienes que refrescar la página.

**P: ¿Es seguro dejar las claves públicas en .env?**
A: Sí. La clave "anon" es pública. RLS protege los datos.

---

## 🎓 Conceptos Clave

**Base de datos:** Almacena datos (teams, members, evaluaciones)
**Tablas:** Estructuras con filas y columnas
**Foreign Key:** Conexión entre tablas
**RLS:** Seguridad - cada usuario ve solo sus datos
**Índices:** Búsquedas más rápidas
**Realtime:** Cambios se ven al instante

---

## 📞 Soporte

Si tienes problemas:

1. Lee la sección **Si Algo Falla** arriba
2. Copia el error completo
3. Comparte conmigo

Errores comunes casi siempre se resuelven fácilmente.

---

## ✨ ¡Listo!

**Próximo paso:** Abre `QUICK_START_DATABASE.md` y comienza! 🚀

Tiempo estimado: **5 minutos**
Dificultad: **Muy fácil** (solo copiar-pegar)
Resultado: **Base de datos completamente funcional**

---

**Última actualización:** 2025-12-02
**Versión:** 1.0
**Estado:** Listo para usar
