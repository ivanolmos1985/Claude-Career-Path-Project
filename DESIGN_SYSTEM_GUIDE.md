# Career Path System - Design System & Component Library

Complete design system and production-ready UI component library for the Career Path System.

## 📋 Overview

This design system provides:
- **Design Tokens**: Colors, typography, spacing, shadows, and radii
- **Base Components**: Buttons, inputs, cards, and more
- **Layout System**: Responsive grid, stack, and layout components
- **Navigation**: Navbar, sidebar, breadcrumb, and tabs
- **Form Elements**: Text fields, selects, checkboxes, and radio buttons
- **Badges & Status**: Role, seniority, status, and score indicators
- **Tables**: Data tables with pagination
- **Feedback**: Toasts, alerts, modals, spinners, and progress bars
- **Evaluation Components**: Score selectors, skill blocks, and decision displays

## 🎨 Design Tokens

All tokens are defined in `src/theme/tokens.js` and exported for use throughout the application.

### Colors

**Brand Colors:**
```javascript
import { colors } from '@/components/ui'

colors.primary       // #3A7AFE (Career Blue)
colors.primaryLight  // #6EC3F5 (Secondary)
colors.success       // #30C48D (Green)
colors.warning       // #F7B538 (Amber)
colors.error         // #E35151 (Red)
```

**Gray Scale:**
```javascript
colors.gray[50]    // #F9FAFB (Lightest)
colors.gray[100]   // #F3F4F6
colors.gray[200]   // #E5E7EB
// ... through ...
colors.gray[900]   // #111827 (Darkest)
```

**Surfaces, Borders, and Text:**
```javascript
colors.surface.light        // #FFFFFF
colors.border.subtle        // #E5E7EB
colors.text.primary         // #111827
colors.text.secondary       // #4B5563
colors.text.muted           // #6B7280
```

### Typography

```javascript
import { typography } from '@/components/ui'

typography.fontFamily            // 'Inter', system fonts
typography.display              // 32px / 700 / 1.2 line-height
typography.h1                   // 28px / 600
typography.h2                   // 22px / 600
typography.h3                   // 18px / 600
typography.body                 // 16px / 400
typography.bodySmall            // 14px / 400
typography.caption              // 12px / 400
typography.buttonText           // 14px / 600
```

### Spacing Scale

```javascript
import { spacing } from '@/components/ui'

spacing.xs      // 4px
spacing.sm      // 8px
spacing.md      // 12px
spacing.base    // 16px
spacing.lg      // 20px
spacing.xl      // 24px
spacing.xxl     // 32px
spacing.xxxl    // 40px
spacing.huge    // 48px
```

### Radii

```javascript
import { radii } from '@/components/ui'

radii.xs        // 4px
radii.sm        // 8px
radii.md        // 12px
radii.lg        // 20px
radii.pill      // 9999px
```

### Shadows

```javascript
import { shadows } from '@/components/ui'

shadows.card        // Light card shadow
shadows.popover     // Popover/dropdown shadow
shadows.elevated    // Elevated shadow
shadows.focus       // Focus outline with blue glow
```

## 🔘 Component Usage

### Button Component

```javascript
import { Button } from '@/components/ui'

// Variants: primary, secondary, ghost, destructive
// Sizes: small, medium, large
// States: default, hover, focus, disabled

<Button variant="primary" size="medium">
  Click me
</Button>

<Button variant="destructive" disabled>
  Delete
</Button>

<Button variant="ghost" size="small">
  Cancel
</Button>
```

### TextField Component

```javascript
import { TextField } from '@/components/ui'

<TextField
  label="Email"
  type="email"
  placeholder="Enter email..."
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={emailError}
  helperText="We'll never share your email"
  required
/>
```

### Card Components

```javascript
import { Card, TeamCard, MemberCard, SkillCard } from '@/components/ui'

// Basic Card
<Card padding="lg" elevated>
  <h3>Card Title</h3>
  <p>Card content here</p>
</Card>

// Team Card
<TeamCard
  teamName="Frontend Team"
  memberCount={4}
  icon="🎨"
  onClick={() => navigate('/team/1')}
/>

// Member Card
<MemberCard
  name="Juan García"
  role="Developer"
  seniority="Senior"
  photo={null}
/>

// Skill Card
<SkillCard
  skillName="React"
  level={4}
  maxLevel={5}
/>
```

### Form Elements

```javascript
import { Select, Textarea, Checkbox, RadioButton } from '@/components/ui'

<Select
  label="Choose role"
  options={[
    { label: 'Developer', value: 'dev' },
    { label: 'QA', value: 'qa' }
  ]}
  value={role}
  onChange={(e) => setRole(e.target.value)}
/>

<Textarea
  label="Description"
  rows={4}
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/>

<Checkbox
  label="I agree to terms"
  checked={agreed}
  onChange={(e) => setAgreed(e.target.checked)}
/>
```

### Badge Components

```javascript
import {
  Badge,
  RoleBadge,
  SeniorityBadge,
  StatusBadge,
  ScoreBadge
} from '@/components/ui'

// Generic Badge
<Badge variant="primary" size="medium">
  Feature
</Badge>

// Role Badge (pre-configured)
<RoleBadge role="developer" />  // Shows 💻 Desarrollador

// Seniority Badge
<SeniorityBadge level="senior" />  // Shows ⭐ Senior

// Status Badge
<StatusBadge status="completed" />  // Shows ✅ Completada

// Score Badge
<ScoreBadge score={85} maxScore={100} />  // Color-coded
```

### Table Components

```javascript
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  Pagination
} from '@/components/ui'

<Table striped hoverable>
  <TableHead>
    <TableRow>
      <TableHeaderCell>Name</TableHeaderCell>
      <TableHeaderCell>Role</TableHeaderCell>
      <TableHeaderCell align="right">Score</TableHeaderCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {data.map((row, idx) => (
      <TableRow key={row.id} rowIndex={idx}>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.role}</TableCell>
        <TableCell type="score" align="right">
          {row.score}
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

<Pagination
  currentPage={page}
  totalPages={10}
  onPageChange={setPage}
/>
```

### Layout Components

```javascript
import {
  Container,
  Stack,
  Grid,
  CardGrid,
  Section,
  Spacer,
  SidebarLayout
} from '@/components/ui'

// Responsive container
<Container maxWidth="lg">
  {/* Content */}
</Container>

// Vertical/horizontal stack
<Stack direction="vertical" gap="lg">
  <div>Item 1</div>
  <div>Item 2</div>
</Stack>

// Responsive grid
<Grid columns={3} gap="base">
  {items.map(item => <Card key={item.id}>{item.name}</Card>)}
</Grid>

// Auto-fit card grid
<CardGrid gap="base">
  {cards.map(card => <Card key={card.id}>{card}</Card>)}
</CardGrid>

// Section with title
<Section title="Team Members" subtitle="Active team members">
  {/* Content */}
</Section>

// Sidebar layout
<SidebarLayout sidebar={<SidebarNav />}>
  {/* Main content */}
</SidebarLayout>
```

### Navigation Components

```javascript
import { Navbar, Sidebar, Breadcrumb, Tabs } from '@/components/ui'

// Top navigation bar
<Navbar
  logo="🎯"
  logoText="Career Path"
  menuItems={[
    { id: 1, label: 'Dashboard', href: '/dashboard', active: true },
    { id: 2, label: 'Teams', href: '/teams' }
  ]}
  rightContent={<UserMenu />}
/>

// Sidebar navigation
<Sidebar
  items={[
    { id: 1, label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { id: 2, label: 'Teams', icon: '👥', path: '/teams' }
  ]}
  currentPath={location.pathname}
  onItemClick={(item) => navigate(item.path)}
/>

// Breadcrumb trail
<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Teams', href: '/teams' },
    { label: 'Team A' }
  ]}
/>

// Tabbed interface
<Tabs
  tabs={[
    { label: 'Overview', content: <Overview /> },
    { label: 'Members', content: <Members /> },
    { label: 'Settings', content: <Settings /> }
  ]}
  activeTab={0}
  onTabChange={setActiveTab}
/>
```

### Feedback Components

```javascript
import {
  Toast,
  Alert,
  EmptyState,
  Modal,
  Spinner,
  ProgressBar
} from '@/components/ui'

// Toast notification (typically positioned fixed)
<Toast
  type="success"
  title="Success!"
  message="Operation completed"
  onClose={() => setShowToast(false)}
/>

// Inline alert
<Alert
  type="warning"
  title="Warning"
  message="Please review before proceeding"
/>

// Empty state
<EmptyState
  icon="📭"
  title="No teams found"
  description="Create your first team"
  action={createTeam}
  actionLabel="Create Team"
/>

// Modal
<Modal
  isOpen={showModal}
  title="Confirm Action"
  onClose={() => setShowModal(false)}
  onConfirm={handleConfirm}
  confirmText="Confirm"
  cancelText="Cancel"
>
  <p>Are you sure?</p>
</Modal>

// Loading spinner
<Spinner size="medium" color="primary" />

// Progress bar
<ProgressBar value={65} max={100} showLabel size="large" />
```

### Evaluation Components

```javascript
import {
  ScoreSelector,
  SkillEvaluationBlock,
  CompetencyProgressBlock,
  RadarChartContainer,
  DecisionBlock
} from '@/components/ui'

// Score selector (1-10)
<ScoreSelector
  value={score}
  onChange={setScore}
  max={10}
/>

// Skill evaluation block
<SkillEvaluationBlock
  skillName="React Advanced"
  description="Proficiency with hooks and optimization"
  value={score}
  onChange={setScore}
  notes={notes}
  onNotesChange={setNotes}
  maxScore={10}
/>

// Competency progress
<CompetencyProgressBlock
  competencyName="Technical Knowledge"
  score={85}
  weight={30}
  weightedScore={25.5}
/>

// Radar chart (placeholder)
<RadarChartContainer
  title="Skills Overview"
  data={skillsData}
/>

// Decision block
<DecisionBlock
  quarterScore={82}
  quarterLevel="APROBADA"
  annualScore={78}
  annualLevel="APROBADA"
  recommendation="Strong performer. Continue growth plan."
/>
```

## 🎯 Recommended Patterns

### Form Layout

```javascript
<FormLayout columnCount={2} gap="lg">
  <TextField label="First Name" />
  <TextField label="Last Name" />
  <Select label="Role" options={roles} style={{ gridColumn: '1 / -1' }} />
  <Textarea label="Description" style={{ gridColumn: '1 / -1' }} />
</FormLayout>
```

### Dashboard Grid

```javascript
<CardGrid columns="auto" gap="lg">
  <Card>
    <div style={{ fontSize: 24 }}>📊</div>
    <div>Total Teams</div>
    <div style={{ fontSize: 32, fontWeight: 700 }}>12</div>
  </Card>
  {/* More cards */}
</CardGrid>
```

### Evaluation Form

```javascript
<Section title="Q4 Evaluation" subtitle="Rate competencies">
  <Stack gap="xl">
    {competencies.map(comp => (
      <SkillEvaluationBlock key={comp.id} {...comp} />
    ))}
  </Stack>
</Section>
```

## 📊 Component Showcase

View all components and variants in action:

```bash
# Access the component showcase page at:
# http://localhost:5173/components

# In your router, add:
<Route path="/components" element={<ComponentShowcase />} />
```

## 🔧 Customization

### Using Tokens

```javascript
import { colors, spacing, typography } from '@/components/ui'

const CustomComponent = styled.div`
  background-color: ${colors.primary};
  padding: ${spacing.lg}px;
  font-size: ${typography.body.fontSize}px;
  color: ${colors.text.primary};
`
```

### Creating Component Variants

```javascript
import { Button } from '@/components/ui'

const GhostButton = (props) => (
  <Button variant="ghost" size="medium" {...props} />
)

export default GhostButton
```

## 📝 Global Styles

Global styles are applied via `src/theme/globals.css`:

```css
/* CSS variables automatically set from tokens */
:root {
  --color-primary: #3A7AFE;
  --space-base: 16px;
  --font-family: 'Inter', sans-serif;
  /* ... and more */
}
```

Import in your main App:

```javascript
import '@/theme/globals.css'
```

## 🚀 Component Generation

All components use inline styles for maximum flexibility. No CSS files required unless you're using Tailwind or styled-components.

For consistent spacing and sizing, always use tokens:

```javascript
// ✅ Good
style={{ padding: spacing.lg, fontSize: typography.body.fontSize }}

// ❌ Avoid
style={{ padding: '24px', fontSize: '16px' }}
```

## 📦 File Structure

```
src/
├── theme/
│   ├── tokens.js           # Design tokens
│   └── globals.css         # Global styles
├── components/
│   └── ui/
│       ├── index.js        # Barrel export
│       ├── Button.jsx
│       ├── TextField.jsx
│       ├── Card.jsx
│       ├── FormElements.jsx
│       ├── Badge.jsx
│       ├── Table.jsx
│       ├── Layout.jsx
│       ├── Navigation.jsx
│       ├── Feedback.jsx
│       └── EvaluationComponents.jsx
└── pages/
    └── ComponentShowcase.jsx  # Storybook
```

## ✨ Best Practices

1. **Use tokens consistently** - Always use design tokens for colors, spacing, etc.
2. **Compose components** - Build complex UIs by combining smaller components
3. **Prop drilling** - Pass necessary props down the component tree
4. **Semantic HTML** - Use proper semantic elements where applicable
5. **Accessibility** - Ensure proper ARIA labels and keyboard navigation
6. **Type checking** - Add PropTypes or TypeScript for production components
7. **Test components** - Write tests for critical component behavior

## 🎓 Next Steps

1. **Integrate into pages** - Start using components in your pages
2. **Create brand variations** - Build company-specific component wrappers
3. **Add animations** - Enhance UX with smooth transitions
4. **Implement theming** - Support light/dark modes
5. **Document patterns** - Add usage guidelines specific to your team

## 📞 Support

For questions or issues with components, refer to:
- Component Showcase: `/components`
- Design tokens: `src/theme/tokens.js`
- Example implementations throughout the codebase

---

**Design System v1.0** - Career Path System
Last updated: 2025-12-04
