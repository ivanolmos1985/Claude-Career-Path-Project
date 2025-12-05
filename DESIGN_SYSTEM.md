# Career Path System - Design System Documentation

## Overview
This document outlines the unified design system for the Career Path System application. All UI components, colors, typography, and icons follow the guidelines established here to maintain visual consistency and coherence throughout the application.

---

## Color Palette

### Primary Color: Indigo
The primary brand color is **Indigo (#6366F1)**, a modern, professional color that conveys trust and innovation.

```css
--primary-color: #6366F1;
--primary-dark: #4F46E5;      /* Hover state */
--primary-light: #818CF8;     /* Lighter variant for backgrounds */
```

**Usage:**
- Primary buttons and CTAs
- Links and interactive elements
- Tab indicators and active states
- Input focus states
- Cards with accent borders

### Complete Color System

#### Primary Palette (Indigo)
- **50**: `#EEF2FF` - Light background
- **500**: `#6366F1` - Main color
- **600**: `#4F46E5` - Dark variant (hover)
- **700**: `#4338CA` - Darker variant

#### Success Palette (Green)
- **50**: `#F0FDF4` - Success background
- **500**: `#10B981` - Success indicator
- **600**: `#059669` - Success hover

#### Warning Palette (Amber)
- **50**: `#FFFBEB` - Warning background
- **500**: `#F59E0B` - Warning indicator
- **600**: `#D97706` - Warning hover

#### Error Palette (Red)
- **50**: `#FEE2E2` - Error background
- **500**: `#EF4444` - Error indicator
- **600**: `#DC2626` - Error hover

#### Neutral Palette
- **50**: `#F8FAFC` - Background
- **100**: `#F1F5F9` - Light gray
- **200**: `#E2E8F0` - Borders
- **500**: `#64748B` - Secondary text
- **900**: `#0F172A` - Primary text

---

## Typography

### Font Family
All text uses the system font stack for optimal rendering:
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

### Heading Styles

#### H1 (Page Title)
- Font Size: 28px
- Font Weight: 700
- Color: `#003366` (Dark Blue)
- Line Height: 1.2

#### H2 (Section Title)
- Font Size: 22px
- Font Weight: 700
- Color: `#003366`
- Line Height: 1.3

#### H3 (Subsection Title)
- Font Size: 18px
- Font Weight: 700
- Color: `#003366`
- Line Height: 1.4

#### H4 (Component Title)
- Font Size: 16px
- Font Weight: 700
- Color: `#003366`
- Line Height: 1.5

### Body Text
- Font Size: 14px
- Font Weight: 400
- Color: `#374151` (Dark Gray)
- Line Height: 1.6

### Small Text
- Font Size: 12px
- Font Weight: 400
- Color: `#6B7280` (Medium Gray)
- Line Height: 1.5

### Labels
- Font Size: 14px
- Font Weight: 600
- Color: `#003366`
- Letter Spacing: 0.5px

---

## Spacing System

All spacing follows a consistent 4px base unit:

```javascript
const spacing = {
  xs: '4px',      // Minimal spacing
  sm: '8px',      // Small spacing
  md: '12px',     // Medium spacing
  lg: '16px',     // Large spacing
  xl: '24px',     // Extra large
  xxl: '32px',    // XXL
  xxxl: '48px',   // XXXL (page margins)
}
```

### Common Applications
- **Component padding**: `lg (16px)` to `xl (24px)`
- **Margin between sections**: `xl (24px)` to `xxxl (48px)`
- **Gap in flex layouts**: `md (12px)` to `lg (16px)`
- **Input/button padding**: `sm (8px)` to `md (12px)` vertical, `md (12px)` to `lg (16px)` horizontal

---

## Icons

### Icon Library
All icons are sourced from **React Icons Bootstrap** (`react-icons/bi`), providing consistent, professional SVG icons across the entire application.

### Icon Sizes
- **Small**: `14px` - For inline text
- **Medium**: `16px` - For form inputs
- **Standard**: `18px-20px` - For buttons
- **Large**: `24px-32px` - For page headers
- **Extra Large**: `40px` - For empty state illustrations

### Icon Color Usage
Icons inherit the color context of their container:
- **Primary icons**: Use Indigo (#6366F1)
- **Success icons**: Use Green (#10B981)
- **Warning icons**: Use Amber (#F59E0B)
- **Error icons**: Use Red (#EF4444)
- **Neutral icons**: Use Gray (#6B7280)

### Common Icons

#### Navigation
- `BiChart` - Dashboard
- `BiBuildings` - Teams
- `BiUser` - Members/Users
- `BiLineChart` - Evaluations
- `BiTrendingUp` - Progress
- `BiCheckCircle` - Decisions

#### Actions
- `BiPlus` - Add/Create
- `BiPencil` - Edit
- `BiTrash` - Delete
- `BiSave` - Save
- `BiDownload` - Export/Download
- `BiBook` - Documentation

#### Status
- `BiCheckCircle` - Success/Completed
- `BiXCircle` - Error/Failed
- `BiChevronLeft` - Previous
- `BiChevronRight` - Next

#### Content
- `BiPaperclip` - Attachments
- `BiFile` - Files
- `BiEnvelope` - Email/Contact
- `BiCog` - Settings

---

## Components

### Reusable Components

#### MetricCard
A flexible card component for displaying metrics with icons and values.

```jsx
<MetricCard
  label="Total Evaluations"
  value="42"
  Icon={BiLineChart}
  colorScheme="primary"
  showBorder={true}
/>
```

**Props:**
- `label` (string): The metric label
- `value` (string|number): The metric value
- `Icon` (component): React Icon component
- `colorScheme` ('primary' | 'success' | 'warning' | 'error' | 'accent'): Color variant
- `showBorder` (boolean): Show left border indicator

#### StatusBadge
A badge component for displaying status indicators.

```jsx
<StatusBadge variant="success" size="md">
  Completed
</StatusBadge>
```

**Props:**
- `variant` ('success' | 'warning' | 'error' | 'info' | 'neutral'): Status type
- `size` ('sm' | 'md' | 'lg'): Badge size
- `children` (string): Badge text

#### ActionButton
A versatile button component supporting multiple variants and sizes.

```jsx
<ActionButton variant="primary" size="md" Icon={BiPlus}>
  Create New
</ActionButton>
```

**Props:**
- `variant` ('primary' | 'secondary' | 'danger' | 'ghost'): Button style
- `size` ('sm' | 'md' | 'lg'): Button size
- `Icon` (component): Optional React Icon
- `disabled` (boolean): Disabled state
- `children` (string): Button text

---

## Buttons

### Button States

#### Primary Button
- **Background**: Indigo (#6366F1)
- **Text**: White
- **Hover**: Darker Indigo (#4F46E5)
- **Active**: Even darker (#4338CA)

#### Secondary Button
- **Background**: Light Gray (#F3F4F6)
- **Text**: Dark Gray (#374151)
- **Border**: Gray (#D1D5DB)
- **Hover**: White with darker border

#### Danger Button
- **Background**: Red (#EF4444)
- **Text**: White
- **Hover**: Darker Red (#DC2626)

#### Ghost Button
- **Background**: Transparent
- **Text**: Indigo (#6366F1)
- **Border**: Indigo
- **Hover**: Light Indigo background

### Button Sizing
- **Small (sm)**: `8px` vertical, `12px` horizontal padding
- **Medium (md)**: `10px` vertical, `16px` horizontal padding
- **Large (lg)**: `12px` vertical, `20px` horizontal padding

---

## Forms

### Input Fields
- **Border**: `1px solid #D1D5DB` (light gray)
- **Border Radius**: `6px`
- **Padding**: `10px 12px`
- **Font Size**: `14px`
- **Focus Border**: Indigo (#6366F1)
- **Focus Box Shadow**: `0 0 0 3px rgba(99, 102, 241, 0.1)`

### Selects
- Same styling as input fields
- Arrow indicator color: Indigo

### Textareas
- Same border and padding as inputs
- Min height: `100px`
- Resize: Vertical only

### Labels
- Font Size: `14px`
- Font Weight: `600`
- Color: `#003366`
- Margin Bottom: `8px`

---

## Cards

### Card Container
- **Background**: White (#FFFFFF)
- **Border Radius**: `8px`
- **Padding**: `16px` to `24px` (depending on context)
- **Box Shadow**: `0 1px 3px rgba(0, 0, 0, 0.1)`
- **Border**: Optional, `1px solid #E5E7EB`

### Card Variants

#### Default Card
- Standard white card with subtle shadow

#### Highlighted Card
- Left border accent in Indigo
- Light Indigo background (`#EEF2FF`)

#### Success Card
- Green accent border
- Light green background

#### Warning Card
- Amber accent border
- Light amber background

#### Error Card
- Red accent border
- Light red background

---

## Modals

### Modal Structure
- **Overlay**: Transparent black (30% opacity)
- **Modal Background**: White
- **Border Radius**: `12px`
- **Box Shadow**: `0 20px 25px rgba(0, 0, 0, 0.15)`
- **Padding**: `32px` to `40px`
- **Max Width**: `500px` (standard), adjustable

### Modal Header
- Font Size: `18px`
- Font Weight: `700`
- Color: `#003366`
- Margin Bottom: `20px`

### Modal Actions
- Buttons aligned to the right
- Primary action (confirm) on right
- Secondary action (cancel) on left
- Gap between buttons: `12px`

---

## Responsive Design

### Breakpoints
- **Desktop (lg)**: `> 1200px`
- **Tablet (md)**: `768px - 1200px`
- **Mobile (sm)**: `< 768px`

### Header Responsive Behavior
- **Desktop**: Flex row with 3 sections (branding, users, profile)
- **Tablet**: Flexwrap, sections may stack
- **Mobile**: Full flex-column, single column layout

### Tab Navigation Responsive Behavior
- **Desktop**: Horizontal tab bar
- **Tablet**: Horizontal tab bar with scroll
- **Mobile**: Horizontal scroll or dropdown (depending on implementation)

### Card Grid Responsive Behavior
- **Desktop**: Multi-column grid (2-4 columns)
- **Tablet**: 2-column grid
- **Mobile**: Single column grid

---

## Implementation Guidelines

### Color Usage Best Practices
1. Use CSS variables for all colors: `var(--primary-color)`, `var(--color-success-500)`, etc.
2. Maintain color contrast ratios for accessibility (WCAG AA minimum: 4.5:1)
3. Reserve red for errors and destructive actions
4. Use green for success and positive feedback
5. Use amber for warnings and cautions

### Icon Usage Best Practices
1. Always provide meaningful alt text or title attributes
2. Keep icon sizes consistent within a context
3. Use icon colors that match the context (primary, success, error)
4. Don't mix icon styles or libraries
5. Test icon clarity at the intended display size

### Typography Best Practices
1. Never skip heading hierarchy (h1 → h2 → h3)
2. Limit font weights to 400 (normal), 600 (semibold), 700 (bold)
3. Maintain minimum line height of 1.5 for body text
4. Use appropriate contrast ratios for readability

### Spacing Best Practices
1. Use the spacing system values, don't use arbitrary measurements
2. Be consistent with spacing between related elements
3. Use more spacing between unrelated sections
4. Test spacing on mobile to ensure adequate touch targets (min 44x44px)

### Component Best Practices
1. Reuse components instead of creating new ones
2. Pass visual properties via props rather than CSS
3. Document component props and usage
4. Maintain component composition flexibility

---

## Accessibility Considerations

### Color Contrast
- All text must have a contrast ratio of at least 4.5:1 against backgrounds
- Button text must meet the same contrast requirements
- Use semantic color only as a secondary indicator, not the primary one

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Tab order should be logical and intuitive
- Focus indicators must be visible

### Screen Readers
- Use semantic HTML (`<button>`, `<a>`, `<form>`)
- Provide `aria-label` for icon-only buttons
- Use `aria-labelledby` and `aria-describedby` for complex components

### Focus Indicators
- Focus indicators must be clearly visible
- Use the browser's default focus ring or provide custom styling
- Avoid `outline: none` without providing an alternative

---

## File Structure

```
src/
├── theme/
│   ├── colors.js         # Color palette definitions
│   ├── spacing.js        # Spacing and typography constants
│   └── icons.js          # Icon exports and mappings
├── components/
│   ├── ui/
│   │   ├── MetricCard.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── ActionButton.jsx
│   │   └── index.js      # UI component exports
│   ├── Modal.jsx
│   ├── ProtectedRoute.jsx
│   └── ...
├── pages/
│   ├── DashboardPage.jsx
│   ├── TeamsPage.jsx
│   ├── MembersPage.jsx
│   ├── EvaluationPage.jsx
│   ├── ProgressPage.jsx
│   ├── DecisionPage.jsx
│   └── Login.jsx
└── index.css             # Global styles and CSS variables
```

---

## Migration Notes

### From Legacy Design
1. All `#0066ff` references have been replaced with `#6366F1`
2. All `#0052cc` (hover) references replaced with `#4F46E5`
3. All emoji icons replaced with React Icons Bootstrap
4. CSS variables implemented for consistent theming

### Future Improvements
1. Consider implementing a theme switcher (light/dark mode)
2. Extract more hardcoded colors to CSS variables
3. Create Storybook documentation for component library
4. Implement automatic accessibility testing

---

## Version History

- **v1.0.0** (Current): Modern Indigo color system, React Icons, responsive design
- **v0.9.0**: Legacy blue color system (#0066ff)

---

## References

- [React Icons](https://react-icons.github.io/react-icons/)
- [Tailwind Color Palette](https://tailwindcss.com/docs/customizing-colors)
- [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design Principles](https://material.io/design/introduction.html)

