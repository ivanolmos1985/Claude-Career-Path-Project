# 🎨 Career Path System - Design Cheat Sheet
## Quick Reference for Designers & Developers

---

## 🎯 COLOR PALETTE AT A GLANCE

### Primary
```
#6366F1 - INDIGO (Main CTA, Primary actions)
#4F46E5 - Hover/Focus state
#3730A3 - Pressed state
```

### Accent
```
#A855F7 - VIOLET (Highlights, premium elements)
#9333EA - Hover state
#7E22CE - Pressed state
```

### Status Colors
```
#10B981 - SUCCESS (Green) - Approved, completed
#F59E0B - WARNING (Amber) - Pending, caution
#EF4444 - ERROR (Red) - Failed, errors
```

### Neutral
```
#FFFFFF - White (0)
#FAFAFA - Very light background (50)
#F3F4F6 - Light background (100)
#E5E7EB - Border color (200)
#6B7280 - Secondary text (500)
#374151 - Body text (700)
#111827 - Heading text (900)
```

---

## 📝 TYPOGRAPHY

### Font Stack
```css
font-family: 'Sora', 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Sizes
| Level | Size | Weight | Use Case |
|-------|------|--------|----------|
| Display | 40px | 700 | Hero titles |
| H1 | 32px | 700 | Page titles |
| H2 | 24px | 600 | Section headers |
| H3 | 20px | 600 | Subsections |
| H4 | 16px | 600 | Component titles |
| Body | 15px | 400 | Standard text |
| Small | 14px | 400 | Secondary text |
| Caption | 12px | 500 | Labels |
| Code | 13px | 400 | Code blocks |

---

## 📏 SPACING SCALE

```
4px  - xs  (Component internals)
8px  - sm  (Small gaps)
12px - md  (Default spacing)
16px - lg  (Standard sections)
24px - xl  (Major sections)
32px - xxl (Page margins)
48px - xxxl (Hero sections)
```

---

## 🎭 BORDER RADIUS

```
4px   - xs (Sharp, subtle)
6px   - sm (Forms, small elements)
8px   - md (Buttons, inputs)
12px  - lg (Cards, containers)
16px  - xl (Modals, pills)
9999px - full (Circles, fully rounded)
```

---

## ✨ SHADOWS

```
xs: 0 1px 2px           (Subtle)
sm: 0 1px 3px           (Light)
md: 0 4px 6px           (Medium)
lg: 0 10px 15px         (Elevated)
xl: 0 20px 25px         (Modal-level)
```

---

## ⚡ ANIMATIONS

### Timing
```
150ms - fast (Quick feedback)
200ms - normal (Default)
300ms - slow (Entrance animations)
```

### Common Patterns
```css
/* Button hover */
transition: all 150ms ease-in-out;
transform: translateY(-2px);

/* Color change */
transition: color 200ms ease-in-out;

/* Scale */
transition: transform 200ms ease-in-out;
transform: scale(1.02);
```

---

## 🎨 COMPONENT QUICK SPECS

### Buttons
- Radius: 8px
- Padding: 12px 20px (md)
- Height: 40px (md)
- Transitions: 150-200ms
- Hover: Scale 1.02 + translateY(-2px)

### Cards
- Radius: 12px
- Padding: 24px
- Shadow: xs (default) → md (hover)
- Border: 1px #E5E7EB

### Inputs
- Height: 44px (touch-friendly)
- Radius: 8px
- Focus: 3px indigo ring
- Padding: 12px 14px

### Modals
- Radius: 16px
- Backdrop: 50% #000 opacity
- Shadow: xl
- Width: 480px (md)

### Tables
- Radius: 12px
- Row height: 44px
- Padding: 16px per cell
- Hover: indigo-50 background

---

## 📱 RESPONSIVE BREAKPOINTS

```
320px  - xs (Small phones)
640px  - sm (Large phones)
768px  - md (Tablets) ← MAJOR CHANGE
1024px - lg (Small desktop)
1280px - xl (Desktop)
1536px - 2xl (Large desktop)
```

### Mobile Strategy
```
< 768px:
├─ Sidebar: Hamburger menu
├─ Header: Simplified
├─ Grids: 1 column
└─ Modals: Full screen

768px - 1024px:
├─ Sidebar: Visible
├─ Grids: 2 columns
└─ Modals: Centered

1024px+:
├─ Full layout
├─ Grids: 3+ columns
└─ Dual panels possible
```

---

## 🎯 COLOR USAGE RULES

### Indigo (#6366F1)
✅ Primary CTA buttons
✅ Links
✅ Active states
✅ Primary accents
❌ Not for warning/error

### Violet (#A855F7)
✅ Premium badges
✅ Special highlights
✅ Important features
❌ Not for standard actions

### Green (#10B981)
✅ Success states
✅ Approved status
✅ Completed items
❌ Not for warnings

### Amber (#F59E0B)
✅ Pending states
✅ Caution indicators
✅ Attention needed
❌ Not for errors

### Red (#EF4444)
✅ Errors & failures
✅ Destructive actions
✅ Critical alerts
❌ Not for warnings

---

## 🎨 GRADIENT IDEAS

### Modern Gradient (Premium)
```css
background: linear-gradient(135deg, #4F46E5 0%, #A855F7 100%);
/* Indigo → Violet */
```

### Success Gradient
```css
background: linear-gradient(135deg, #10B981 0%, #059669 100%);
/* Light green → Dark green */
```

### Warning Gradient
```css
background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
/* Light amber → Dark amber */
```

---

## 💡 COMMON PATTERNS

### Button Group
```html
<div style="gap: 12px;">
  <button>Primary Action</button>
  <button>Secondary Action</button>
</div>
```

### Card with Action
```html
<div style="border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px;">
  <h3>Title</h3>
  <p>Content</p>
  <button>Action</button>
</div>
```

### Status Badge
```html
<span style="
  background: #DCFCE7;
  color: #047857;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
">
  Active ✓
</span>
```

### Form Field
```html
<div>
  <label style="font-size: 12px; font-weight: 600;">Email</label>
  <input style="
    height: 44px;
    padding: 12px 14px;
    border-radius: 8px;
    border: 1px solid #E5E7EB;
  " />
</div>
```

---

## 🔍 CSS VARIABLES

Use these in your styles for consistency:

```css
/* Colors */
--color-primary-500: #6366F1
--color-accent-500: #A855F7
--color-success-500: #10B981
--color-warning-500: #F59E0B
--color-error-500: #EF4444
--color-neutral-900: #111827

/* Spacing */
--spacing-xs: 4px
--spacing-md: 12px
--spacing-lg: 16px
--spacing-xl: 24px

/* Radius */
--radius-md: 8px
--radius-lg: 12px

/* Shadows */
--shadow-sm: 0 1px 3px
--shadow-md: 0 4px 6px

/* Timing */
--transition-normal: 200ms ease-in-out
```

---

## ⚙️ DEVELOPMENT TIPS

### Import the system
```javascript
import tokens from '../theme/tokens';
// Use: tokens.colors.primary[500] → #6366F1
```

### Use CSS variables
```css
background-color: var(--color-primary-500);
padding: var(--spacing-lg);
border-radius: var(--radius-lg);
transition: all var(--transition-normal);
```

### Hover state pattern
```css
.element:hover {
  background-color: var(--color-primary-600);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
}
```

### Focus state pattern
```css
.element:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}
```

---

## 🎭 ACCESSIBILITY CHECKLIST

✅ Color contrast ratio ≥ 4.5:1
✅ Focus visible outline provided
✅ Keyboard navigation supported
✅ ARIA labels on interactive elements
✅ Alt text on images
✅ Semantic HTML used
✅ Font size ≥ 14px for body text
✅ Touch targets ≥ 44px

---

## 📋 QUICK START FOR NEW COMPONENTS

1. **Choose Color**: Indigo for primary, Violet for accents
2. **Set Radius**: 8px for buttons, 12px for cards
3. **Add Spacing**: 16px padding minimum
4. **Include Shadow**: Use shadow-sm by default
5. **Smooth Transitions**: 150-200ms on interactions
6. **Mobile First**: Design for mobile then expand
7. **High Contrast**: Test color combinations
8. **Test Accessibility**: Keyboard & screen reader

---

## 🎨 BEFORE → AFTER QUICK REFERENCE

```
COLOR:      Blue #2563EB → Indigo #6366F1
FONT:       Inter → Sora/Geist
DISPLAYS:   36px → 40px
H1:         28px → 32px
GRAYS:      Updated for better contrast
BUTTONS:    Same radius, better shadows
CARDS:      Same radius, more modern
MODALS:     16px radius (was 12px)
SPACING:    Refined & optimized
SHADOW:     Enhanced system
ANIMATIONS: More sophisticated
```

---

## 📞 NEED HELP?

- **Full Specs**: See INNOVATIVE_REDESIGN_PROPOSAL.md
- **Overview**: See REDESIGN_OVERVIEW.md
- **Token Values**: Check src/theme/tokens.js
- **CSS Variables**: Check src/theme/globals.css

---

**Quick Reference Version**: 1.0
**Last Updated**: December 4, 2025
**Status**: Ready for Implementation
