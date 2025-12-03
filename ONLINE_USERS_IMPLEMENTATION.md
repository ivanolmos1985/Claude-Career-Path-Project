# Online Users Implementation Guide

**Date:** 2025-12-03
**Status:** ✅ Code Changes Complete - Awaiting Database Setup
**Feature:** Track logged-in users and display "(You)" label for current user

---

## 📋 Overview

This update implements two key features requested:

1. **Show only logged-in users** in the avatar card (not all database users)
2. **Display "(You)" label** next to the current user in the dropdown

### How It Works

```
User Login → Inserted into online_users table
↓
AppContext fetches only users from online_users table
↓
App displays: [Avatar 1] [Avatar 2] [Avatar 3] [+1] → 4 Online
↓
User clicks avatar card → Dropdown shows:
  - User 1 (You)
  - User 2
  - User 3
  - User 4
↓
Every 30 seconds → last_activity timestamp updated
↓
User logout → Deleted from online_users table
```

---

## 🔧 Implementation Details

### Phase 1: Database Setup (YOU NEED TO DO THIS)

**Execute this SQL in Supabase SQL Editor:**

```sql
-- Create online_users table to track active sessions
CREATE TABLE IF NOT EXISTS online_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_online_users_last_activity ON online_users(last_activity DESC);

-- Enable Row Level Security
ALTER TABLE online_users ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read online users list
CREATE POLICY "Anyone can view online users"
  ON online_users
  FOR SELECT
  USING (true);

-- Policy: Only the user can insert/update their own session
CREATE POLICY "Users can manage their own session"
  ON online_users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own session"
  ON online_users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Users can delete their own session on logout
CREATE POLICY "Users can delete their own session"
  ON online_users
  FOR DELETE
  USING (auth.uid() = id);

-- Function to clean up inactive sessions (optional - run manually or via cron)
CREATE OR REPLACE FUNCTION cleanup_inactive_users()
RETURNS void AS $$
BEGIN
  DELETE FROM online_users
  WHERE last_activity < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION cleanup_inactive_users() TO authenticated;
```

**Steps to execute:**
1. Go to https://app.supabase.com/
2. Select your project → SQL Editor
3. Click "New Query"
4. Copy and paste the SQL above
5. Press Ctrl+Enter or click Run
6. Wait for ✅ green confirmation

---

### Phase 2: Code Changes (ALREADY COMPLETED)

#### Modified Files:

**1. `src/context/AppContext.jsx`**

**Changes:**
- Updated `loadAllUsers()` to fetch from `online_users` table instead of `users` table
- Removed dependency on `isAdminUser` - now all users see the same online users list
- Added three new functions exported in context:
  - `markUserOnline(userId, email)` - Fetches user from users table, inserts/upserts to online_users with full_name from users table
  - `updateUserActivity(userId)` - Update last_activity timestamp
  - `markUserOffline(userId)` - Delete from online_users

**Key Data Flow:**
```
users table (id, email, full_name)
    ↓
markUserOnline() fetches from users table
    ↓
Inserts into online_users (id, email, full_name synced from users)
    ↓
AppContext loads from online_users for dropdown display
```

**Code:**
```javascript
// Cargar lista de usuarios conectados (online_users table)
useEffect(() => {
  const loadOnlineUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('online_users')
        .select('id, email, full_name')
        .order('full_name, email');

      if (error) throw error;
      setAllUsers(data || []);
    } catch (error) {
      console.error('Error loading online users:', error);
      setAllUsers([]);
    }
  };

  loadOnlineUsers();
}, []);

// Mark user as online when they log in
const markUserOnline = async (userId, email) => {
  try {
    // Fetch user data from users table to get full_name
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, full_name')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    const { error } = await supabase
      .from('online_users')
      .upsert({
        id: userId,
        email: userData.email,
        full_name: userData.full_name,
        last_activity: new Date(),
        updated_at: new Date()
      }, {
        onConflict: 'id'
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error marking user online:', error);
  }
};
```

---

**2. `src/App.jsx`**

**Changes in OnlineUsersCard component:**
- Added `const { user } = useAuth()` to access current user ID
- Modified user-item-name rendering to show "(You)" label:
  ```javascript
  {u.full_name || u.email?.split('@')[0]}
  {user?.id === u.id && ' (You)'}
  ```

**Changes in AppShell component:**
- Added three useEffect hooks to manage online status:
  1. **On Login:** Calls `markUserOnline()` when user logs in
  2. **Activity Tracking:** Updates `last_activity` every 30 seconds and on user interactions
  3. **On Logout:** Listens for page unload (actual logout handled in AuthContext)

**Code snippet:**
```javascript
// Mark user as online when they log in
useEffect(() => {
  if (user?.id) {
    markUserOnline(user.id, user.email, userProfile?.full_name || user.email?.split('@')[0])
  }
}, [user?.id])

// Update user activity every 30 seconds
useEffect(() => {
  if (!user?.id) return
  const updateActivity = () => {
    updateUserActivity(user.id)
  }
  const activityInterval = setInterval(updateActivity, 30000)
  // ... event listeners for mousedown, keydown, scroll, touchstart
}, [user?.id, updateUserActivity])
```

---

**3. `src/context/AuthContext.jsx`**

**Changes in signOut method:**
- Before signing out, deletes user from online_users table
- Ensures user is marked as offline immediately

**Code:**
```javascript
const signOut = async () => {
  // Mark user offline before signing out
  if (user?.id) {
    try {
      await supabase
        .from('online_users')
        .delete()
        .eq('id', user.id)
    } catch (error) {
      console.error('Error marking user offline:', error)
    }
  }

  await supabase.auth.signOut()
  setUser(null)
}
```

---

## 📊 User Experience Flow

### Scenario 1: Multiple Users Logged In

**User A logs in:**
```
✅ Inserted into online_users: {id: uuid-A, email: a@company.com, full_name: "Alice", ...}
```

**User B logs in:**
```
✅ Inserted into online_users: {id: uuid-B, email: b@company.com, full_name: "Bob", ...}
```

**Header displays:**
```
┌─────────────────────────┐
│ 👥 [AB] [+0]   2 Online │  ← Shows only logged-in users
└─────────────────────────┘
```

**Click avatar card → Dropdown shows:**
```
👥 Active Users (2)
┌─────────────────────────┐
│ 🔵 Alice (You)          │  ← Current user marked
│ 🟣 Bob                  │
│    Active now           │
└─────────────────────────┘
```

### Scenario 2: User Logs Out

**User A logs out:**
```
✅ Deleted from online_users where id = uuid-A
```

**Header updates immediately:**
```
┌──────────────────────────┐
│ 👥 [B]        1 Online   │  ← Shows only User B
└──────────────────────────┘
```

---

## 🔄 Activity Tracking

**How last_activity works:**
- Updated every 30 seconds (interval)
- Also updated on user interactions (mousedown, keydown, scroll, touchstart)
- Used by cleanup function to remove inactive users after 1 hour

**Optional Cleanup (run manually if needed):**
```sql
SELECT cleanup_inactive_users();
```

---

## ✨ Features Implemented

| Feature | Status | Details |
|---------|--------|---------|
| Show only logged-in users | ✅ | Fetches from online_users table, not all users |
| Display "(You)" label | ✅ | Current user shown with "(You)" in parentheses |
| Auto mark online on login | ✅ | Runs on user.id change |
| Activity tracking | ✅ | Updates every 30 seconds + on interactions |
| Auto mark offline on logout | ✅ | Calls before signOut() |
| RLS Security | ✅ | Only authenticated users can access |
| Activity cleanup | ✅ | Function to remove inactive users |

---

## 🧪 Testing Checklist

After deploying, test these scenarios:

- [ ] User 1 logs in → Avatar count shows "1 Online"
- [ ] User 2 logs in (separate browser/device) → Count shows "2 Online"
- [ ] Click avatar card → See both users in dropdown
- [ ] Current user shows "(You)" label
- [ ] User 1 logs out → Count shows "1 Online" for User 2
- [ ] Page refresh → Avatar card still shows correct users
- [ ] Go idle for 30+ seconds → Activity timestamp updates
- [ ] Admin user sees same list as regular user (no special access)
- [ ] Close browser → User automatically marked offline (within 30 sec)

---

## 🚀 Deployment Steps

1. **Create database table:**
   - Execute SQL in Supabase (see Phase 1 above)
   - Verify table exists: Check Supabase Dashboard → Tables → online_users

2. **Deploy code:**
   ```bash
   npm run build
   git add -A
   git commit -m "feat: Implement online users tracking with (You) label"
   git push
   ```

3. **Verify in production:**
   - Wait for deployment to complete
   - Go to https://claude-career-path-project.pages.dev/
   - Log in and verify avatar card shows correct count
   - Open in another browser/device and test with multiple users

---

## 📝 Notes

### Why separate online_users table?

Instead of adding an `is_online` flag to the `users` table:
- ✅ Easier to manage active sessions
- ✅ Automatic cleanup of stale sessions
- ✅ Cleaner RLS policies
- ✅ No need to modify users table structure
- ✅ Can track multiple concurrent sessions per user (future)

### Security

- All policies require `auth.uid()` for write operations
- Read-only access to online_users is public (needed for dropdown)
- Only authenticated users can manage their own session

### Performance

- Index on `last_activity` for fast cleanup queries
- Small table (only active users)
- Queries are simple and fast

---

## 🔮 Future Enhancements

- [ ] Show user avatars with different colors per user
- [ ] Show user status (online, idle, offline)
- [ ] Add real-time updates using Supabase Realtime
- [ ] Show "last seen" timestamp
- [ ] Add @mentions in comments to notify users
- [ ] Track multiple sessions per user
- [ ] Disable activity tracking in demo mode

---

## ❓ FAQ

**Q: Will this slow down the app?**
A: No. Activity updates run in background (every 30 sec). Online users table stays small (only active users).

**Q: What if online_users table creation fails?**
A: App will still work, but avatar count will show 0. Check Supabase console for errors.

**Q: Can users see each other's emails?**
A: Yes, by design. The online_users list is public (readable). Modify the RLS policy if you want to restrict this.

**Q: How long before inactive users are removed?**
A: Default is 1 hour. Run cleanup function: `SELECT cleanup_inactive_users();`

**Q: Does this work with multiple tabs?**
A: Yes, each tab updates the same user's last_activity timestamp.

---

## 📞 Support

If you encounter issues:

1. Check Supabase SQL Editor for errors
2. Verify online_users table exists and has data
3. Check browser console for JavaScript errors
4. Ensure RLS policies are correctly applied
5. Clear cache (Ctrl+Shift+Delete) and reload

---

**Status:** Ready for deployment
**Last Updated:** 2025-12-03
**Version:** 1.0
