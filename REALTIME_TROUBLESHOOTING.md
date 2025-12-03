# Real-Time Troubleshooting Guide

**Date:** 2025-12-03
**Status:** Diagnostic & Resolution Guide
**Issue:** Real-Time updates not working

---

## 🔴 Problem: Real-Time Not Working

If you're not seeing real-time updates (counter, teams, members not updating):

### Quick Checklist (5 min)

- [ ] Check browser console for errors (F12 → Console)
- [ ] Verify Realtime is enabled in Supabase
- [ ] Test WebSocket connection (F12 → Network → WS)
- [ ] Try refreshing the page (Ctrl+F5)
- [ ] Test in different browser
- [ ] Check your internet connection

---

## 🔍 Diagnosis Steps

### Step 1: Check Browser Console

**How to:**
1. Open app in browser
2. Press `F12` (or right-click → Inspect)
3. Go to **Console** tab
4. Look for red error messages

**What to look for:**
```
❌ ERROR: Realtime subscribe failed
❌ WebSocket connection failed
❌ Permission denied on online_users
❌ CORS error
```

**If you see errors:**
→ Note the exact error message and check "Solution" section below

### Step 2: Check Supabase Dashboard

**Go to:**
1. https://app.supabase.com/
2. Select your project
3. Go to **Settings** → **Database**
4. Check **Realtime** section

**What to verify:**
```
✅ Realtime is "ON" (not disabled)
✅ Tables have Realtime enabled:
   - online_users
   - teams
   - members
   - users
```

**If Realtime is OFF:**
→ Click toggle to enable it for each table

### Step 3: Check Row Level Security (RLS)

**Go to:**
1. Supabase Dashboard → SQL Editor
2. Run this query:

```sql
SELECT
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('online_users', 'teams', 'members', 'users');
```

**Expected Result:**
```
tablename    | rowsecurity
─────────────┼────────────
online_users | t (true)
teams        | t (true)
members      | t (true)
users        | t (true)
```

**If rowsecurity is 'f' (false):**
→ RLS is disabled. Enable it:

```sql
ALTER TABLE online_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

### Step 4: Check RLS Policies

**Go to:**
1. Supabase Dashboard
2. Select each table
3. Click **RLS** section
4. Verify policies exist

**For `online_users` table, you should have:**
```
✅ "Anyone can view online users" (SELECT)
✅ "Users can manage their own session" (INSERT)
✅ "Users can update their own session" (UPDATE)
✅ "Users can delete their own session" (DELETE)
```

**If policies are missing:**
→ Run SQL to create them (see "Creating RLS Policies" section)

### Step 5: Test WebSocket Connection

**In Browser Console, run:**

```javascript
// Check active WebSocket connections
console.log(supabase.getChannels())

// Should output something like:
// [
//   RealtimeChannel { topic: 'online_users:all', state: 'joined' },
//   RealtimeChannel { topic: 'members:all', state: 'joined' },
//   RealtimeChannel { topic: 'teams:user_id=eq.xxx', state: 'joined' }
// ]
```

**If channels show:**
- `state: 'joined'` → ✅ Connected, should work
- `state: 'joining'` → ⏳ Still connecting, wait a moment
- `state: 'closed'` or empty array → ❌ Not connected, see "Solutions" below

---

## 💡 Common Issues & Solutions

### Issue 1: "Permission denied" Error

**Error Message:**
```
PostgreSQL error: permission denied for table online_users
```

**Cause:** RLS policies not allowing user access

**Solution:**
1. Go to Supabase SQL Editor
2. Run:
```sql
-- Check if RLS is enabled
SELECT rowsecurity FROM pg_tables
WHERE tablename = 'online_users';

-- If 't' (true), RLS is enabled but policies might be wrong
-- Check policies
SELECT policyname, qual, with_check
FROM pg_policies
WHERE tablename = 'online_users';

-- Create public read policy for online_users
CREATE POLICY "Anyone can view online users"
ON online_users
FOR SELECT
USING (true);
```

### Issue 2: "WebSocket closed" Error

**Error Message:**
```
WebSocket is closed before the connection is established
```

**Cause:** Network issue or Realtime server problem

**Solution:**
1. Check internet connection
2. Try different network (WiFi vs mobile)
3. Check if Supabase services are running:
   - Go to https://status.supabase.com/
   - Verify no outages
4. If still failing, try:
```javascript
// In browser console
await new Promise(r => setTimeout(r, 2000))
// Then refresh the page
```

### Issue 3: "Channel already exists" Error

**Error Message:**
```
Channel online_users:all is already subscribed
```

**Cause:** Multiple subscriptions to same channel

**Solution:** Restart the app (hard refresh)
```
Ctrl + Shift + R (Windows)
or
Cmd + Shift + R (Mac)
```

### Issue 4: Updates Not Showing But No Errors

**Symptom:** No errors in console, but data doesn't update in real-time

**Cause:** RLS policy too restrictive

**Solution:**
1. Check RLS policies allow your user:
```sql
-- Example: Check if user can read online_users
SELECT * FROM online_users;
-- If empty result with no error → policy is blocking you

-- Fix: Make online_users readable by everyone
DROP POLICY "Anyone can view online users" ON online_users;

CREATE POLICY "Anyone can view online users"
ON online_users
FOR SELECT
USING (true);  -- Allow all authenticated users to read
```

### Issue 5: Counter Not Updating When User Logs In/Out

**Symptom:** "1 Online" doesn't change to "2 Online"

**Cause:** online_users table not getting INSERT when user logs in

**Solution:**
1. Check that `markUserOnline()` is being called
2. In browser console, when logging in, verify:
```javascript
// After login, you should see user in online_users
// Check it manually:
const { data } = await supabase
  .from('online_users')
  .select('*')

console.log('Online users:', data)
// Should show your user after login
```

### Issue 6: Realtime Enabled in Settings but Still Not Working

**Cause:** Realtime enabled on project but not on specific tables

**Solution:**
1. Go to Supabase Dashboard
2. Select project
3. Go to **Settings** → **Database** → **Realtime**
4. Look for table list
5. Toggle ON for each table you need:
   - ✅ online_users
   - ✅ teams
   - ✅ members
   - ✅ users

---

## 🧪 Testing Real-Time

### Test 1: Manual Database Insert

Use this to verify Realtime is working:

1. Go to Supabase Dashboard
2. Click "Teams" table
3. Click **"Insert Row"** button
4. Add a test row

**Expected:** If Realtime works, you'll see notification in app

### Test 2: SQL Insert Test

1. Go to Supabase SQL Editor
2. Run:
```sql
-- Test insert to trigger realtime event
INSERT INTO online_users (id, email, full_name)
VALUES ('test-id-123', 'test@example.com', 'Test User');

-- Check it was inserted
SELECT * FROM online_users WHERE id = 'test-id-123';

-- Clean up
DELETE FROM online_users WHERE id = 'test-id-123';
```

**In your app**, you should see updates appear instantly

### Test 3: Monitor Real-Time Events

In browser console:

```javascript
// Use the diagnostics utility
import { diagnoseRealtime } from './src/utils/realtimeDiagnostics.js'

// Run diagnostic
const results = await diagnoseRealtime(supabase)
console.log(results)

// Monitor events
import { monitorRealtimeEvents } from './src/utils/realtimeDiagnostics.js'
const monitor = monitorRealtimeEvents(supabase)
// Now make changes and watch console for events
```

---

## 🛠️ Creating RLS Policies (If Missing)

Run this SQL in Supabase Editor if policies don't exist:

```sql
-- For online_users table
CREATE POLICY "Anyone can view online users"
ON online_users
FOR SELECT
USING (true);

CREATE POLICY "Users can manage their own session"
ON online_users
FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own session"
ON online_users
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own session"
ON online_users
FOR DELETE
USING (auth.uid() = id);

-- For teams table
CREATE POLICY "Users can see their own teams"
ON teams
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create teams"
ON teams
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own teams"
ON teams
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own teams"
ON teams
FOR DELETE
USING (auth.uid() = user_id);

-- For members table
CREATE POLICY "Users can see members of their teams"
ON members
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM teams
    WHERE teams.id = members.team_id
    AND teams.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create members in their teams"
ON members
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM teams
    WHERE teams.id = members.team_id
    AND teams.user_id = auth.uid()
  )
);

-- For users table (read-only for most)
CREATE POLICY "Users can see all users"
ON users
FOR SELECT
USING (true);

CREATE POLICY "Users can update their own profile"
ON users
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
```

---

## 📋 Verification Checklist

After applying fixes, verify everything works:

- [ ] Realtime enabled in Supabase project settings
- [ ] Realtime enabled on each table:
  - [ ] online_users
  - [ ] teams
  - [ ] members
  - [ ] users
- [ ] RLS enabled on all tables
- [ ] RLS policies exist and are correct
- [ ] No errors in browser console
- [ ] WebSocket connection shows "joined" state
- [ ] User appears in online_users table when logged in
- [ ] Counter updates when you log in/out in different tabs
- [ ] Teams update when created in one tab
- [ ] Members update when added in one tab

---

## 🆘 Still Not Working?

### Gather Information

1. **Error message** (exact text from console)
2. **Browser** (Chrome, Firefox, Safari, Edge)
3. **Supabase status** (Check https://status.supabase.com/)
4. **Network tab** (Any failed requests?)

### Debug Steps

1. Run diagnostics:
```javascript
import { diagnoseRealtime } from './src/utils/realtimeDiagnostics.js'
const results = await diagnoseRealtime(supabase)
// Check console output
```

2. Check RLS policies:
```sql
-- In Supabase SQL Editor
SELECT tablename, policyname, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename;
```

3. Monitor events:
```javascript
import { monitorRealtimeEvents } from './src/utils/realtimeDiagnostics.js'
const monitor = monitorRealtimeEvents(supabase)
// Make a change and watch console
```

### If Still Failing

Try the nuclear option - disable and re-enable Realtime:

1. Go to Supabase Settings → Database → Realtime
2. Toggle OFF all tables
3. Wait 30 seconds
4. Toggle ON all tables
5. Wait 1 minute
6. Refresh app

---

## 📞 Support Resources

- **Supabase Status:** https://status.supabase.com/
- **Supabase Docs:** https://supabase.com/docs/guides/realtime/overview
- **Realtime API:** https://supabase.com/docs/reference/javascript/realtime-client
- **RLS Guide:** https://supabase.com/docs/guides/auth/row-level-security

---

## 📝 Notes

- Realtime is **near real-time** (usually <1s, can be up to 5s on slow networks)
- Requires **active WebSocket connection** (not available in some corporate networks)
- **RLS policies required** - Realtime respects database permissions
- **Authenticated users only** - Anonymous access has limitations

---

**Last Updated:** 2025-12-03
**Status:** Diagnostic Guide Complete
