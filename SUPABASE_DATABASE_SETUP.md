# Guía Completa: Crear Base de Datos en Supabase

## Objetivo
Crear la base de datos con todas las tablas necesarias para tu sistema Career Path en Supabase.

---

## PARTE 1: Preparación

### ¿Qué necesitas?
1. Acceso a tu cuenta de Supabase (ya deberías tenerla configurada)
2. El SQL para crear las tablas (lo te proporciono aquí)
3. 10-15 minutos

### ¿Dónde irás?
```
https://app.supabase.com/
→ Selecciona tu proyecto
→ SQL Editor
→ New Query
```

---

## PARTE 2: Crear las Tablas

### Paso 1: Abrir SQL Editor

1. Ve a **https://app.supabase.com/**
2. Haz clic en tu proyecto (Claude-Career-Path-Project o similar)
3. En el menú izquierdo, ve a **SQL Editor**
4. Haz clic en **New Query** (botón azul +)

---

### Paso 2: Copiar y Ejecutar SQL para TABLA 1: Teams

**Copia este SQL completo:**

```sql
-- TABLA 1: Teams (Equipos)
CREATE TABLE teams (
  id BIGINT PRIMARY KEY DEFAULT BIGSERIAL,
  client VARCHAR(255) NOT NULL,
  description TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índice para búsquedas rápidas
CREATE INDEX idx_teams_user_id ON teams(user_id);

-- Habilitar Row Level Security para que solo vean sus propios equipos
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Política: Solo pueden ver sus propios equipos
CREATE POLICY "Users can view their own teams"
  ON teams
  FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Solo pueden crear sus propios equipos
CREATE POLICY "Users can insert their own teams"
  ON teams
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: Solo pueden actualizar sus propios equipos
CREATE POLICY "Users can update their own teams"
  ON teams
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Política: Solo pueden eliminar sus propios equipos
CREATE POLICY "Users can delete their own teams"
  ON teams
  FOR DELETE
  USING (auth.uid() = user_id);
```

**¿Cómo ejecutar?**
1. Pega el SQL en el editor
2. Haz clic en botón **Run** (Ctrl+Enter)
3. Si ves ✅ verde, funcionó correctamente

---

### Paso 3: Copiar y Ejecutar SQL para TABLA 2: Members

**Copia este SQL:**

```sql
-- TABLA 2: Members (Miembros del equipo)
CREATE TABLE members (
  id BIGINT PRIMARY KEY DEFAULT BIGSERIAL,
  team_id BIGINT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  level VARCHAR(20) NOT NULL,
  level_target VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_members_team_id ON members(team_id);

-- Row Level Security
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Política: Solo pueden ver miembros de sus propios equipos
CREATE POLICY "Users can view members of their teams"
  ON members
  FOR SELECT
  USING (
    team_id IN (
      SELECT id FROM teams WHERE user_id = auth.uid()
    )
  );

-- Política: Solo pueden crear miembros en sus propios equipos
CREATE POLICY "Users can insert members in their teams"
  ON members
  FOR INSERT
  WITH CHECK (
    team_id IN (
      SELECT id FROM teams WHERE user_id = auth.uid()
    )
  );

-- Política: Solo pueden actualizar miembros de sus equipos
CREATE POLICY "Users can update members in their teams"
  ON members
  FOR UPDATE
  USING (
    team_id IN (
      SELECT id FROM teams WHERE user_id = auth.uid()
    )
  );

-- Política: Solo pueden eliminar miembros de sus equipos
CREATE POLICY "Users can delete members in their teams"
  ON members
  FOR DELETE
  USING (
    team_id IN (
      SELECT id FROM teams WHERE user_id = auth.uid()
    )
  );
```

**Ejecuta con Ctrl+Enter**

---

### Paso 4: Copiar y Ejecutar SQL para TABLA 3: Evaluations

**Copia este SQL:**

```sql
-- TABLA 3: Evaluations (Calificaciones)
CREATE TABLE evaluations (
  id BIGINT PRIMARY KEY DEFAULT BIGSERIAL,
  member_id BIGINT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  quarter VARCHAR(2) NOT NULL CHECK (quarter IN ('Q1', 'Q2', 'Q3', 'Q4')),
  competency_id VARCHAR(50) NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(member_id, quarter, competency_id)
);

-- Índices
CREATE INDEX idx_evaluations_member_id ON evaluations(member_id);
CREATE INDEX idx_evaluations_quarter ON evaluations(quarter);

-- Row Level Security
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- Política: Solo pueden ver evaluaciones de miembros de sus equipos
CREATE POLICY "Users can view evaluations of their members"
  ON evaluations
  FOR SELECT
  USING (
    member_id IN (
      SELECT m.id FROM members m
      JOIN teams t ON m.team_id = t.id
      WHERE t.user_id = auth.uid()
    )
  );

-- Política: Solo pueden crear evaluaciones para sus miembros
CREATE POLICY "Users can insert evaluations for their members"
  ON evaluations
  FOR INSERT
  WITH CHECK (
    member_id IN (
      SELECT m.id FROM members m
      JOIN teams t ON m.team_id = t.id
      WHERE t.user_id = auth.uid()
    )
  );

-- Política: Solo pueden actualizar evaluaciones de sus miembros
CREATE POLICY "Users can update evaluations of their members"
  ON evaluations
  FOR UPDATE
  USING (
    member_id IN (
      SELECT m.id FROM members m
      JOIN teams t ON m.team_id = t.id
      WHERE t.user_id = auth.uid()
    )
  );

-- Política: Solo pueden eliminar evaluaciones de sus miembros
CREATE POLICY "Users can delete evaluations of their members"
  ON evaluations
  FOR DELETE
  USING (
    member_id IN (
      SELECT m.id FROM members m
      JOIN teams t ON m.team_id = t.id
      WHERE t.user_id = auth.uid()
    )
  );
```

**Ejecuta con Ctrl+Enter**

---

### Paso 5: Copiar y Ejecutar SQL para TABLA 4: Evidence

**Copia este SQL:**

```sql
-- TABLA 4: Evidence (Evidencias/Justificaciones)
CREATE TABLE evidence (
  id BIGINT PRIMARY KEY DEFAULT BIGSERIAL,
  member_id BIGINT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  quarter VARCHAR(2) NOT NULL CHECK (quarter IN ('Q1', 'Q2', 'Q3', 'Q4')),
  competency_id VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(member_id, quarter, competency_id)
);

-- Índices
CREATE INDEX idx_evidence_member_id ON evidence(member_id);

-- Row Level Security
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;

-- Política: Solo pueden ver evidencias de miembros de sus equipos
CREATE POLICY "Users can view evidence of their members"
  ON evidence
  FOR SELECT
  USING (
    member_id IN (
      SELECT m.id FROM members m
      JOIN teams t ON m.team_id = t.id
      WHERE t.user_id = auth.uid()
    )
  );

-- Política: Solo pueden crear evidencias para sus miembros
CREATE POLICY "Users can insert evidence for their members"
  ON evidence
  FOR INSERT
  WITH CHECK (
    member_id IN (
      SELECT m.id FROM members m
      JOIN teams t ON m.team_id = t.id
      WHERE t.user_id = auth.uid()
    )
  );

-- Política: Solo pueden actualizar evidencias de sus miembros
CREATE POLICY "Users can update evidence of their members"
  ON evidence
  FOR UPDATE
  USING (
    member_id IN (
      SELECT m.id FROM members m
      JOIN teams t ON m.team_id = t.id
      WHERE t.user_id = auth.uid()
    )
  );

-- Política: Solo pueden eliminar evidencias de sus miembros
CREATE POLICY "Users can delete evidence of their members"
  ON evidence
  FOR DELETE
  USING (
    member_id IN (
      SELECT m.id FROM members m
      JOIN teams t ON m.team_id = t.id
      WHERE t.user_id = auth.uid()
    )
  );
```

**Ejecuta con Ctrl+Enter**

---

### Paso 6: Copiar y Ejecutar SQL para TABLA 5: Competencies (Datos Estáticos)

**Copia este SQL:**

```sql
-- TABLA 5: Competencies (Competencias por rol - DATOS ESTÁTICOS)
CREATE TABLE competencies (
  id VARCHAR(50) PRIMARY KEY,
  role VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  weight INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice
CREATE INDEX idx_competencies_role ON competencies(role);

-- INSERTAR COMPETENCIAS PARA DEVELOPER
INSERT INTO competencies (id, role, name, weight) VALUES
  ('tech', 'developer', 'Conocimientos Técnicos .NET', 20),
  ('quality', 'developer', 'Calidad de Código', 15),
  ('problem', 'developer', 'Resolución de Problemas', 15),
  ('performance', 'developer', 'Performance & Optimization', 10),
  ('collaboration', 'developer', 'Colaboración & Comunicación', 15),
  ('autonomy', 'developer', 'Autonomía & Ownership', 10),
  ('business', 'developer', 'Conocimiento FIGO', 10),
  ('innovation', 'developer', 'Innovación & Mejora Continua', 5);

-- INSERTAR COMPETENCIAS PARA QA
INSERT INTO competencies (id, role, name, weight) VALUES
  ('testdomain', 'qa', 'Dominio de Testing', 20),
  ('testdesign', 'qa', 'Diseño de Casos de Prueba', 15),
  ('automation', 'qa', 'Automatización de Pruebas', 15),
  ('bugs', 'qa', 'Detección & Documentación de Defectos', 15),
  ('collaboration', 'qa', 'Colaboración & Comunicación', 15),
  ('autonomy', 'qa', 'Autonomía & Ownership', 10),
  ('business', 'qa', 'Conocimiento FIGO', 10);

-- INSERTAR COMPETENCIAS PARA PRODUCT OWNER
INSERT INTO competencies (id, role, name, weight) VALUES
  ('product', 'productowner', 'Gestión de Producto', 20),
  ('requirements', 'productowner', 'Definición de Requerimientos', 15),
  ('stakeholder', 'productowner', 'Gestión de Stakeholders', 15),
  ('roadmap', 'productowner', 'Planificación de Roadmap', 15),
  ('collaboration', 'productowner', 'Colaboración & Comunicación', 15),
  ('business', 'productowner', 'Conocimiento FIGO', 10),
  ('innovation', 'productowner', 'Innovación & Mejora Continua', 10);

-- INSERTAR COMPETENCIAS PARA SCRUM MASTER
INSERT INTO competencies (id, role, name, weight) VALUES
  ('agile', 'scrummaster', 'Conocimiento Ágil/Scrum', 20),
  ('facilitation', 'scrummaster', 'Facilitación de Ceremonias', 15),
  ('coaching', 'scrummaster', 'Coaching de Equipo', 15),
  ('impediments', 'scrummaster', 'Gestión de Impedimentos', 15),
  ('collaboration', 'scrummaster', 'Colaboración & Comunicación', 15),
  ('problem', 'scrummaster', 'Resolución de Problemas', 10),
  ('autonomy', 'scrummaster', 'Autonomía & Ownership', 10);

-- INSERTAR COMPETENCIAS PARA UX/UI
INSERT INTO competencies (id, role, name, weight) VALUES
  ('design', 'uxui', 'Habilidades de Diseño', 20),
  ('usability', 'uxui', 'Enfoque Centrado en Usuario', 20),
  ('tools', 'uxui', 'Dominio de Herramientas (Figma, XD)', 15),
  ('prototyping', 'uxui', 'Prototipado & Wireframing', 15),
  ('collaboration', 'uxui', 'Colaboración & Comunicación', 15),
  ('problem', 'uxui', 'Resolución de Problemas', 10),
  ('innovation', 'uxui', 'Innovación & Mejora Continua', 5);

-- INSERTAR COMPETENCIAS PARA DELIVERY MANAGER
INSERT INTO competencies (id, role, name, weight) VALUES
  ('planning', 'deliverymanager', 'Planificación & Scheduling', 20),
  ('risk', 'deliverymanager', 'Gestión de Riesgos', 15),
  ('budget', 'deliverymanager', 'Control Presupuestario', 15),
  ('stakeholder', 'deliverymanager', 'Gestión de Stakeholders', 15),
  ('collaboration', 'deliverymanager', 'Colaboración & Comunicación', 15),
  ('problem', 'deliverymanager', 'Resolución de Problemas', 10),
  ('business', 'deliverymanager', 'Conocimiento FIGO', 10);
```

**Ejecuta con Ctrl+Enter**

Si ves ✅ verde, todo está creado correctamente.

---

## PARTE 3: Verificar que todo está bien

### Paso 1: Ver las tablas creadas

1. En el menú izquierdo de Supabase, ve a **Table Editor**
2. Deberías ver:
   - ✅ teams
   - ✅ members
   - ✅ evaluations
   - ✅ evidence
   - ✅ competencies

### Paso 2: Verificar los datos

1. Haz clic en tabla **competencies**
2. Deberías ver todas las competencias por rol (Developer, QA, etc.)
3. Si ves las filas, ¡está perfecto!

---

## PARTE 4: Habilitar Realtime (Opcional pero Recomendado)

Para que los cambios se vean en tiempo real en la app:

1. Ve a **Realtime** en el menú izquierdo
2. Selecciona cada tabla:
   - teams
   - members
   - evaluations
   - evidence
3. Haz clic en cada una y activa **Realtime**

---

## PARTE 5: Conectar la App a Supabase

Tu app ya tiene el código para conectarse. Solo necesitas verificar que esté usando el Supabase correcto.

### Verificar variables de entorno:

1. Abre el archivo `.env.local` (o crea uno si no existe)
2. Verifica que tenga:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anon
```

**¿Dónde encontrar estas claves?**
- Ve a Supabase Dashboard
- Haz clic en **Settings** (engranaje)
- Ve a **API**
- Copia:
  - **Project URL** → VITE_SUPABASE_URL
  - **anon public** → VITE_SUPABASE_ANON_KEY

---

## PARTE 6: Crear datos de prueba (Opcional)

Si quieres probar la app con datos de ejemplo:

### Crear un equipo de prueba:

En SQL Editor, copia esto (REEMPLAZA el UUID con tu user_id):

```sql
-- Primero obtén tu user_id
SELECT auth.uid();

-- Luego inserta un equipo de prueba
INSERT INTO teams (client, description, user_id)
VALUES (
  'Proyecto Prueba',
  'Equipo de prueba para Career Path',
  'TU-USER-ID-AQUI'  -- Reemplaza esto
) RETURNING id;
```

Ejecuta y copia el ID que aparezca.

### Crear miembros de prueba:

```sql
INSERT INTO members (team_id, name, email, role, level, level_target)
VALUES
  (1, 'Juan Pérez', 'juan@example.com', 'developer', 'jr', 'mid'),
  (1, 'María García', 'maria@example.com', 'qa', 'mid', 'sr'),
  (1, 'Carlos López', 'carlos@example.com', 'productowner', 'sr', 'sr');
```

(Reemplaza `1` con el ID del equipo que creaste)

---

## RESUMEN

✅ **Tablas creadas:**
- teams (Equipos)
- members (Miembros)
- evaluations (Evaluaciones)
- evidence (Evidencias)
- competencies (Competencias)

✅ **Seguridad:**
- Row Level Security habilitado
- Políticas de acceso configuradas
- Solo ven sus propios datos

✅ **Datos estáticos:**
- Todas las competencias por rol insertadas

✅ **Próximo paso:**
- Conectar la app a esta base de datos
- Hacer push a GitHub
- Deploying en Cloudflare

---

## ¿Problemas?

Si algo no funciona:
1. Copia el mensaje de error
2. Comparte conmigo
3. Lo arreglamos

---

**Última actualización:** 2025-12-02
**Proyecto:** Career Path System
**Base de datos:** Supabase PostgreSQL
