-- ============================================================================
-- COMPLETE FIX FOR COMPETENCIES TABLE
-- Execute these queries in Supabase SQL Editor one by one
-- ============================================================================

-- QUERY 1: Add missing description column
ALTER TABLE IF EXISTS public.competencies
ADD COLUMN IF NOT EXISTS description TEXT;

-- QUERY 2: Ensure team_id, is_deleted columns exist
ALTER TABLE IF EXISTS public.competencies
ADD COLUMN IF NOT EXISTS team_id BIGINT REFERENCES public.teams(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

-- QUERY 3: Enable RLS on competencies table
ALTER TABLE public.competencies ENABLE ROW LEVEL SECURITY;

-- QUERY 4: Drop all existing policies on competencies
DROP POLICY IF EXISTS competencies_select_policy ON public.competencies;
DROP POLICY IF EXISTS competencies_insert_policy ON public.competencies;
DROP POLICY IF EXISTS competencies_update_policy ON public.competencies;
DROP POLICY IF EXISTS competencies_delete_policy ON public.competencies;

-- QUERY 5: Create SELECT policy - Allow viewing base competencies and team's custom competencies
CREATE POLICY competencies_select_policy ON public.competencies
  FOR SELECT
  USING (
    team_id IS NULL OR
    team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
  );

-- QUERY 6: Create INSERT policy - Allow creating custom competencies for own teams
CREATE POLICY competencies_insert_policy ON public.competencies
  FOR INSERT
  WITH CHECK (
    team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
  );

-- QUERY 7: Create UPDATE policy - Allow updating base competencies and team's custom competencies
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

-- QUERY 8: Create DELETE policy - Allow soft-deleting custom competencies for own teams
CREATE POLICY competencies_delete_policy ON public.competencies
  FOR DELETE
  USING (
    team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
  );

-- ============================================================================
-- VERIFICATION QUERIES (Run these to verify everything is set up correctly)
-- ============================================================================

-- Check that description column exists:
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_name = 'competencies' AND column_name = 'description';

-- Check all competencies columns:
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_name = 'competencies' ORDER BY ordinal_position;

-- Check that RLS policies exist:
-- SELECT policyname, permissive, roles, qual, with_check
-- FROM pg_policies WHERE tablename = 'competencies';

-- Check base competencies in database:
-- SELECT id, role, name, weight, team_id FROM competencies WHERE team_id IS NULL LIMIT 10;
