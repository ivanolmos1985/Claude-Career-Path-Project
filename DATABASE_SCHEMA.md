# Esquema de Base de Datos - Career Path System

## 📊 Diagrama Visual

```
┌─────────────────────────────────────────────────────────────────┐
│                      Supabase PostgreSQL                        │
└─────────────────────────────────────────────────────────────────┘

    ┌──────────────────────────┐
    │    auth.users (Supabase) │
    │   (Gestión automática)   │
    │   ─ id (UUID)            │
    │   ─ email                │
    │   ─ password             │
    └────────────┬─────────────┘
                 │ (1-N)
                 ▼
    ┌──────────────────────────┐
    │        teams             │ ← Usuario ve solo SUS equipos
    │   ─ id (BIGINT)          │
    │   ─ client (VARCHAR)     │
    │   ─ description (TEXT)   │
    │   ─ user_id (UUID) FK    │
    │   ─ created_at           │
    │   ─ updated_at           │
    └────────────┬─────────────┘
                 │ (1-N)
                 ▼
    ┌──────────────────────────┐     ┌──────────────────────┐
    │      members             │────→│  competencies        │
    │   ─ id (BIGINT)          │     │  (Datos estáticos)   │
    │   ─ team_id (BIGINT) FK  │     │  ─ id (VARCHAR)      │
    │   ─ name (VARCHAR)       │     │  ─ role (VARCHAR)    │
    │   ─ email (VARCHAR)      │     │  ─ name (VARCHAR)    │
    │   ─ role (VARCHAR)       │     │  ─ weight (INT)      │
    │   ─ level (VARCHAR)      │     └──────────────────────┘
    │   ─ level_target         │
    │   ─ created_at           │
    │   ─ updated_at           │
    └────────────┬─────────────┘
                 │ (1-N)
                 ├──────────────────────────┐
                 │                          │
                 ▼                          ▼
    ┌─────────────────────────┐  ┌──────────────────────────┐
    │    evaluations          │  │      evidence            │
    │ ─ id (BIGINT)           │  │ ─ id (BIGINT)            │
    │ ─ member_id (BIGINT) FK │  │ ─ member_id (BIGINT) FK  │
    │ ─ quarter (VARCHAR)     │  │ ─ quarter (VARCHAR)      │
    │ ─ competency_id (FK)    │  │ ─ competency_id (FK)     │
    │ ─ rating (INT 1-5)      │  │ ─ description (TEXT)     │
    │ ─ created_at            │  │ ─ created_at             │
    │ ─ updated_at            │  │ ─ updated_at             │
    └─────────────────────────┘  └──────────────────────────┘
```

---

## 📋 Estructura Detallada de Tablas

### 1. TABLE: `teams`

**Propósito:** Almacena equipos/proyectos

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO | ID único del equipo |
| client | VARCHAR(255) | NOT NULL | Nombre del cliente |
| description | TEXT | NULL | Descripción del equipo |
| user_id | UUID | FK users, NOT NULL | Usuario propietario |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| updated_at | TIMESTAMP | DEFAULT NOW() | Fecha de actualización |

**Índices:**
- `idx_teams_user_id` en user_id (búsquedas rápidas)

**Row Level Security (RLS):**
- ✅ Habilitado
- Solo usuarios ven/editan/eliminan SUS propios equipos

**Ejemplo de datos:**
```
id  | client           | description        | user_id | created_at
----|------------------|--------------------|---------|----------
1   | Proyecto XYZ     | App web empresa    | uuid1   | 2025-01-15
2   | FIGO Mobile      | App móvil FIGO     | uuid1   | 2025-01-16
```

---

### 2. TABLE: `members`

**Propósito:** Almacena miembros de equipos

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO | ID único del miembro |
| team_id | BIGINT | FK teams, NOT NULL | ID del equipo |
| name | VARCHAR(255) | NOT NULL | Nombre completo |
| email | VARCHAR(255) | NOT NULL | Email del miembro |
| role | VARCHAR(50) | NOT NULL | Rol (developer, qa, etc) |
| level | VARCHAR(20) | NOT NULL | Nivel: jr, mid, sr |
| level_target | VARCHAR(20) | NOT NULL | Nivel objetivo: mid, sr |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| updated_at | TIMESTAMP | DEFAULT NOW() | Fecha de actualización |

**Índices:**
- `idx_members_team_id` en team_id

**Row Level Security (RLS):**
- ✅ Habilitado
- Solo usuarios ven/editan miembros de SUS equipos

**Valores permitidos para role:**
```
- developer
- qa
- productowner
- scrummaster
- uxui
- deliverymanager
```

**Valores permitidos para level/level_target:**
```
- jr (Junior)
- mid (Mid-level)
- sr (Senior)
```

**Ejemplo de datos:**
```
id | team_id | name          | email           | role       | level | level_target
---|---------|---------------|-----------------|------------|-------|-------------
1  | 1       | Juan Pérez    | juan@email.com  | developer  | jr    | mid
2  | 1       | María García  | maria@email.com | qa         | mid   | sr
3  | 2       | Carlos López  | carlos@email.com| productowner| sr   | sr
```

---

### 3. TABLE: `evaluations`

**Propósito:** Calificaciones de competencias por trimestre

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO | ID única evaluación |
| member_id | BIGINT | FK members, NOT NULL | Miembro evaluado |
| quarter | VARCHAR(2) | CHECK (Q1-Q4), NOT NULL | Trimestre |
| competency_id | VARCHAR(50) | NOT NULL | ID competencia |
| rating | INT | CHECK (1-5), NOT NULL | Calificación 1-5 |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| updated_at | TIMESTAMP | DEFAULT NOW() | Fecha de actualización |

**Restricciones únicas:**
- UNIQUE(member_id, quarter, competency_id) = Una sola evaluación por miembro/trimestre/competencia

**Índices:**
- `idx_evaluations_member_id` en member_id
- `idx_evaluations_quarter` en quarter

**Row Level Security (RLS):**
- ✅ Habilitado
- Solo usuarios ven/editan evaluaciones de SUS miembros

**Valores permitidos para quarter:**
```
Q1, Q2, Q3, Q4
```

**Valores permitidos para rating:**
```
1 = No cumple
2 = Cumple parcialmente
3 = Cumple
4 = Cumple ampliamente
5 = Supera
```

**Ejemplo de datos:**
```
id | member_id | quarter | competency_id | rating | created_at
---|-----------|---------|---------------|--------|----------
1  | 1         | Q1      | tech          | 4      | 2025-01-15
2  | 1         | Q1      | quality       | 3      | 2025-01-15
3  | 1         | Q2      | tech          | 5      | 2025-04-15
```

---

### 4. TABLE: `evidence`

**Propósito:** Justificaciones/evidencias de evaluaciones

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO | ID único |
| member_id | BIGINT | FK members, NOT NULL | Miembro |
| quarter | VARCHAR(2) | CHECK (Q1-Q4), NOT NULL | Trimestre |
| competency_id | VARCHAR(50) | NOT NULL | ID competencia |
| description | TEXT | NULL | Evidencia/descripción |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha creación |
| updated_at | TIMESTAMP | DEFAULT NOW() | Fecha actualización |

**Restricciones únicas:**
- UNIQUE(member_id, quarter, competency_id) = Una sola evidencia por miembro/trimestre/competencia

**Índices:**
- `idx_evidence_member_id` en member_id

**Row Level Security (RLS):**
- ✅ Habilitado
- Solo usuarios ven/editan evidencias de SUS miembros

**Ejemplo de datos:**
```
id | member_id | quarter | competency_id | description
---|-----------|---------|---------------|----------------------------------
1  | 1         | Q1      | tech          | Completó curso .NET avanzado
2  | 1         | Q1      | quality       | Mejoró cobertura de tests
3  | 1         | Q2      | tech          | Lideró refactorización del sistema
```

---

### 5. TABLE: `competencies`

**Propósito:** Competencias disponibles por rol (DATOS ESTÁTICOS)

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id | VARCHAR(50) | PRIMARY KEY | ID único competencia |
| role | VARCHAR(50) | NOT NULL | Rol asociado |
| name | VARCHAR(255) | NOT NULL | Nombre legible |
| weight | INT | NOT NULL | Peso en evaluación (%) |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha creación |

**Índices:**
- `idx_competencies_role` en role

**Nota:** Esta tabla NO tiene RLS. Es pública (lectura) para todos los usuarios.

**Ejemplo de datos:**
```
id            | role       | name                        | weight
--------------|------------|-----------------------------|-----------
tech          | developer  | Conocimientos Técnicos .NET | 20
quality       | developer  | Calidad de Código           | 15
collaboration | developer  | Colaboración & Comunicación | 15
```

---

## 🔄 Flujo de Datos

### Creación de Equipo:
```
Usuario hace login
→ App obtiene user_id de Supabase Auth
→ Usuario crea equipo (botón "Nuevo Equipo")
→ App guarda: INSERT into teams (user_id=auth.uid())
→ Base de datos: RLS solo permite si user_id = auth.uid()
→ ✅ Equipo creado
```

### Creación de Miembro:
```
Usuario selecciona equipo
→ Usuario crea miembro (botón "Agregar Miembro")
→ App guarda: INSERT into members (team_id=equipo_id)
→ Base de datos: RLS valida que el equipo pertenece al usuario
→ ✅ Miembro creado
```

### Creación de Evaluación:
```
Usuario evalúa competencia de miembro
→ Usuario ingresa rating 1-5 y elige trimestre
→ App guarda: INSERT into evaluations (member_id, quarter, rating)
→ Base de datos: RLS valida que el miembro es del usuario
→ ✅ Evaluación guardada
```

### Cálculo de Decisión de Promoción:
```
Usuario ve página Decision
→ App obtiene evaluaciones de Q4
→ Suma ratings de todas las competencias
→ Calcula threshold (70% para jr, 80% para mid)
→ Compara Q4 score vs threshold
→ Muestra: PROMOCIÓN APROBADA / PENDIENTE / NO APROBADA
```

---

## 🔒 Seguridad - Row Level Security (RLS)

**¿Qué es RLS?**
Garantiza que cada usuario SOLO vea y edite SUS propios datos en la base de datos.

**Políticas implementadas:**

### Para tabla `teams`:
```
SELECT:  auth.uid() = user_id (solo ven sus equipos)
INSERT:  auth.uid() = user_id (solo crean sus equipos)
UPDATE:  auth.uid() = user_id (solo actualizan sus equipos)
DELETE:  auth.uid() = user_id (solo eliminan sus equipos)
```

### Para tabla `members`:
```
SELECT:  team_id IN (SELECT id FROM teams WHERE user_id = auth.uid())
INSERT:  team_id IN (SELECT id FROM teams WHERE user_id = auth.uid())
UPDATE:  team_id IN (SELECT id FROM teams WHERE user_id = auth.uid())
DELETE:  team_id IN (SELECT id FROM teams WHERE user_id = auth.uid())
```

### Para tabla `evaluations`:
```
Similar a members (a través de member_id → team_id → user_id)
```

### Para tabla `evidence`:
```
Similar a members (a través de member_id → team_id → user_id)
```

### Para tabla `competencies`:
```
NO tiene RLS (es pública, solo lectura)
Todos pueden ver todas las competencias
```

---

## 📊 Estadísticas de Base de Datos

### Espacio estimado:
- **Por equipo:** ~1-5 MB
- **Por 100 miembros:** ~10-50 MB
- **Con 4 años de evaluaciones:** ~200-500 MB

### Capacidad:
- **Usuarios:** Ilimitado (con RLS)
- **Equipos por usuario:** Ilimitado
- **Miembros por equipo:** Ilimitado
- **Evaluaciones por miembro:** 4 trimestres x N competencias

---

## 🔗 Relaciones Entre Tablas

```
auth.users (Supabase Auth - Externo)
    ↓
    └─→ teams (1-N relación)
            ↓
            └─→ members (1-N relación)
                    ↓
                    ├─→ evaluations (1-N relación)
                    │       └─→ competencies (referencia)
                    │
                    └─→ evidence (1-N relación)
                            └─→ competencies (referencia)
```

---

## 📝 Consultas Útiles

### Ver datos de un usuario:

```sql
-- Todos los equipos de un usuario
SELECT * FROM teams WHERE user_id = 'uuid-del-usuario';

-- Todos los miembros de un equipo
SELECT * FROM members WHERE team_id = 1;

-- Evaluaciones de un miembro en Q4
SELECT * FROM evaluations
WHERE member_id = 1 AND quarter = 'Q4';

-- Score total de un miembro en Q4
SELECT SUM(rating) FROM evaluations
WHERE member_id = 1 AND quarter = 'Q4';

-- Competencias disponibles para un rol
SELECT * FROM competencies WHERE role = 'developer';
```

---

## ✅ Checklist Después de Crear Tablas

- [ ] Todas las 5 tablas creadas
- [ ] RLS habilitado en teams, members, evaluations, evidence
- [ ] Competencies insertadas (42 competencias en total)
- [ ] Índices creados para queries rápidas
- [ ] Realtime habilitado (opcional)
- [ ] Variables de entorno actualizadas
- [ ] Conectado desde la app

---

**Última actualización:** 2025-12-02
**Base de datos:** Supabase PostgreSQL
**Estado:** Listo para usar
