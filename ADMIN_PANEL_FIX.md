# Administrator Panel Not Showing in Production - Fix Guide

## Problem
The Administrator Panel card is visible in local development but not appearing in the production environment.

## Root Cause
Your user account ID is not registered in the `admin_users` table in your Supabase production database. The application checks this table to determine if you have admin privileges.

## Solution

### Step 1: Get Your User ID
1. Open your Career Path application in **development mode** (`npm run dev`)
2. Go to the Dashboard page
3. Scroll to the bottom of the page - you'll see a debug info panel (only visible in development)
4. Copy the **User ID** value from the debug panel

**Example debug info panel:**
```
User ID: a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6
Is Admin: false
Email: your.email@example.com
```

### Step 2: Add Your User ID to the admin_users Table
1. Log in to your [Supabase dashboard](https://supabase.com/dashboard)
2. Select your **Career Path** project
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste this SQL command, replacing `YOUR_USER_ID_HERE` with the User ID from Step 1:

```sql
INSERT INTO admin_users (id, created_at)
VALUES ('YOUR_USER_ID_HERE', now());
```

**Example:**
```sql
INSERT INTO admin_users (id, created_at)
VALUES ('a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6', now());
```

6. Click **Run** to execute the query

### Step 3: Verify the Fix
1. Refresh your production application
2. Go to the Dashboard page
3. The **Administrator Panel** card should now appear at the bottom with the purple gradient background and "Manage Users & Competencies" button

## Technical Details

### How Admin Check Works
The application checks if your user ID exists in the `admin_users` table:

```javascript
// From AppContext.jsx (lines 30-42)
const checkIfAdmin = async () => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .single();

    setIsAdminUser(!error && data !== null);
  } catch (error) {
    setIsAdminUser(false);
  }
};
```

### Where Admin Panel Appears
The Administrator Panel is in [DashboardPage.jsx:218-251](src/pages/DashboardPage.jsx#L218-L251) and renders conditionally:

```jsx
{isAdminUser && (
  <div style={{...}}>
    {/* Administrator Panel */}
  </div>
)}
```

## What the Administrator Panel Allows
Once enabled, the Administrator Panel gives you access to:
- **Manage Users & Competencies** button that navigates to the Teams management page
- Ability to create, edit, and delete teams
- Ability to create, edit, and delete team members
- Ability to manage competencies for each team

## Troubleshooting

### Still not showing after adding to admin_users table?
1. **Hard refresh** the production page (Ctrl+F5 or Cmd+Shift+R)
2. **Clear browser cache** and reload
3. **Log out and log back in** to force the app to re-check admin status
4. Check that the SQL insert completed successfully (no errors in Supabase SQL Editor)

### Need to add multiple admins?
Repeat Step 2 for each user:

```sql
INSERT INTO admin_users (id, created_at)
VALUES ('user1-id-here', now());

INSERT INTO admin_users (id, created_at)
VALUES ('user2-id-here', now());

INSERT INTO admin_users (id, created_at)
VALUES ('user3-id-here', now());
```

### Want to remove admin access?
To revoke admin access from a user, delete their entry from admin_users:

```sql
DELETE FROM admin_users WHERE id = 'user-id-here';
```

## Debug Info Panel
The debug panel at the bottom of the Dashboard (only visible in development mode) shows:
- **User ID**: Your unique identifier in the system
- **Is Admin**: Current admin status (should change to `true` after fix)
- **Email**: Your login email

This panel helps verify that the admin check is working correctly.

---

**Need help?** Check that:
- ✅ You copied the User ID correctly from the debug panel
- ✅ You replaced `YOUR_USER_ID_HERE` in the SQL query with your actual User ID
- ✅ The SQL query executed without errors in Supabase
- ✅ You refreshed/re-logged in after the database update
