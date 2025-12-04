# PLAN: Mejoras del Sistema de Evaluación

## Objetivo General
Transformar la pantalla de Evaluación de un sistema simple de calificación 1-5 a un sistema robusto de evaluación con:
- Competencias editables con gestión CRUD
- Jerarquía de tareas dentro de cada competencia (múltiples tareas por competencia)
- Escala de calificación 1-10 con umbral de aprobación (7-10 aprobado, 1-6 no aprobado)
- Carga de archivos/imágenes como evidencia (opcional, texto sigue siendo válido)
- Pesos editables por competencia (manteniendo el sistema de 20%)

---

## DECISIONES DE NEGOCIO ASUMIDAS

Basándome en tu solicitud específica, asumiré lo siguiente:

### 1. **Competencias**
- ✅ Migramos a sistema **database-driven** (gestión en Supabase, no en archivo estático)
- ✅ Competencias serán **editables** por el propietario del equipo (team owner)
- ✅ Se pueden **crear nuevas competencias** personalizadas por equipo
- ✅ **Soft delete** con archive para mantener integridad histórica de evaluaciones
- ✅ Pesos editables por competencia (1-100%)

### 2. **Tareas**
- ✅ Cada competencia contendrá **2-5 tareas variables**
- ✅ Las tareas son **sub-componentes específicos** de la competencia
- ✅ Cada tarea se califica **1-10** de forma independiente
- ✅ La **calificación de competencia = promedio de calificaciones de tareas**
- ✅ Las tareas son **editables y eliminables** por el team owner

### 3. **Escala de Calificación (1-10)**
- ✅ Cambio de **1-5 → 1-10** para todas las nuevas evaluaciones
- ✅ **Umbral de aprobación por tarea: 7-10 = APROBADO, 1-6 = NO APROBADO**
- ✅ Umbral de competencia: promedio >= 7 = APROBADA
- ✅ **Migración de datos**: Convertir 1-5 a 1-10 automáticamente (rating * 2)
- ✅ Mantener campo `rating_scale` para auditoría

### 4. **Archivos/Evidencia**
- ✅ Archivo input mantenido pero ahora **permite uploads**
- ✅ Soportar: **PDF, DOCX, XLSX, JPG, PNG, GIF** (max 10MB)
- ✅ **Opcional** (no requiere archivo, texto sigue siendo válido)
- ✅ Asociación a **nivel de tarea** (no solo competencia)
- ✅ Usar **Supabase Storage** para archivos
- ✅ Máximo **5 archivos por tarea**

### 5. **Pesos**
- ✅ Mantener **estructura de 20%** por competencia principal
- ✅ Pesos **editables** cuando se crean/editan competencias
- ✅ Validación: pesos deben sumar **≈100% por rol**
- ✅ **Por-equipo customizable** (diferentes equipos pueden tener pesos diferentes)

---

## CAMBIOS DE BASE DE DATOS REQUERIDOS

### Tablas Nuevas

#### 1. **tasks** - Tareas dentro de competencias
```sql
CREATE TABLE tasks (
  id BIGSERIAL PRIMARY KEY,
  competency_id VARCHAR(50) NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
  team_id BIGINT REFERENCES teams(id) ON DELETE CASCADE,  -- NULL = global
  name VARCHAR(255) NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. **task_evaluations** - Calificaciones de tareas (reemplaza/extiende evaluations)
```sql
CREATE TABLE task_evaluations (
  id BIGSERIAL PRIMARY KEY,
  member_id BIGINT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  task_id BIGINT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  quarter VARCHAR(2) NOT NULL CHECK (quarter IN ('Q1','Q2','Q3','Q4')),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 10),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(member_id, task_id, quarter)
);
```

#### 3. **evidence_files** - Archivos de evidencia
```sql
CREATE TABLE evidence_files (
  id BIGSERIAL PRIMARY KEY,
  evidence_id BIGINT REFERENCES evidence(id) ON DELETE CASCADE,
  task_id BIGINT REFERENCES tasks(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50),
  file_size BIGINT,
  uploaded_by UUID REFERENCES auth.users(id),
  uploaded_at TIMESTAMP DEFAULT NOW()
);
```

#### 4. **team_competency_weights** - Pesos personalizados por equipo
```sql
CREATE TABLE team_competency_weights (
  id BIGSERIAL PRIMARY KEY,
  team_id BIGINT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  competency_id VARCHAR(50) NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
  weight INT NOT NULL CHECK (weight >= 1 AND weight <= 100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(team_id, competency_id)
);
```

### Alteraciones a Tablas Existentes

```sql
-- 1. Competencies table: agregar soporte para soft delete y customización
ALTER TABLE competencies ADD COLUMN team_id BIGINT REFERENCES teams(id) ON DELETE CASCADE;
ALTER TABLE competencies ADD COLUMN is_deleted BOOLEAN DEFAULT false;
ALTER TABLE competencies ADD COLUMN deleted_at TIMESTAMP;
ALTER TABLE competencies ADD COLUMN deleted_by UUID REFERENCES auth.users(id);

-- 2. Evaluations table: agregar rating_scale para compatibilidad
ALTER TABLE evaluations ADD COLUMN rating_scale VARCHAR(10) DEFAULT 'v1';

-- 3. Evidence table: hacer description más flexible
-- Sin cambios necesarios (TEXT ya es suficiente)

-- 4. Crear índices para performance
CREATE INDEX idx_tasks_competency ON tasks(competency_id);
CREATE INDEX idx_tasks_team ON tasks(team_id);
CREATE INDEX idx_task_evaluations_member ON task_evaluations(member_id);
CREATE INDEX idx_task_evaluations_task ON task_evaluations(task_id);
CREATE INDEX idx_team_weights_team ON team_competency_weights(team_id);
```

---

## CAMBIOS DE APLICACIÓN (Frontend)

### Archivos Afectados

#### 1. **src/context/AppContext.jsx** - Funciones CRUD
Agregar funciones para:
- `addCompetency(teamId, competencyData)` - Crear competencia
- `updateCompetency(competencyId, patch)` - Editar competencia
- `deleteCompetency(competencyId)` - Eliminar (soft delete)
- `addTask(competencyId, taskData)` - Crear tarea
- `updateTask(taskId, patch)` - Editar tarea
- `deleteTask(taskId)` - Eliminar tarea
- `uploadEvidenceFile(file, metadata)` - Upload a Supabase Storage
- `getTeamWeights(teamId, role)` - Obtener pesos del equipo
- `updateTeamWeights(teamId, role, weights)` - Actualizar pesos

#### 2. **src/pages/EvaluationPage.jsx** - Pantalla de Evaluación
Cambios principales:
- Cambiar escala de rating de **[1,2,3,4,5] → [1,2,3,4,5,6,7,8,9,10]**
- Mostrar **tareas dentro de cada competencia** (jerarquía)
- Permitir calificar cada **tarea independientemente**
- Calcular automáticamente **calificación de competencia = promedio de tareas**
- Input de evidencia ahora incluye:
  - **Textarea para texto** (como antes)
  - **Input file para documentos/imágenes**
  - **Preview de archivos cargados**
  - **Botón para eliminar archivos**
- Mostrar indicador visual: **Aprobado (7-10) / No Aprobado (1-6)** por tarea
- Mantener "Guardar y Continuar" al final

#### 3. **src/pages/DecisionPage.jsx** - Pantalla de Decisión
Cambios:
- Actualizar cálculos para usar **task_evaluations** en lugar de evaluations
- Nueva fórmula: `taskRating → competencyRating (promedio) → competencyWeightedScore → totalScore`
- Umbrales actualizados: **70 puntos (pendiente), 80 puntos (aprobada)**
- Mostrar desglose detallado: tareas → competencias → score final
- Mantener visual de PDF export

#### 4. **src/components/CompetencyManager.jsx** (Nuevo)
Modal/Panel para gestionar competencias:
- Listar competencias del equipo
- Botón "Crear Competencia" → Modal
- Para cada competencia:
  - Botón Editar → Modal con nombre, descripción, peso
  - Botón "Gestionar Tareas" → Abre gestor de tareas
  - Botón Eliminar → Soft delete con confirmación
- Validación: pesos suman ≈100%

#### 5. **src/components/TaskManager.jsx** (Nuevo)
Modal/Panel para gestionar tareas:
- Lista de tareas de la competencia
- Botón "Agregar Tarea" → Modal
- Para cada tarea:
  - Botón Editar → Modal con nombre, descripción
  - Botón Eliminar → Con confirmación
  - Drag-to-reorder display_order (opcional)

#### 6. **src/hooks/useFileUpload.js** (Nuevo)
Hook personalizado para gestionar uploads a Supabase Storage:
- `uploadFile(file, metadata)` → Promise con URL
- `deleteFile(fileUrl)` → Elimina de Storage
- `getProgress()` → Porcentaje de upload
- Validación de tipos y tamaños

#### 7. **src/utils/supabaseStorage.js** (Nuevo)
Utilitarios para Supabase Storage:
- Crear/verificar bucket 'evaluation-evidence'
- Generar paths seguros: `/{user_id}/{member_id}/{quarter}/{task_id}/{filename}`
- Validar tipos: `['pdf','docx','xlsx','jpg','png','gif']`
- Validar tamaño: max 10MB

---

## FLUJO DE TRABAJO (User Journey)

### 1. **Crear/Editar Competencias** (Team Owner)
```
TeamsPage → Equipo → Click "Gestionar"
→ Modal aparece: "Competencias del Equipo"
→ Lista de competencias con peso
→ Botón "➕ Nueva Competencia"
  ├─ Modal: Nombre, Descripción, Peso
  └─ Save → Se crea competencia en DB
→ Para cada competencia: Botón "✏️ Editar"
  ├─ Modal: Editar nombre, descripción, peso
  └─ Save → Update competencia
→ Para cada competencia: Botón "Gestionar Tareas"
  └─ Abre TaskManager (ver paso 2)
```

### 2. **Crear/Editar Tareas** (Team Owner)
```
CompetencyManager → Click "Gestionar Tareas" para competencia
→ Modal: "Tareas - Conocimientos Técnicos .NET"
→ Lista de tareas existentes
→ Botón "➕ Nueva Tarea"
  ├─ Modal: Nombre, Descripción (opcional)
  └─ Save → Se crea tarea en DB
→ Para cada tarea: Botón "✏️ Editar"
  ├─ Modal: Editar nombre, descripción
  └─ Save → Update tarea
→ Para cada tarea: Botón "🗑️ Eliminar"
  └─ Confirmación → Delete tarea (soft o hard)
```

### 3. **Evaluar Miembro** (Evaluator)
```
EvaluationPage → Seleccionar trimestre (Q1-Q4)
→ Para cada competencia:
  ├─ Nombre competencia + Peso (ej: "20%")
  ├─ Para cada tarea dentro:
  │  ├─ Nombre de tarea
  │  ├─ Rating buttons: [1][2][3][4][5][6][7][8][9][10]
  │  ├─ Indicador: "✅ APROBADO (7+)" o "❌ NO APROBADO (1-6)"
  │  ├─ Textarea: Evidencia de texto
  │  ├─ File input: Cargar PDF/Imagen
  │  └─ Preview: Archivos cargados con botón 🗑️
  │
  └─ Competency Score: (suma tareas) / cantidad = X.X/10
     └─ Indicador: "✅ COMPETENCIA APROBADA" o "❌ COMPETENCIA NO APROBADA"

→ Botón "💾 Guardar y Continuar"
  ├─ Valida: todas las tareas calificadas
  ├─ Upload archivos a Supabase Storage
  ├─ Save task_evaluations a DB
  ├─ Save evidence_files a DB
  └─ Navega a DecisionPage
```

### 4. **Ver Decisión** (Viewer)
```
DecisionPage → Muestra:
├─ Desglose por competencia:
│  ├─ Competencia: "Conocimientos Técnicos .NET" (Peso: 20%)
│  ├─ Tareas:
│  │  ├─ Tarea 1: 8/10 ✅
│  │  ├─ Tarea 2: 7/10 ✅
│  │  ├─ Tarea 3: 6/10 ❌ (pero promedio ≥ 7)
│  │  └─ Tarea 4: 8/10 ✅
│  └─ Competency Score: 7.25/10 ✅ APROBADA
│
├─ Total Puntaje: 78.5/100
├─ Decisión: "PROMOCIÓN APROBADA" (color verde)
└─ Exportar PDF (mantiene formato actual)
```

---

## FASES DE IMPLEMENTACIÓN

### FASE 1: Base de Datos (Step 0)
**Duración estimada: 30 min**

Tareas:
- [ ] Crear 4 tablas nuevas en Supabase
- [ ] Alternar 2 tablas existentes
- [ ] Crear índices
- [ ] Crear RLS policies para nuevas tablas
- [ ] Script de migración: convertir 1-5 → 1-10

### FASE 2: Funciones Backend (AppContext)
**Duración estimada: 1.5 horas**

Tareas:
- [ ] Crear 8 funciones CRUD en AppContext
- [ ] Integrar Supabase Storage
- [ ] Crear hooks para Realtime subscriptions
- [ ] Validaciones de negocio

### FASE 3: UI de Gestión (Competencias y Tareas)
**Duración estimada: 2 horas**

Tareas:
- [ ] Crear CompetencyManager component
- [ ] Crear TaskManager component
- [ ] Integrar en TeamsPage (acceso vía "Gestionar")
- [ ] Styling y UX

### FASE 4: UI de Evaluación (Nueva escala)
**Duración estimada: 2 horas**

Tareas:
- [ ] Actualizar EvaluationPage para mostrar tareas
- [ ] Cambiar botones de [1-5] a [1-10]
- [ ] Agregar indicators (APROBADO/NO APROBADO)
- [ ] Integrar file upload
- [ ] Calcular competency score en tiempo real

### FASE 5: UI de Decisión (Recálculos)
**Duración estimada: 1 hora**

Tareas:
- [ ] Actualizar cálculos en DecisionPage
- [ ] Mostrar desglose detallado
- [ ] Mantener PDF export funcional

### FASE 6: Testing y Refinamiento
**Duración estimada: 1 hora**

Tareas:
- [ ] Test flujo completo end-to-end
- [ ] Test file uploads
- [ ] Test Realtime sync
- [ ] Test RLS policies
- [ ] Bug fixes

---

## RESUMEN DE CAMBIOS POR ARCHIVO

| Archivo | Tipo | Cambio | Prioridad |
|---------|------|--------|-----------|
| **Supabase DB** | Create | 4 tablas nuevas + 2 alteraciones | CRÍTICA |
| **AppContext.jsx** | Modify | +8 funciones CRUD | CRÍTICA |
| **EvaluationPage.jsx** | Modify | Rating 1-5→1-10, estructura de tareas, file uploads | CRÍTICA |
| **DecisionPage.jsx** | Modify | Recálculos con nuevas tareas, formula ponderada | CRÍTICA |
| **CompetencyManager.jsx** | Create | Nuevo componente para CRUD competencias | ALTA |
| **TaskManager.jsx** | Create | Nuevo componente para CRUD tareas | ALTA |
| **useFileUpload.js** | Create | Hook personalizado para uploads | ALTA |
| **supabaseStorage.js** | Create | Utilitarios para Storage | ALTA |
| **TeamsPage.jsx** | Modify | Agregar acceso a CompetencyManager | MEDIA |

---

## NOTAS IMPORTANTES

1. **Backward Compatibility**: Las evaluaciones existentes (1-5) se mantienen en `evaluations` table, pero nuevas se crean en `task_evaluations`
2. **Migration Strategy**: Script SQL convierte 1-5 → 1-10 automáticamente
3. **Realtime Sync**: Todos los cambios se sincronizan en tiempo real vía Supabase subscriptions
4. **RLS Security**: Cada usuario solo ve sus propios equipos y evaluaciones
5. **File Storage**: Bucket 'evaluation-evidence' debe crearse manualmente en Supabase
6. **Weight Validation**: Implementar validación en frontend + backend para evitar pesos inconsistentes

---

## SIGUIENTE PASO

Una vez aprobado este plan, procederemos en orden:
1. SQL scripts para BD
2. AppContext funciones
3. Componentes de gestión
4. UI de evaluación
5. Recálculos y decisión
6. Testing final

¿Estás de acuerdo con este enfoque?
