-- ============================================================================
-- FIX: Update RLS policies for competencies table
-- ============================================================================
-- The competencies table needs RLS policies to allow:
-- 1. SELECT: Users can see competencies for their teams (custom) and global base competencies
-- 2. INSERT: Users can create custom competencies for their teams
-- 3. UPDATE: Users can update competencies for their teams, and base competencies
-- 4. DELETE: Users can soft-delete custom competencies for their teams

-- Enable RLS on competencies table if not already enabled
ALTER TABLE public.competencies ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS competencies_select_policy ON public.competencies;
DROP POLICY IF EXISTS competencies_insert_policy ON public.competencies;
DROP POLICY IF EXISTS competencies_update_policy ON public.competencies;
DROP POLICY IF EXISTS competencies_delete_policy ON public.competencies;

-- Policy 1: SELECT - Users can see base competencies (team_id IS NULL) and custom ones for their teams
CREATE POLICY competencies_select_policy ON public.competencies
  FOR SELECT
  USING (
    team_id IS NULL OR
    team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
  );

-- Policy 2: INSERT - Users can create competencies for their teams
CREATE POLICY competencies_insert_policy ON public.competencies
  FOR INSERT
  WITH CHECK (
    team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
  );

-- Policy 3: UPDATE - Users can update base competencies and custom ones for their teams
CREATE POLICY competencies_update_policy ON public.competencies
  FOR UPDATE
  USING (
    team_id IS NULL OR
    team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
  )
  WITH CHECK (
    team_id IS NULL OR
    team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
  );

-- Policy 4: DELETE - Users can delete custom competencies for their teams (soft delete via update)
CREATE POLICY competencies_delete_policy ON public.competencies
  FOR DELETE
  USING (
    team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
  );
