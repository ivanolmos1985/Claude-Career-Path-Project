-- ============================================================================
-- PHASE 1: DATABASE MIGRATION - EVALUATION SYSTEM ENHANCEMENTS
-- Execute this script in SEPARATE queries (don't run all at once)
-- ============================================================================

-- ============================================================================
-- QUERY 1: Alter competencies table
-- ============================================================================
ALTER TABLE IF EXISTS public.competencies
ADD COLUMN IF NOT EXISTS team_id BIGINT REFERENCES public.teams(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

-- ============================================================================
-- QUERY 2: Alter evaluations table - FIX rating_scale column size
-- ============================================================================
ALTER TABLE IF EXISTS public.evaluations
DROP COLUMN IF EXISTS rating_scale;

ALTER TABLE IF EXISTS public.evaluations
ADD COLUMN IF NOT EXISTS rating_scale VARCHAR(20) DEFAULT 'v1';

-- ============================================================================
-- QUERY 3: Create tasks table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.tasks (
  id BIGSERIAL PRIMARY KEY,
  competency_id VARCHAR(50) NOT NULL REFERENCES public.competencies(id) ON DELETE CASCADE,
  team_id BIGINT REFERENCES public.teams(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT tasks_unique_per_competency UNIQUE(competency_id, team_id, name)
);

-- ============================================================================
-- QUERY 4: Create task_evaluations table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.task_evaluations (
  id BIGSERIAL PRIMARY KEY,
  member_id BIGINT NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  task_id BIGINT NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  quarter VARCHAR(2) NOT NULL CHECK (quarter IN ('Q1','Q2','Q3','Q4')),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT task_evaluations_unique UNIQUE(member_id, task_id, quarter),
  CONSTRAINT task_evaluations_rating_check CHECK (rating >= 1 AND rating <= 10)
);

-- ============================================================================
-- QUERY 5: Create evidence_files table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.evidence_files (
  id BIGSERIAL PRIMARY KEY,
  evidence_id BIGINT REFERENCES public.evidence(id) ON DELETE CASCADE,
  task_id BIGINT REFERENCES public.tasks(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50),
  file_size BIGINT,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT evidence_files_has_reference CHECK (evidence_id IS NOT NULL OR task_id IS NOT NULL)
);

-- ============================================================================
-- QUERY 6: Create team_competency_weights table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.team_competency_weights (
  id BIGSERIAL PRIMARY KEY,
  team_id BIGINT NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  competency_id VARCHAR(50) NOT NULL REFERENCES public.competencies(id) ON DELETE CASCADE,
  weight INT NOT NULL CHECK (weight >= 1 AND weight <= 100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT team_weights_unique UNIQUE(team_id, competency_id),
  CONSTRAINT team_weights_range CHECK (weight >= 1 AND weight <= 100)
);

-- ============================================================================
-- QUERY 7: Create indexes on tasks
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_tasks_competency ON public.tasks(competency_id);
CREATE INDEX IF NOT EXISTS idx_tasks_team ON public.tasks(team_id);
CREATE INDEX IF NOT EXISTS idx_tasks_active ON public.tasks(is_active);
CREATE INDEX IF NOT EXISTS idx_tasks_display_order ON public.tasks(competency_id, display_order);

-- ============================================================================
-- QUERY 8: Create indexes on task_evaluations
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_task_evaluations_member ON public.task_evaluations(member_id);
CREATE INDEX IF NOT EXISTS idx_task_evaluations_task ON public.task_evaluations(task_id);
CREATE INDEX IF NOT EXISTS idx_task_evaluations_quarter ON public.task_evaluations(member_id, quarter);
CREATE INDEX IF NOT EXISTS idx_task_evaluations_unique ON public.task_evaluations(member_id, task_id, quarter);

-- ============================================================================
-- QUERY 9: Create indexes on evidence_files
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_evidence_files_evidence ON public.evidence_files(evidence_id);
CREATE INDEX IF NOT EXISTS idx_evidence_files_task ON public.evidence_files(task_id);
CREATE INDEX IF NOT EXISTS idx_evidence_files_uploaded_by ON public.evidence_files(uploaded_by);

-- ============================================================================
-- QUERY 10: Create indexes on team_competency_weights
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_team_weights_team ON public.team_competency_weights(team_id);
CREATE INDEX IF NOT EXISTS idx_team_weights_competency ON public.team_competency_weights(competency_id);

-- ============================================================================
-- QUERY 11: Create indexes on competencies
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_competencies_deleted ON public.competencies(is_deleted);
CREATE INDEX IF NOT EXISTS idx_competencies_team ON public.competencies(team_id);

-- ============================================================================
-- QUERY 12: Enable RLS on new tables
-- ============================================================================
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_competency_weights ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- QUERY 13: Create RLS policies for tasks table
-- ============================================================================
DROP POLICY IF EXISTS tasks_select_policy ON public.tasks;
CREATE POLICY tasks_select_policy ON public.tasks
  FOR SELECT
  USING (
    team_id IS NULL OR
    team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS tasks_insert_policy ON public.tasks;
CREATE POLICY tasks_insert_policy ON public.tasks
  FOR INSERT
  WITH CHECK (
    team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS tasks_update_policy ON public.tasks;
CREATE POLICY tasks_update_policy ON public.tasks
  FOR UPDATE
  USING (
    team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
  )
  WITH CHECK (
    team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS tasks_delete_policy ON public.tasks;
CREATE POLICY tasks_delete_policy ON public.tasks
  FOR DELETE
  USING (
    team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
  );

-- ============================================================================
-- QUERY 14: Create RLS policies for task_evaluations table
-- ============================================================================
DROP POLICY IF EXISTS task_evaluations_select_policy ON public.task_evaluations;
CREATE POLICY task_evaluations_select_policy ON public.task_evaluations
  FOR SELECT
  USING (
    member_id IN (
      SELECT id FROM public.members
      WHERE team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS task_evaluations_insert_policy ON public.task_evaluations;
CREATE POLICY task_evaluations_insert_policy ON public.task_evaluations
  FOR INSERT
  WITH CHECK (
    member_id IN (
      SELECT id FROM public.members
      WHERE team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS task_evaluations_update_policy ON public.task_evaluations;
CREATE POLICY task_evaluations_update_policy ON public.task_evaluations
  FOR UPDATE
  USING (
    member_id IN (
      SELECT id FROM public.members
      WHERE team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
    )
  )
  WITH CHECK (
    member_id IN (
      SELECT id FROM public.members
      WHERE team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS task_evaluations_delete_policy ON public.task_evaluations;
CREATE POLICY task_evaluations_delete_policy ON public.task_evaluations
  FOR DELETE
  USING (
    member_id IN (
      SELECT id FROM public.members
      WHERE team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
    )
  );

-- ============================================================================
-- QUERY 15: Create RLS policies for evidence_files table
-- ============================================================================
DROP POLICY IF EXISTS evidence_files_select_policy ON public.evidence_files;
CREATE POLICY evidence_files_select_policy ON public.evidence_files
  FOR SELECT
  USING (
    task_id IN (
      SELECT id FROM public.tasks
      WHERE team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
    ) OR
    evidence_id IN (
      SELECT id FROM public.evidence
      WHERE member_id IN (
        SELECT id FROM public.members
        WHERE team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
      )
    )
  );

DROP POLICY IF EXISTS evidence_files_insert_policy ON public.evidence_files;
CREATE POLICY evidence_files_insert_policy ON public.evidence_files
  FOR INSERT
  WITH CHECK (
    (
      task_id IN (
        SELECT id FROM public.tasks
        WHERE team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
      )
    ) OR
    (
      evidence_id IN (
        SELECT id FROM public.evidence
        WHERE member_id IN (
          SELECT id FROM public.members
          WHERE team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
        )
      )
    )
  );

DROP POLICY IF EXISTS evidence_files_delete_policy ON public.evidence_files;
CREATE POLICY evidence_files_delete_policy ON public.evidence_files
  FOR DELETE
  USING (
    uploaded_by = auth.uid() OR
    task_id IN (
      SELECT id FROM public.tasks
      WHERE team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
    )
  );

-- ============================================================================
-- QUERY 16: Create RLS policies for team_competency_weights table
-- ============================================================================
DROP POLICY IF EXISTS team_weights_select_policy ON public.team_competency_weights;
CREATE POLICY team_weights_select_policy ON public.team_competency_weights
  FOR SELECT
  USING (
    team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS team_weights_insert_policy ON public.team_competency_weights;
CREATE POLICY team_weights_insert_policy ON public.team_competency_weights
  FOR INSERT
  WITH CHECK (
    team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS team_weights_update_policy ON public.team_competency_weights;
CREATE POLICY team_weights_update_policy ON public.team_competency_weights
  FOR UPDATE
  USING (
    team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
  )
  WITH CHECK (
    team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS team_weights_delete_policy ON public.team_competency_weights;
CREATE POLICY team_weights_delete_policy ON public.team_competency_weights
  FOR DELETE
  USING (
    team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
  );

-- ============================================================================
-- QUERY 17: Data migration - Convert 1-5 ratings to 1-10 scale
-- ============================================================================
UPDATE public.evaluations
SET
  rating = rating * 2,
  rating_scale = 'v1_migrated'
WHERE rating_scale = 'v1' AND rating IS NOT NULL;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these to verify the migration was successful:

-- Check if all 4 new tables exist:
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public' AND table_name IN ('tasks', 'task_evaluations', 'evidence_files', 'team_competency_weights')
-- ORDER BY table_name;

-- Check if competencies columns were added:
-- SELECT column_name FROM information_schema.columns
-- WHERE table_name = 'competencies' AND column_name IN ('team_id', 'is_deleted', 'deleted_at', 'deleted_by')
-- ORDER BY column_name;

-- Check if rating_scale column exists:
-- SELECT column_name, character_maximum_length FROM information_schema.columns
-- WHERE table_name = 'evaluations' AND column_name = 'rating_scale';
