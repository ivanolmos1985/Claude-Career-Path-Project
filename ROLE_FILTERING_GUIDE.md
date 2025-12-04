# Role-Based Competency Filtering & Team Isolation

## Overview

The CompetencyManager now supports role-based filtering and team-specific competencies. This allows each team to manage competencies independently by role, without affecting other teams.

## Key Features

### 1. Role-Based Filtering
- Dropdown selector showing 6 roles: Desarrollador, QA, Product Owner, Scrum Master, UX/UI Designer, Delivery Manager
- Filter competencies by role to show only relevant competencies for that role
- Dynamically loads competencies when role changes

### 2. Team Isolation
- Each team can have its own custom competencies
- Custom competencies are isolated per team (team_id = specific team)
- Base competencies are shared across all teams (team_id = NULL)
- Modifying a competency in one team doesn't affect other teams

### 3. Competency Visibility
When filtering by a specific role in CompetencyManager:
- **Shows**: Base competencies for that role (team_id IS NULL)
- **Shows**: Team's custom competencies for that role (team_id = this team)
- **Hides**: Base competencies for other roles
- **Hides**: Other teams' custom competencies

## Architecture

### Database Structure

```
competencies table:
├─ id (VARCHAR) - Unique identifier
├─ role (VARCHAR) - 'developer', 'qa', 'productowner', 'scrummaster', 'uxui', 'deliverymanager'
├─ name (VARCHAR) - Competency name
├─ weight (INT) - Weight percentage
├─ description (TEXT) - Description
├─ team_id (BIGINT) - NULL for base, specific team ID for custom
├─ is_deleted (BOOLEAN) - Soft delete flag
├─ created_at, updated_at, deleted_at, deleted_by - Audit fields
```

### Query Logic

```sql
-- Get competencies for team and role:
SELECT * FROM competencies
WHERE is_deleted = false
  AND role = 'developer'
  AND (team_id IS NULL OR team_id = 123)
```

This query returns:
1. Base competencies for the role (team_id IS NULL)
2. Team's custom competencies for the role (team_id = 123)

## Usage

### For End Users

1. **Open Team Competencies**:
   - Go to Teams page
   - Click "📚 Competencias" for a team

2. **Filter by Role**:
   - Use dropdown "Filtrar por Rol"
   - Select role: Desarrollador, QA, etc.
   - Competencies update automatically

3. **View Competencies**:
   - Base competencies (shared with all teams)
   - Team's custom competencies (only for this team)

4. **Create Custom Competency**:
   - Click "➕ Nueva Competencia"
   - Enter name, description, weight
   - Click "Crear"
   - Competency is created for this team and role only

5. **Edit/Delete**:
   - Edit: Updates only for this team
   - Delete: Soft delete only for this team (doesn't affect other teams)

### For Developers

#### Getting Competencies by Role

```javascript
// Get competencies for a team and role
const competencies = await getCompetenciesFromDB(teamId, 'developer')
// Returns base competencies + team's custom competencies for that role

// Get all competencies for a team (all roles)
const allComps = await getCompetenciesFromDB(teamId)

// Get base competencies for a role
const baseComps = await getCompetenciesFromDB(null, 'developer')
```

#### Creating Team-Specific Competencies

```javascript
// Create custom competency for a team
await addCompetency(teamId, {
  name: 'Custom Skill',
  description: 'Team-specific skill',
  weight: 25,
  role: 'developer'  // Will only appear for developers
})

// Competency ID format:
// team_${teamId}_${role}_${name}
// Example: team_123_developer_custom_skill
```

## Database Queries

### Query 1: Base Competencies for All Roles
```sql
SELECT * FROM competencies
WHERE team_id IS NULL AND is_deleted = false
ORDER BY role, name;
```

### Query 2: Team's Custom Competencies
```sql
SELECT * FROM competencies
WHERE team_id = 123 AND is_deleted = false
ORDER BY role, name;
```

### Query 3: Competencies for Team and Role
```sql
SELECT * FROM competencies
WHERE is_deleted = false
  AND role = 'developer'
  AND (team_id IS NULL OR team_id = 123)
ORDER BY name;
```

### Query 4: Check Competencies by Team
```sql
SELECT team_id, role, COUNT(*) as count
FROM competencies
WHERE is_deleted = false
GROUP BY team_id, role
ORDER BY team_id, role;
```

## Examples

### Scenario 1: Base Competencies (Shared)
```
Team A Developer:
  ├─ Base: Conocimientos Técnicos .NET (team_id = NULL)
  ├─ Base: Calidad de Código (team_id = NULL)
  └─ Base: Resolución de Problemas (team_id = NULL)

Team B Developer:
  ├─ Base: Conocimientos Técnicos .NET (team_id = NULL)  ← Same as Team A
  ├─ Base: Calidad de Código (team_id = NULL)             ← Same as Team A
  └─ Base: Resolución de Problemas (team_id = NULL)       ← Same as Team A
```

### Scenario 2: Custom Team Competencies
```
Team A Developer:
  ├─ Base: Conocimientos Técnicos .NET (team_id = NULL)
  ├─ Base: Calidad de Código (team_id = NULL)
  ├─ Base: Resolución de Problemas (team_id = NULL)
  └─ Custom: React Advanced (team_id = 1, created by Team A)

Team B Developer:
  ├─ Base: Conocimientos Técnicos .NET (team_id = NULL)
  ├─ Base: Calidad de Código (team_id = NULL)
  ├─ Base: Resolución de Problemas (team_id = NULL)
  └─ Custom: Vue.js Advanced (team_id = 2, created by Team B)

Note: React Advanced only visible to Team A, Vue.js Advanced only visible to Team B
```

### Scenario 3: Editing Base vs Custom
```
Editing Base Competency (team_id = NULL):
  ❌ CANNOT edit (shared with all teams)
  ✅ CAN view across all teams

Editing Custom Competency (team_id = 1):
  ✅ CAN edit (only affects Team A)
  ✅ NOT visible to Team B
```

## RLS Security

Row Level Security policies ensure:

```sql
-- SELECT: Users can see base + their team's competencies
team_id IS NULL OR team_id IN (SELECT id FROM teams WHERE user_id = auth.uid())

-- INSERT: Users can only create for their teams
team_id IN (SELECT id FROM teams WHERE user_id = auth.uid())

-- UPDATE: Users can update base or their team's competencies
(team_id IS NULL OR team_id IN (SELECT id FROM teams WHERE user_id = auth.uid()))

-- DELETE: Users can only delete their team's competencies
team_id IN (SELECT id FROM teams WHERE user_id = auth.uid())
```

## Roles Supported

| Role | Display Name | ID |
|------|-------------|-----|
| Developer | Desarrollador | `developer` |
| QA | QA | `qa` |
| Product Owner | Product Owner | `productowner` |
| Scrum Master | Scrum Master | `scrummaster` |
| UX/UI | UX/UI Designer | `uxui` |
| Delivery Manager | Delivery Manager | `deliverymanager` |

## Code Changes

### CompetencyManager.jsx
- Added `ROLES` constant with all 6 roles
- Added `selectedRole` state
- Added role dropdown filter UI
- Updated `loadCompetencies` to pass teamId and role
- Updated `handleCreate` to pass role when creating

### AppContext.jsx
- Updated `getCompetenciesFromDB` to accept teamId and role parameters
- Updated `addCompetency` to use role and include role in competency ID
- Added team_id filter to show base + team's custom competencies

## Testing Checklist

- [ ] Open CompetencyManager for a team
- [ ] See role dropdown with all 6 roles
- [ ] Change role and verify competencies update
- [ ] Create new competency for one role
- [ ] Verify it doesn't appear for other roles
- [ ] Verify custom competency only appears for this team
- [ ] Create same competency in different team
- [ ] Verify each team has its own version
- [ ] Edit competency in Team A
- [ ] Verify Team B's version is unaffected
- [ ] Delete competency in Team A
- [ ] Verify Team B's version remains

## Troubleshooting

### Competencies not showing for a role
1. Clear browser cache
2. Check that competencies have correct `role` value
3. Verify team_id is correct (NULL for base, team ID for custom)
4. Run verification query to check database

### Changes affecting other teams
1. Verify new competency has correct `team_id`
2. Check that competency ID includes both role and team
3. Verify RLS policies are correct
4. Run verification query to check isolation

### Role dropdown not showing
1. Clear browser cache and reload
2. Check browser console for errors
3. Verify ROLES constant is exported correctly
4. Check that getCompetenciesFromDB supports role parameter

## Performance Considerations

- Competencies are loaded per role (not all at once)
- Filter updates trigger fresh database queries
- Index on `(role, team_id)` improves query performance
- Consider pagination if team has many custom competencies

## Future Enhancements

- [ ] Search/filter by name within role
- [ ] Bulk import competencies from other teams
- [ ] Competency templates per industry/domain
- [ ] Versioning for competency changes
- [ ] Audit log of competency modifications
