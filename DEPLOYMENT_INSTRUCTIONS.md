# 🚀 DEPLOYMENT INSTRUCTIONS - PRODUCTION

## Code Deployment Status
✅ **COMPLETE** - All code changes pushed to GitHub
Branch: `main`
Remote: `https://github.com/ivanolmos1985/Claude-Career-Path-Project`

### Recent Commits Deployed
1. ✅ feat: Add CRUD functions for evaluation system enhancements
2. ✅ feat: Add CompetencyManager and TaskManager components
3. ✅ feat: Redesign EvaluationPage with 1-10 scale and task hierarchy
4. ✅ feat: Redesign DecisionPage with weighted scoring
5. ✅ fix: Resolve foreign key constraint error in task creation
6. ✅ fix: Add description column to competencies table schema
7. ✅ fix: Improve competency update with better diagnostics
8. ✅ fix: Load competencies from database instead of cache
9. ✅ docs: Add comprehensive setup guide for competencies fixes

---

## Database Deployment Required

The application code is ready. Now you must execute SQL in your Supabase database.

### Step 1: Open Supabase SQL Editor

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New query**

### Step 2: Execute Queries in Order

Execute these 8 queries one at a time (paste, run, wait for success, then next):

#### QUERY 1: Add description column
```sql
ALTER TABLE IF EXISTS public.competencies
ADD COLUMN IF NOT EXISTS description TEXT;
```

**Wait for**: ✅ Success

#### QUERY 2: Add team-specific columns
```sql
ALTER TABLE IF EXISTS public.competencies
ADD COLUMN IF NOT EXISTS team_id BIGINT REFERENCES public.teams(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);
```

**Wait for**: ✅ Success

#### QUERY 3: Enable RLS
```sql
ALTER TABLE public.competencies ENABLE ROW LEVEL SECURITY;
```

**Wait for**: ✅ Success

#### QUERY 4: Drop old policies
```sql
DROP POLICY IF EXISTS competencies_select_policy ON public.competencies;
DROP POLICY IF EXISTS competencies_insert_policy ON public.competencies;
DROP POLICY IF EXISTS competencies_update_policy ON public.competencies;
DROP POLICY IF EXISTS competencies_delete_policy ON public.competencies;
```

**Wait for**: ✅ Success (even if says "0 rows affected")

#### QUERY 5: CREATE SELECT POLICY
```sql
CREATE POLICY competencies_select_policy ON public.competencies
  FOR SELECT
  USING (
    team_id IS NULL OR
    team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
  );
```

**Wait for**: ✅ Success

#### QUERY 6: CREATE INSERT POLICY
```sql
CREATE POLICY competencies_insert_policy ON public.competencies
  FOR INSERT
  WITH CHECK (
    team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
  );
```

**Wait for**: ✅ Success

#### QUERY 7: CREATE UPDATE POLICY (CRITICAL)
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

**Wait for**: ✅ Success

#### QUERY 8: CREATE DELETE POLICY
```sql
CREATE POLICY competencies_delete_policy ON public.competencies
  FOR DELETE
  USING (
    team_id IN (SELECT id FROM public.teams WHERE user_id = auth.uid())
  );
```

**Wait for**: ✅ Success

---

## Step 3: Verify Setup

Run these verification queries to confirm everything is working:

### Check Description Column
```sql
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'competencies' AND column_name = 'description';
```

**Expected Result**: One row with `description` and `text`

### Check All Columns
```sql
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'competencies' ORDER BY ordinal_position;
```

**Expected Result**: 9+ columns including: id, role, name, weight, description, team_id, is_deleted, deleted_at, deleted_by

### Check RLS Policies
```sql
SELECT policyname, permissive, roles, qual
FROM pg_policies WHERE tablename = 'competencies'
ORDER BY policyname;
```

**Expected Result**: 4 policies - competencies_delete_policy, competencies_insert_policy, competencies_select_policy, competencies_update_policy

### Check Base Competencies
```sql
SELECT id, role, name, weight, team_id
FROM competencies
WHERE team_id IS NULL
LIMIT 5;
```

**Expected Result**: Base competencies like 'tech', 'quality', 'testdomain', etc.

---

## Step 4: Test the Application

1. **Clear browser cache**: Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
2. **Reload application**: F5 or Ctrl+R
3. **Navigate to**: Teams Page → Teams Management → Click a team
4. **Test Competencies**:
   - Click "📚 Competencias" button
   - Try editing a competency name/description/weight
   - Click "Guardar" button
   - Verify changes appear immediately
   - Refresh the page - changes should still be there

---

## What's Deployed

### 🎯 New Features in Production

#### 1. Task-Based Evaluation System
- **EvaluationPage**: Rate individual tasks 1-10 per competency
- **Task Hierarchy**: Competencies → Tasks → Ratings
- **Evidence Upload**: PDF, DOCX, XLSX, JPG, PNG, GIF files

#### 2. Competency Management
- **CompetencyManager**: Create, edit, delete competencies
- **TaskManager**: Add tasks to competencies
- **Editable Weights**: Customize competency weights (1-100%)

#### 3. Advanced Scoring
- **1-10 Scale**: Individual task ratings (was 1-5)
- **Competency Score**: Average of task ratings
- **Weighted Scoring**: (competencyScore/10) × weight%
- **Q4 Promotion Decision**: ≥80 (APROBADA), ≥70 (PENDIENTE), <70 (NO APROBADA)

#### 4. DecisionPage Updates
- **Weighted Metrics**: Q4 score (0-100 scale)
- **Competencies Breakdown**: Shows score, weight, weighted score per competency
- **Annual Average**: Tracks all 4 quarters
- **PDF Export**: Updated with new scoring format

### 📊 Database Changes

#### New Tables
- `tasks` - Individual tasks per competency
- `task_evaluations` - 1-10 ratings per task/quarter
- `evidence_files` - File uploads for task evidence
- `team_competency_weights` - Custom weights per team

#### Altered Tables
- `competencies` - Added: description, team_id, is_deleted, deleted_at, deleted_by
- `evaluations` - Added: rating_scale (for backward compatibility)

#### Security
- Row Level Security (RLS) policies on all new tables
- Base competencies accessible to all team owners
- Custom competencies isolated per team

### 🔧 Code Improvements

#### AppContext.jsx (+100 lines)
- Added 14+ CRUD functions for competencies/tasks
- Added `getCompetenciesFromDB()` for real-time data
- Improved error handling and diagnostics
- File upload validation (MIME type, 10MB limit)

#### EvaluationPage.jsx (Complete rewrite)
- Task-based evaluation interface
- 1-10 rating buttons per task
- Multi-file upload for evidence
- Quarter selector (Q1-Q4)
- Real-time competency calculations

#### DecisionPage.jsx (Complete rewrite)
- Weighted scoring calculations
- Competencies breakdown table
- Q4 vs Annual average tracking
- Updated PDF export format

#### New Components
- **CompetencyManager.jsx** - Modal for CRUD competencies
- **TaskManager.jsx** - Modal for CRUD tasks

---

## Rollback Plan (if needed)

If something goes wrong:

1. **Code Rollback**:
   ```bash
   git revert HEAD~8  # Revert last 8 commits
   git push
   ```

2. **Database Rollback**:
   - Restore from Supabase backup (if available)
   - Or manually DROP policies and ALTER TABLE to remove columns

---

## Support & Troubleshooting

### If competencies won't update:
1. Check browser console (F12) for error messages
2. Run verification queries above
3. Check RLS policies exist and have correct conditions
4. Verify you're logged in as team owner

### If new features don't appear:
1. Clear browser cache completely
2. Hard reload (Ctrl+Shift+R or Cmd+Shift+R)
3. Check that all 8 SQL queries executed successfully

### If file uploads fail:
1. Check Supabase Storage bucket exists
2. Verify RLS policies on storage are correct
3. Check file size is under 10MB
4. Verify file type is allowed (pdf, docx, xlsx, jpg, png, gif)

---

## Deployment Summary

| Component | Status | Notes |
|-----------|--------|-------|
| GitHub Code | ✅ Deployed | 8 commits pushed to main |
| Application Build | ✅ Passing | 518 modules, no errors |
| Database Schema | ⏳ Pending | Execute 8 SQL queries above |
| RLS Policies | ⏳ Pending | Queries 3-8 above |
| Production Ready | ⏳ Pending | After SQL deployment |

---

## Next Steps

1. ✅ Code deployment complete
2. 📋 **Execute SQL queries above** ← YOU ARE HERE
3. ✅ Verify setup with verification queries
4. ✅ Test application features
5. ✅ Monitor for issues

**Time Estimate**: 5-10 minutes to complete SQL deployment
