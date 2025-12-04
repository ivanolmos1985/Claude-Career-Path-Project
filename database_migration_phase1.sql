-- ============================================================================
-- PHASE 1: DATABASE MIGRATION - EVALUATION SYSTEM ENHANCEMENTS
-- ============================================================================
-- This script creates 4 new tables, alters 2 existing tables, creates indexes,
-- and sets up RLS policies for the improved evaluation system.
-- ============================================================================

-- ============================================================================
-- PART 1: ALTER EXISTING TABLES
-- ============================================================================

-- Add columns to competencies table for soft delete and team customization
ALTER TABLE IF EXISTS public.competencies
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS team_id BIGINT REFERENCES public.teams(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

-- Add rating_scale column to evaluations table for backward compatibility
ALTER TABLE IF EXISTS public.evaluations
ADD COLUMN IF NOT EXISTS rating_scale VARCHAR(20) DEFAULT 'v1';

-- ============================================================================
-- PART 2: CREATE NEW TABLES
-- ============================================================================

-- TABLE 1: tasks - Individual tasks that make up a competency
CREATE TABLE IF NOT EXISTS public.tasks (
  id BIGSERIAL PRIMARY KEY,
  competency_id VARCHAR(50) NOT NULL REFERENCES public.competencies(id) ON DELETE CASCADE,
  team_id BIGINT REFERENCES public.teams(id) ON DELETE CASCADE,  -- NULL = global, NOT NULL = team-specific
  name VARCHAR(255) NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT tasks_unique_per_competency UNIQUE(competency_id, team_id, name)
);

-- TABLE 2: task_evaluations - Ratings for individual tasks (1-10 scale)
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

-- TABLE 3: evidence_files - File uploads for task/competency evidence
CREATE TABLE IF NOT EXISTS public.evidence_files (
  id BIGSERIAL PRIMARY KEY,
  evidence_id BIGINT REFERENCES public.evidence(id) ON DELETE CASCADE,  -- General evidence
  task_id BIGINT REFERENCES public.tasks(id) ON DELETE CASCADE,         -- Task-specific evidence
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50),
  file_size BIGINT,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT evidence_files_has_reference CHECK (evidence_id IS NOT NULL OR task_id IS NOT NULL)
);

-- TABLE 4: team_competency_weights - Per-team customizable competency weights
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
-- PART 3: CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- Indexes on tasks table
CREATE INDEX IF NOT EXISTS idx_tasks_competency ON public.tasks(competency_id);
CREATE INDEX IF NOT EXISTS idx_tasks_team ON public.tasks(team_id);
CREATE INDEX IF NOT EXISTS idx_tasks_active ON public.tasks(is_active);
CREATE INDEX IF NOT EXISTS idx_tasks_display_order ON public.tasks(competency_id, display_order);

-- Indexes on task_evaluations table
CREATE INDEX IF NOT EXISTS idx_task_evaluations_member ON public.task_evaluations(member_id);
CREATE INDEX IF NOT EXISTS idx_task_evaluations_task ON public.task_evaluations(task_id);
CREATE INDEX IF NOT EXISTS idx_task_evaluations_quarter ON public.task_evaluations(member_id, quarter);
CREATE INDEX IF NOT EXISTS idx_task_evaluations_unique ON public.task_evaluations(member_id, task_id, quarter);

-- Indexes on evidence_files table
CREATE INDEX IF NOT EXISTS idx_evidence_files_evidence ON public.evidence_files(evidence_id);
CREATE INDEX IF NOT EXISTS idx_evidence_files_task ON public.evidence_files(task_id);
CREATE INDEX IF NOT EXISTS idx_evidence_files_uploaded_by ON public.evidence_files(uploaded_by);

-- Indexes on team_competency_weights table
CREATE INDEX IF NOT EXISTS idx_team_weights_team ON public.team_competency_weights(team_id);
CREATE INDEX IF NOT EXISTS idx_team_weights_competency ON public.team_competency_weights(competency_id);

-- Index on competencies for soft delete
CREATE INDEX IF NOT EXISTS idx_competencies_deleted ON public.competencies(is_deleted);
CREATE INDEX IF NOT EXISTS idx_competencies_team ON public.competencies(team_id);

-- ============================================================================
-- PART 4: ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on new tables
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_competency_weights ENABLE ROW LEVEL SECURITY;

-- TASKS TABLE POLICIES
-- Policy 1: Users can see tasks for competencies of their teams
DROP POLICY IF EXISTS tasks_select_policy ON public.tasks;
CREATE POLICY tasks_select_policy ON public.tasks
  FOR SELECT
  USING (
    team_id IS NULL OR  -- Global tasks
    team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())  -- User's team tasks
  );

-- Policy 2: Team owners can insert tasks for their team competencies
DROP POLICY IF EXISTS tasks_insert_policy ON public.tasks;
CREATE POLICY tasks_insert_policy ON public.tasks
  FOR INSERT
  WITH CHECK (
    team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
  );

-- Policy 3: Team owners can update tasks for their team competencies
DROP POLICY IF EXISTS tasks_update_policy ON public.tasks;
CREATE POLICY tasks_update_policy ON public.tasks
  FOR UPDATE
  USING (
    team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
  )
  WITH CHECK (
    team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
  );

-- Policy 4: Team owners can delete tasks for their team competencies
DROP POLICY IF EXISTS tasks_delete_policy ON public.tasks;
CREATE POLICY tasks_delete_policy ON public.tasks
  FOR DELETE
  USING (
    team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
  );

-- TASK_EVALUATIONS TABLE POLICIES
-- Policy 1: Users can see evaluations for their team members
DROP POLICY IF EXISTS task_evaluations_select_policy ON public.task_evaluations;
CREATE POLICY task_evaluations_select_policy ON public.task_evaluations
  FOR SELECT
  USING (
    member_id IN (
      SELECT id FROM public.members
      WHERE team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
    )
  );

-- Policy 2: Users can insert evaluations for their team members
DROP POLICY IF EXISTS task_evaluations_insert_policy ON public.task_evaluations;
CREATE POLICY task_evaluations_insert_policy ON public.task_evaluations
  FOR INSERT
  WITH CHECK (
    member_id IN (
      SELECT id FROM public.members
      WHERE team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
    )
  );

-- Policy 3: Users can update evaluations for their team members
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

-- Policy 4: Users can delete evaluations for their team members
DROP POLICY IF EXISTS task_evaluations_delete_policy ON public.task_evaluations;
CREATE POLICY task_evaluations_delete_policy ON public.task_evaluations
  FOR DELETE
  USING (
    member_id IN (
      SELECT id FROM public.members
      WHERE team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
    )
  );

-- EVIDENCE_FILES TABLE POLICIES
-- Policy 1: Users can see evidence files for their team members
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

-- Policy 2: Users can insert evidence files for their team members
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

-- Policy 3: Users can delete their own evidence files
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

-- TEAM_COMPETENCY_WEIGHTS TABLE POLICIES
-- Policy 1: Users can see weights for their teams
DROP POLICY IF EXISTS team_weights_select_policy ON public.team_competency_weights;
CREATE POLICY team_weights_select_policy ON public.team_competency_weights
  FOR SELECT
  USING (
    team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
  );

-- Policy 2: Team owners can insert weights for their teams
DROP POLICY IF EXISTS team_weights_insert_policy ON public.team_competency_weights;
CREATE POLICY team_weights_insert_policy ON public.team_competency_weights
  FOR INSERT
  WITH CHECK (
    team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
  );

-- Policy 3: Team owners can update weights for their teams
DROP POLICY IF EXISTS team_weights_update_policy ON public.team_competency_weights;
CREATE POLICY team_weights_update_policy ON public.team_competency_weights
  FOR UPDATE
  USING (
    team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
  )
  WITH CHECK (
    team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
  );

-- Policy 4: Team owners can delete weights for their teams
DROP POLICY IF EXISTS team_weights_delete_policy ON public.team_competency_weights;
CREATE POLICY team_weights_delete_policy ON public.team_competency_weights
  FOR DELETE
  USING (
    team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
  );

-- ============================================================================
-- PART 5: DATA MIGRATION - Convert existing evaluations 1-5 to 1-10 scale
-- ============================================================================

-- Update existing evaluations to 1-10 scale and mark as migrated
-- 1 → 2, 2 → 4, 3 → 6, 4 → 8, 5 → 10
UPDATE public.evaluations
SET
  rating = rating * 2,
  rating_scale = 'v1_migrated'
WHERE rating_scale = 'v1' AND rating IS NOT NULL;

-- ============================================================================
-- PART 6: SAMPLE DATA FOR TESTING (Optional - Comment out if not needed)
-- ============================================================================

-- This section creates sample data to test the new system
-- Only uncomment if you want to populate with test data

/*
-- Insert sample tasks for 'developer' role's 'tech' competency
INSERT INTO public.tasks (competency_id, team_id, name, description, display_order)
VALUES
  ('dev_tech', NULL, 'C# and .NET Framework Mastery', 'Demonstrates advanced knowledge of C# language features and .NET Framework', 1),
  ('dev_tech', NULL, 'Microservices Architecture', 'Understanding of microservices design patterns and implementation', 2),
  ('dev_tech', NULL, 'Advanced Debugging and Testing', 'Proficiency in debugging techniques and writing comprehensive tests', 3),
  ('dev_tech', NULL, 'REST/GraphQL API Integration', 'Ability to design and integrate REST and GraphQL APIs effectively', 4);
*/

-- ============================================================================
-- PART 7: COMPLETION SUMMARY
-- ============================================================================

-- Run the following queries to verify the migration was successful:
/*
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name IN ('tasks', 'task_evaluations', 'evidence_files', 'team_competency_weights');

SELECT column_name FROM information_schema.columns
WHERE table_name = 'competencies' AND column_name IN ('team_id', 'is_deleted', 'deleted_at', 'deleted_by');

SELECT column_name FROM information_schema.columns
WHERE table_name = 'evaluations' AND column_name = 'rating_scale';
*/

-- ============================================================================
-- END OF PHASE 1 MIGRATION SCRIPT
-- ============================================================================
