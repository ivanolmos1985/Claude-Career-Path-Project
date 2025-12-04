# Setup Database Fixes for Competencies

## Problem Summary
The CompetencyManager was not persisting changes to competencies (name, description, weight) when editing.

## Root Causes Fixed
1. **Schema Issue**: `description` column missing from competencies table
2. **Loading Issue**: CompetencyManager was loading from local cache instead of database
3. **RLS Issue**: Policies didn't allow updating base competencies (team_id = NULL)

## Required Database Setup

Execute the following SQL queries in your Supabase SQL Editor in order. You can find the complete script in `complete_competencies_fix.sql`.

### QUERY 1: Add description column
```sql
ALTER TABLE IF EXISTS public.competencies
ADD COLUMN IF NOT EXISTS description TEXT;
```

### QUERY 2: Ensure all required columns exist
```sql
ALTER TABLE IF EXISTS public.competencies
ADD COLUMN IF NOT EXISTS team_id BIGINT REFERENCES public.teams(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);
```

### QUERY 3: Enable RLS on competencies table
```sql
ALTER TABLE public.competencies ENABLE ROW LEVEL SECURITY;
```

### QUERY 4: Drop all existing policies
```sql
DROP POLICY IF EXISTS competencies_select_policy ON public.competencies;
DROP POLICY IF EXISTS competencies_insert_policy ON public.competencies;
DROP POLICY IF EXISTS competencies_update_policy ON public.competencies;
DROP POLICY IF EXISTS competencies_delete_policy ON public.competencies;
```

### QUERY 5: Create SELECT policy
```sql
CREATE POLICY competencies_select_policy ON public.competencies
  FOR SELECT
  USING (
    team_id IS NULL OR
    team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
  );
```

### QUERY 6: Create INSERT policy
```sql
CREATE POLICY competencies_insert_policy ON public.competencies
  FOR INSERT
  WITH CHECK (
    team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
  );
```

### QUERY 7: Create UPDATE policy (IMPORTANT - allows editing base competencies)
```sql
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
```

### QUERY 8: Create DELETE policy
```sql
CREATE POLICY competencies_delete_policy ON public.competencies
  FOR DELETE
  USING (
    team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
  );
```

## Verification Queries

After executing all 8 queries, verify the setup with these queries:

### Check description column exists:
```sql
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'competencies' AND column_name = 'description';
```

### Check all competencies columns:
```sql
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'competencies' ORDER BY ordinal_position;
```

### Check RLS policies are in place:
```sql
SELECT policyname, permissive, roles, qual, with_check
FROM pg_policies WHERE tablename = 'competencies';
```

### Check base competencies in database:
```sql
SELECT id, role, name, weight, team_id, description
FROM competencies
WHERE team_id IS NULL
LIMIT 10;
```

## Code Changes Made

### 1. AppContext.jsx
- ✅ Added `getCompetenciesFromDB()` function to fetch competencies from database
- ✅ Enhanced `updateCompetency()` with `.select()` to verify updates succeed
- ✅ Better error messages when RLS blocks operations

### 2. CompetencyManager.jsx
- ✅ Changed to use `getCompetenciesFromDB()` instead of local `getCompetencies()`
- ✅ Made `loadCompetencies()` async to properly load from database
- ✅ Now reflects actual changes after create/update/delete operations

## Expected Behavior After Setup

✅ Editing a competency saves changes to the database
✅ Changes are immediately reflected in the UI
✅ Name, description, and weight can all be edited
✅ Creating new competencies works correctly
✅ Deleting competencies (soft delete) works correctly
✅ Base competencies can be edited by the team owner

## Troubleshooting

### Changes still not persisting?
1. Make sure all 8 queries were executed successfully
2. Check browser console for error messages (Ctrl+F12, Console tab)
3. Verify RLS policies with the verification query above
4. Check that you're logged in as the team owner

### "Permission denied" error?
This means RLS policy didn't allow the operation. Run the verification queries to ensure policies exist and are correct.

### Competencies not showing?
Clear browser cache (Ctrl+Shift+Delete) and reload the page. The CompetencyManager now loads directly from database each time it opens.

## Files Changed
- `src/context/AppContext.jsx` - Added getCompetenciesFromDB(), improved updateCompetency()
- `src/components/CompetencyManager.jsx` - Updated to load from database
- `complete_competencies_fix.sql` - Complete SQL setup script
- `fix_competencies_rls.sql` - RLS policies only
- `add_description_column.sql` - Description column only

## Next Steps
1. Execute all 8 SQL queries above in Supabase SQL Editor
2. Run the verification queries to confirm setup
3. Test creating, editing, and deleting competencies in the UI
4. If issues persist, check browser console and database error logs
