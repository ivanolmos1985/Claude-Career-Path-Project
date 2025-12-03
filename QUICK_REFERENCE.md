# Career Path System - Quick Reference Guide

## 🚀 Live Application

**URL:** https://claude-career-path-project.pages.dev/

Open this link in your browser to access the application.

---

## 👤 Test Credentials

### Option 1: Create New Account
1. Go to Register page
2. Enter email and password (min 6 characters)
3. Click "Crear una cuenta"
4. You'll be redirected to login
5. Log in with your new account

### Option 2: Use Test Account (if provided)
- **Email:** [Ask project owner]
- **Password:** [Ask project owner]

---

## 🎯 Quick User Workflow

### Step 1: Create a Team
1. Click **"🏢 Equipos"** in sidebar
2. Click **"➕ Crear Nuevo Equipo"**
3. Enter:
   - **Client:** Project or client name
   - **Description:** Brief description
4. Click **"Crear Equipo"**

### Step 2: Add Team Members
1. Click **"👥 Miembros"** in sidebar
2. Select team from current team card (if multiple teams exist)
3. Click **"➕ Agregar Nuevo Miembro"**
4. Fill in:
   - **Nombre completo:** Member's full name
   - **Rol:** Developer, QA, Product Owner, Scrum Master, UX/UI, Delivery Manager
   - **Nivel Actual:** Junior, Mid, Senior
   - **Nivel Objetivo:** Mid, Senior
   - **Email:** Member's email
5. Click **"➕ Agregar Miembro"**

### Step 3: Evaluate Competencies
1. Click **"📊 Miembros"** in sidebar
2. Find member and click **"📊 Evaluar"**
3. Select quarter: **Q1, Q2, Q3, Q4**
4. For each competency:
   - Rate 1-5 (1=needs improvement, 5=excellent)
   - Add evidence/comments in textarea
5. Click **"💾 Guardar y Continuar"**

### Step 4: View Progress
1. You'll automatically go to **"📈 Progreso de Evaluación"**
2. See progress bars for each quarter
3. Colors indicate performance:
   - 🟢 **Green:** ≥70% - Strong
   - 🟡 **Yellow:** ≥40% - Acceptable
   - 🔴 **Red:** <40% - Below threshold
4. Click **"Ver Decisión →"** to see promotion decision

### Step 5: View Promotion Decision
1. See **"✅ Decisión de Promoción"** page
2. Status shows:
   - 🟢 **PROMOCIÓN APROBADA** - Approved
   - 🟡 **PROMOCIÓN PENDIENTE** - Pending (close to threshold)
   - 🔴 **NO APROBADA** - Not approved
3. View metrics:
   - **Score Q4:** Final quarter score
   - **Promedio Anual:** Average across all quarters
   - **Umbral Requerido:** Required threshold
4. Click **"📄 Exportar Reporte en PDF"** to download PDF report

---

## 🔐 Admin Features (If Admin User)

### View Another User's Data
1. On **"🏢 Equipos"** page, see **"👤 Modo Admin"** selector
2. Click dropdown to select a user
3. View that user's teams and data
4. All navigation operates within selected user's context

**Note:** Admin can switch users anytime to view different perspectives.

---

## 📱 UI Layout

```
┌─────────────────────────────────────────┐
│  [Logo] Career Path System  👤 User  │
├──────────┬──────────────────────────────┤
│ 🏢 EQUIPOS                              │
│ 👥 MIEMBROS        [Main Content Area]  │
│ 📊 EVALUACIÓN                           │
│ 📈 PROGRESO                             │
│ ✅ DECISIÓN                             │
│                                         │
│ 🚪 LOGOUT                               │
└──────────┴──────────────────────────────┘
```

---

## 🎨 Color Coding

| Color | Meaning |
|-------|---------|
| 🔵 **Blue** (#0066ff) | Primary actions, highlights |
| 🟦 **Dark Blue** (#003366) | Headings, major titles |
| 🟢 **Green** (#10b981) | Success, approved status, high performance (≥70%) |
| 🟡 **Amber** (#f59e0b) | Warning, pending status, acceptable performance (≥40%) |
| 🔴 **Red** (#dc3545) | Danger, failure, low performance (<40%) |
| ⚪ **Gray** (#6b7280) | Secondary text, descriptions |

---

## 💾 PDF Report Contents

When you click **"📄 Exportar Reporte en PDF"**, you get:

1. **Header:** Reporte de Evaluación
2. **Employee Info:** Name, Role, Current Level, Target Level
3. **Team Info:** Client, Description
4. **Results:** Q4 Score, Annual Average, Required Threshold
5. **Decision:** Promotion status (Aprobada/Pendiente/No Aprobada)
6. **Table:** Detailed breakdown by quarter (Q1-Q4) showing each competency score

---

## ⚙️ Settings & Configuration

### Change Password
- Use Supabase auth (handled by system)
- Contact admin if needed

### View Your Profile
- Currently shown in header: "👤 [Your email]"

### Switch Teams
- Use dropdown in MembersPage when multiple teams exist

### Change Language
- Currently Spanish interface
- Contact developers for other language support

---

## 🔗 Navigation Map

```
Login
  ↓
Teams Page
  ├→ Create Team
  ├→ Delete Team
  └→ Go to Members
     ├→ Add Member
     ├→ Delete Member
     └→ Evaluate Member
        ├→ Rate Competencies (1-5)
        ├→ Add Evidence
        └→ Go to Progress
           ├→ View Progress Bars
           └→ Go to Decision
              └→ Export PDF
```

---

## 🐛 Common Issues & Solutions

### Q: The app says "Selecciona un equipo"
**A:** You need to create a team first. Go to Teams page and create one.

### Q: I can't see other users' data
**A:** You might not be an admin. Admin users see a selector in Teams page.

### Q: PDF export didn't work
**A:** Try refreshing the page. If still broken, check browser console (F12) for errors.

### Q: Changes aren't showing
**A:** Hard refresh browser (Ctrl+Shift+R) to clear cache.

### Q: I'm logged out
**A:** Session may have expired. Log in again.

---

## 📊 Competency Scales

**1-5 Rating Scale:**
- **1:** Needs Significant Improvement
- **2:** Below Expected Level
- **3:** Meets Basic Expectations
- **4:** Exceeds Expectations
- **5:** Exemplary Performance

**Promotion Threshold:**
- **Junior → Mid:** 70% of max score
- **Mid → Senior:** 80% of max score

---

## 🌐 System Requirements

- **Browser:** Chrome, Firefox, Safari, Edge (any modern browser)
- **Internet:** Required (cloud-based application)
- **Resolution:** Works on mobile and desktop
- **Plugins:** None required (PDF generation is built-in)

---

## 🎓 Role-Specific Competencies

### Developer
- Code Quality
- Problem Solving
- Testing Practices
- Performance Optimization
- System Design
- Knowledge Sharing
- Collaboration

### QA
- Test Case Design
- Bug Detection
- Test Automation
- Documentation
- Communication
- Process Improvement
- Attention to Detail

### Product Owner
- Backlog Management
- Stakeholder Communication
- Product Vision
- Prioritization
- Market Understanding
- User Research
- Decision Making

### Scrum Master
- Team Facilitation
- Process Improvement
- Impediment Resolution
- Coaching
- Servant Leadership
- Communication
- Risk Management

### UX/UI Designer
- Wireframing
- Visual Design
- User Research
- Prototyping
- Usability Testing
- Design Systems
- Accessibility

### Delivery Manager
- Project Planning
- Resource Management
- Risk Management
- Stakeholder Management
- Team Leadership
- Communication
- Process Optimization

---

## 📞 Support & Feedback

### Report Issues
- GitHub Issues: https://github.com/ivanolmos1985/Claude-Career-Path-Project/issues

### Feature Requests
- GitHub Discussions or Issues

### Contact
- Project Owner: [Your contact info]

---

## 📚 Detailed Documentation

For more information, see:
- **PROJECT_STATUS_SUMMARY.md** - Complete project overview
- **CLOUDFLARE_SUBDOMAIN_FIX.md** - Deployment info
- **ADMIN_SYSTEM_SUMMARY.md** - Admin features
- **UI_REDESIGN_COMPLETE.md** - Design details
- **SUPABASE_DATABASE_SETUP.md** - Database info

---

## ✨ Tips & Tricks

### Keyboard Shortcuts
- **F12** - Open browser developer tools (for debugging)
- **Ctrl+Shift+R** - Hard refresh to clear cache
- **Tab** - Navigate between form fields

### Best Practices
- ✅ Save evaluations after each quarter
- ✅ Add detailed evidence for each rating
- ✅ Review progress before making promotion decisions
- ✅ Export PDF reports for records

### Quick Actions
- **Fastest way to evaluate:** Select quarter → Rate all → Add evidence → Save
- **View PDF quickly:** Go to Decision page → Click Export
- **Switch teams:** Go to Members page → Select from team card

---

**Quick Reference Created:** 2025-12-03
**Version:** 1.0
**Last Updated:** 2025-12-03

👉 **Start Using:** https://claude-career-path-project.pages.dev/
