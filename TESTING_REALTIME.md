# Testing Real-Time Functionality - Quick Guide

**Date:** 2025-12-03
**Duration:** ~5-10 minutes per test
**Requirements:** 2+ browsers, same or different devices

---

## 🚀 Quick Start

### Prerequisites
- [ ] App deployed and running (e.g., https://claude-career-path-project.pages.dev/)
- [ ] Account 1 created and ready
- [ ] Account 2 created and ready (optional, but recommended)
- [ ] 2+ browser windows or tabs open

---

## 📋 Test Cases

### Test 1: Cross-Tab Real-Time Sync (5 min)

**Objective:** Verify data syncs instantly between two browser tabs

**Steps:**

1. **Open two tabs with the app:**
   ```
   Tab 1: https://claude-career-path-project.pages.dev/
   Tab 2: https://claude-career-path-project.pages.dev/
   ```

2. **Log in on both tabs** with same account

3. **In Tab 1, create new team:**
   - Click "➕ Crear Nuevo Equipo"
   - Fill form: Client = "TestTeam123", Description = "Quick Test"
   - Click "Crear"

4. **Check Tab 2:**
   - ✅ **PASS**: Team appears in list within <1 second
   - ❌ **FAIL**: Need to refresh to see team

5. **In Tab 2, add member to new team:**
   - Click "Gestionar" on TestTeam123
   - Click "➕ Agregar Nuevo Miembro"
   - Fill: Name = "TestMember", Role = Developer, Level = Jr, Target = Mid, Email = test@test.com
   - Click "Agregar"

6. **Check Tab 1 (navigate to team if needed):**
   - ✅ **PASS**: Member appears within <1 second
   - ❌ **FAIL**: Need to refresh

---

### Test 2: Multi-User Collaboration (8 min)

**Objective:** Verify different users see each other's changes

**Requirements:** 2 different accounts

**Steps:**

1. **Browser 1 (User A) - Log in:**
   - Use account A (e.g., user1@test.com)
   - Navigate to Teams page

2. **Browser 2 (User B) - Log in:**
   - Use account B (e.g., user2@test.com)
   - Navigate to Teams page
   - **Check avatar card:** Should show "1 Online" (User A)

3. **Check User A's avatar card:**
   - ✅ **PASS**: Shows "2 Online" with User B's avatar
   - ❌ **FAIL**: Still shows "1 Online"

4. **User A creates team:**
   - Team name = "MultiUser Test"
   - Fill description
   - Click "Crear"

5. **Check User B's screen:**
   - **Note:** User B might not see the team if they manage different users
   - If admin: ✅ **PASS**: Team appears instantly
   - If regular user: This is expected (users only see their own teams)

6. **Both users create teams in their own account:**
   - User A: Create "Team A"
   - User B: Create "Team B"
   - ✅ **PASS**: Each user's dashboard updates with their team only

---

### Test 3: Online Status Updates (5 min)

**Objective:** Verify avatar card updates as users log in/out

**Steps:**

1. **User A logged in** - Avatar shows "1 Online"

2. **User B logs in (different browser):**
   - ✅ **PASS**: Avatar shows "2 Online" within <1 second
   - ❌ **FAIL**: Shows "1 Online" until refresh

3. **Check dropdown with online users:**
   - User A sees User B listed
   - User B sees User A listed with "(You)" label

4. **User B logs out:**
   - ✅ **PASS**: Avatar shows "1 Online" within <1 second
   - User A's avatar updates automatically

---

### Test 4: Member CRUD Real-Time (7 min)

**Objective:** Verify member operations sync across tabs/users

**Steps:**

1. **Tab 1: Create Team "CRUD Test"**

2. **Tab 2: Refresh and navigate to same team**
   - ✅ **PASS**: Team appears without refresh needed

3. **Tab 1: Add Member "Alice"**
   - Open modal, fill form, click "Agregar"
   - ✅ **PASS**: Member appears in Tab 1 immediately

4. **Check Tab 2:**
   - ✅ **PASS**: Alice appears within <1 second
   - ❌ **FAIL**: Doesn't appear until Tab 2 refresh

5. **Tab 2: Edit Alice's level (jr → mid)**
   - Click member card (if edit available) or check level display
   - Update if possible
   - ✅ **PASS**: Change appears in Tab 1 within <1 second

6. **Tab 1: Delete Alice**
   - Click "🗑️ Eliminar"
   - Confirm in modal
   - ✅ **PASS**: Alice disappears from Tab 1 immediately

7. **Check Tab 2:**
   - ✅ **PASS**: Alice disappears within <1 second
   - ❌ **FAIL**: Alice still shows until refresh

---

### Test 5: Avatar Card Real-Time (5 min)

**Objective:** Verify avatar card updates with online users

**Steps:**

1. **User A logged in:**
   - Avatar card shows: 👥 [A] [+0] 1 Online

2. **User B logs in (different device/browser):**
   - Wait 1-2 seconds
   - ✅ **PASS**: User A sees: 👥 [A][B] [+0] 2 Online
   - ❌ **FAIL**: Still shows 1 Online

3. **Click avatar card dropdown:**
   - See both users listed
   - Current user marked with "(You)"
   - ✅ **PASS**: User B appears in dropdown
   - ❌ **FAIL**: Need to refresh to see User B

4. **User C logs in (3rd user):**
   - Avatar shows: 👥 [A][B] [+1] 3 Online
   - Dropdown shows all 3 users
   - ✅ **PASS**: Works seamlessly

5. **User B logs out:**
   - Avatar updates: 👥 [A][C] [+0] 2 Online
   - ✅ **PASS**: Within <1 second
   - ❌ **FAIL**: Shows wrong count

---

## ✅ Test Results Matrix

| Test | Scenario | Expected | Actual | Pass | Notes |
|------|----------|----------|--------|------|-------|
| 1 | Create team in Tab 1 | Appears in Tab 2 <1s | | ✓ | |
| 1 | Add member in Tab 2 | Appears in Tab 1 <1s | | ✓ | |
| 2 | User A creates team | User B sees if admin | | ✓ | |
| 2 | User A & B have separate dashboards | Each see own teams | | ✓ | |
| 3 | User B logs in | Avatar shows 2 Online | | ✓ | |
| 3 | User B logs out | Avatar shows 1 Online | | ✓ | |
| 4 | Add member cross-tab | Syncs <1s | | ✓ | |
| 4 | Edit member cross-tab | Syncs <1s | | ✓ | |
| 4 | Delete member cross-tab | Syncs <1s | | ✓ | |
| 5 | Multiple users online | Avatar updates <1s | | ✓ | |
| 5 | User logs out | Avatar updates <1s | | ✓ | |

---

## 🐛 Troubleshooting

### Issue: Real-time updates not working

**Check:**
1. Is Supabase Realtime enabled? (Check Supabase dashboard → Tables)
2. Are you on the same project?
3. Do you have internet connection? (Realtime needs active connection)
4. Open browser console: Check for errors
5. Try hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)

**Solution:**
```
1. Check browser console for errors
2. Verify Realtime enabled in Supabase
3. Try incognito/private window
4. Test on different browser
5. Check network tab in DevTools
```

### Issue: Data appears but with delay >5 seconds

**Likely causes:**
- Slow internet connection
- Supabase on free plan (may be slower)
- Browser tab is inactive/throttled

**Solution:**
```
1. Test on wired connection if possible
2. Check Supabase status page
3. Use active browser tab
4. Close unnecessary tabs/extensions
```

### Issue: Changes not syncing at all

**Debug steps:**

1. **Check console for errors:**
   ```javascript
   // Open DevTools → Console
   // Look for Realtime errors
   ```

2. **Verify subscriptions active:**
   ```javascript
   // In browser console:
   console.log(supabase.getChannels())
   // Should see: teams:user_id=eq.xxx, members:all, online_users:all, users:all
   ```

3. **Check Supabase logs:**
   - Go to Supabase Dashboard
   - View Logs → Realtime
   - Look for connection issues

4. **Try manual refresh:**
   - Press F5 to reload page
   - Data should sync

---

## 📊 Performance Metrics

### Expected Latency
- **Optimal conditions:** <100ms
- **Good conditions:** 100-500ms
- **Acceptable:** 500-2000ms
- **Poor:** >2000ms (investigate)

### Monitor Performance
```javascript
// In browser console:
const start = Date.now()
// Make change in another tab
// Watch for update
const latency = Date.now() - start
console.log('Realtime latency:', latency, 'ms')
```

---

## 🎯 Success Criteria

All tests pass when:

- ✅ Team creates instantly across tabs
- ✅ Members sync <1 second
- ✅ Online users update <1 second
- ✅ No refresh needed for updates
- ✅ Multi-user scenarios work
- ✅ Avatar card reflects all logged-in users
- ✅ Member CRUD operations sync
- ✅ No console errors

---

## 📝 Test Report Template

```
Date: 2025-12-03
Tester: [Your Name]
Environment: Production / Staging
Browser: Chrome / Firefox / Safari / Edge

Test Results:
- Cross-tab sync: ✅ / ❌
- Multi-user sync: ✅ / ❌
- Avatar updates: ✅ / ❌
- Member CRUD: ✅ / ❌
- Overall latency: [ms]

Issues Found:
[List any issues]

Notes:
[Any additional observations]
```

---

## 🔗 Resources

- [Supabase Realtime Docs](https://supabase.com/docs/guides/realtime/overview)
- [REALTIME_IMPLEMENTATION.md](./REALTIME_IMPLEMENTATION.md)
- [AppContext.jsx](src/context/AppContext.jsx)

---

**Happy Testing! 🚀**
