import React, { useState } from 'react'
import {
  Button,
  TextField,
  Card,
  TeamCard,
  MemberCard,
  SkillCard,
  Select,
  Textarea,
  Checkbox,
  RadioButton,
  Badge,
  RoleBadge,
  SeniorityBadge,
  StatusBadge,
  ScoreBadge,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  Pagination,
  Container,
  Stack,
  Grid,
  CardGrid,
  Section,
  Navbar,
  Breadcrumb,
  Tabs,
  Toast,
  EmptyState,
  Modal,
  Alert,
  Spinner,
  ProgressBar,
  ScoreSelector,
  SkillEvaluationBlock,
  CompetencyProgressBlock,
  RadarChartContainer,
  DecisionBlock,
  colors,
  spacing,
  typography,
} from '../components/ui'

/**
 * Component Showcase / Storybook
 * Comprehensive display of all Career Path Design System components
 */

export default function ComponentShowcase() {
  const [activeTab, setActiveTab] = useState(0)
  const [showToast, setShowToast] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [scoreValue, setScoreValue] = useState(0)

  const tabs = [
    { label: '🎨 Tokens', icon: '🎨' },
    { label: '🔘 Buttons', icon: '🔘' },
    { label: '📝 Inputs', icon: '📝' },
    { label: '🃏 Cards', icon: '🃏' },
    { label: '🏷️ Badges', icon: '🏷️' },
    { label: '📊 Tables', icon: '📊' },
    { label: '📐 Layout', icon: '📐' },
    { label: '🧭 Navigation', icon: '🧭' },
    { label: '💬 Feedback', icon: '💬' },
    { label: '⭐ Evaluation', icon: '⭐' },
  ]

  const sampleMembers = [
    { id: 1, name: 'Juan García', role: 'Desarrollador', seniority: 'Senior', photo: null },
    { id: 2, name: 'María López', role: 'QA', seniority: 'Mid', photo: null },
    { id: 3, name: 'Carlos Ruiz', role: 'Product Owner', seniority: 'Lead', photo: null },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.gray[50] }}>
      {/* Navbar */}
      <Navbar
        logo="🎨"
        logoText="Career Path Design System"
        menuItems={[
          { id: 1, label: 'Documentation', href: '#' },
          { id: 2, label: 'Components', href: '#' },
          { id: 3, label: 'Guidelines', href: '#' },
        ]}
      />

      <Container maxWidth="xl" style={{ paddingTop: spacing.xl }}>
        {/* Header */}
        <Section title="Design System Showcase" subtitle="Complete component library for Career Path System">
          <p style={{
            fontSize: typography.body.fontSize,
            color: colors.text.secondary,
          }}>
            Welcome to the Career Path System design system. This page showcases all available components,
            tokens, and patterns. Use these components to build consistent interfaces across the application.
          </p>
        </Section>

        {/* Navigation Tabs */}
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          style={{ marginBottom: spacing.xl }}
        />

        {/* Tab Content */}
        <div>
          {activeTab === 0 && <TokensShowcase />}
          {activeTab === 1 && <ButtonsShowcase />}
          {activeTab === 2 && <InputsShowcase />}
          {activeTab === 3 && <CardsShowcase members={sampleMembers} />}
          {activeTab === 4 && <BadgesShowcase />}
          {activeTab === 5 && <TablesShowcase currentPage={currentPage} onPageChange={setCurrentPage} />}
          {activeTab === 6 && <LayoutShowcase />}
          {activeTab === 7 && <NavigationShowcase />}
          {activeTab === 8 && (
            <FeedbackShowcase
              showToast={showToast}
              setShowToast={setShowToast}
              showModal={showModal}
              setShowModal={setShowModal}
            />
          )}
          {activeTab === 9 && (
            <EvaluationShowcase scoreValue={scoreValue} setScoreValue={setScoreValue} />
          )}
        </div>
      </Container>

      {/* Toast Notification */}
      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: spacing.lg,
          right: spacing.lg,
          zIndex: 1000,
        }}>
          <Toast
            type="success"
            title="Success!"
            message="This is a success notification example"
            onClose={() => setShowToast(false)}
          />
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        title="Example Modal"
        onClose={() => setShowModal(false)}
        onConfirm={() => setShowModal(false)}
      >
        <p style={{ fontSize: typography.body.fontSize }}>
          This is an example modal with content. You can put any content here.
        </p>
      </Modal>
    </div>
  )
}

// Showcase Sections

function TokensShowcase() {
  return (
    <Section title="Design Tokens" subtitle="Colors, typography, spacing, and more">
      <Stack direction="horizontal" gap="lg" wrap={true} style={{ marginBottom: spacing.xl }}>
        {/* Colors */}
        <div style={{ flex: 1, minWidth: 250 }}>
          <h3 style={{ ...typography.h3, marginBottom: spacing.lg }}>Colors</h3>
          <Stack gap="sm">
            {Object.entries(colors).slice(0, 5).map(([name, value]) => {
              if (typeof value === 'object') return null
              return (
                <div key={name} style={{ display: 'flex', gap: spacing.md, alignItems: 'center' }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: value,
                      borderRadius: '4px',
                      border: `1px solid ${colors.border.medium}`,
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: 600 }}>{name}</div>
                    <div style={{ fontSize: typography.caption.fontSize, color: colors.text.secondary }}>
                      {value}
                    </div>
                  </div>
                </div>
              )
            })}
          </Stack>
        </div>

        {/* Typography */}
        <div style={{ flex: 1, minWidth: 250 }}>
          <h3 style={{ ...typography.h3, marginBottom: spacing.lg }}>Typography</h3>
          <div style={{ ...typography.display }}>Display 32px</div>
          <div style={{ ...typography.h1, marginTop: spacing.md }}>H1 28px</div>
          <div style={{ ...typography.h2, marginTop: spacing.md }}>H2 22px</div>
          <div style={{ ...typography.body, marginTop: spacing.md }}>Body 16px</div>
          <div style={{ ...typography.caption, marginTop: spacing.md }}>Caption 12px</div>
        </div>

        {/* Spacing */}
        <div style={{ flex: 1, minWidth: 250 }}>
          <h3 style={{ ...typography.h3, marginBottom: spacing.lg }}>Spacing Scale</h3>
          <Stack gap="sm">
            {Object.entries(spacing).map(([name, value]) => (
              <div key={name} style={{ display: 'flex', gap: spacing.md, alignItems: 'center' }}>
                <div
                  style={{
                    width: value * 2,
                    height: 24,
                    backgroundColor: colors.primary,
                    borderRadius: '4px',
                  }}
                />
                <div style={{ fontSize: typography.caption.fontSize }}>
                  {name}: {value}px
                </div>
              </div>
            ))}
          </Stack>
        </div>
      </Stack>
    </Section>
  )
}

function ButtonsShowcase() {
  return (
    <Section title="Buttons" subtitle="All button variants and sizes">
      <Stack gap="xl">
        {/* Variants */}
        {['primary', 'secondary', 'ghost', 'destructive'].map((variant) => (
          <div key={variant}>
            <h4 style={{ ...typography.h3, textTransform: 'capitalize', marginBottom: spacing.lg }}>
              {variant}
            </h4>
            <Stack direction="horizontal" gap="base" wrap={true}>
              {['small', 'medium', 'large'].map((size) => (
                <Button key={`${variant}-${size}`} variant={variant} size={size}>
                  {size.charAt(0).toUpperCase() + size.slice(1)} {variant}
                </Button>
              ))}
              {['small', 'medium', 'large'].map((size) => (
                <Button key={`${variant}-${size}-disabled`} variant={variant} size={size} disabled>
                  Disabled
                </Button>
              ))}
            </Stack>
          </div>
        ))}
      </Stack>
    </Section>
  )
}

function InputsShowcase() {
  const [textValue, setTextValue] = useState('')
  const [selectValue, setSelectValue] = useState('')
  const [textareaValue, setTextareaValue] = useState('')
  const [checkboxValue, setCheckboxValue] = useState(false)

  return (
    <Section title="Form Inputs" subtitle="Text fields, selects, and more">
      <CardGrid columns="2" gap="lg">
        <TextField
          label="Text Field"
          placeholder="Enter text..."
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          helperText="This is a helper text"
        />
        <TextField
          label="Email Field"
          type="email"
          placeholder="email@example.com"
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
        />
        <Select
          label="Select Option"
          options={[
            { label: 'Option 1', value: '1' },
            { label: 'Option 2', value: '2' },
            { label: 'Option 3', value: '3' },
          ]}
          value={selectValue}
          onChange={(e) => setSelectValue(e.target.value)}
          placeholder="Choose an option"
        />
        <TextField
          label="Error Field"
          placeholder="This field has an error"
          error="This field is required"
        />
      </CardGrid>
      <div style={{ marginTop: spacing.xl }}>
        <Textarea
          label="Textarea"
          placeholder="Enter a longer message..."
          value={textareaValue}
          onChange={(e) => setTextareaValue(e.target.value)}
          rows={4}
        />
      </div>
      <div style={{ marginTop: spacing.lg, display: 'flex', gap: spacing.lg }}>
        <Checkbox
          label="Remember me"
          checked={checkboxValue}
          onChange={(e) => setCheckboxValue(e.target.checked)}
        />
        <RadioButton
          label="Option A"
          name="options"
          value="a"
          checked={checkboxValue}
          onChange={(e) => setCheckboxValue(e.target.checked)}
        />
      </div>
    </Section>
  )
}

function CardsShowcase({ members }) {
  return (
    <Section title="Cards" subtitle="TeamCard, MemberCard, SkillCard">
      <Stack gap="xl">
        <div>
          <h4 style={{ ...typography.h3, marginBottom: spacing.lg }}>Team Cards</h4>
          <CardGrid columns="3">
            <TeamCard teamName="Frontend Team" memberCount={4} icon="🎨" />
            <TeamCard teamName="Backend Team" memberCount={5} icon="⚙️" />
            <TeamCard teamName="QA Team" memberCount={3} icon="🧪" />
          </CardGrid>
        </div>

        <div>
          <h4 style={{ ...typography.h3, marginBottom: spacing.lg }}>Member Cards</h4>
          <CardGrid columns="3">
            {members.map((member) => (
              <MemberCard
                key={member.id}
                name={member.name}
                role={member.role}
                seniority={member.seniority}
              />
            ))}
          </CardGrid>
        </div>

        <div>
          <h4 style={{ ...typography.h3, marginBottom: spacing.lg }}>Skill Cards</h4>
          <CardGrid columns="3">
            <SkillCard skillName="React" level={4} />
            <SkillCard skillName="TypeScript" level={3} />
            <SkillCard skillName="Node.js" level={5} />
          </CardGrid>
        </div>
      </Stack>
    </Section>
  )
}

function BadgesShowcase() {
  return (
    <Section title="Badges & Status" subtitle="Role badges, seniority, status indicators">
      <Stack gap="xl">
        <div>
          <h4 style={{ ...typography.h3, marginBottom: spacing.lg }}>Role Badges</h4>
          <Stack direction="horizontal" gap="md" wrap={true}>
            <RoleBadge role="developer" />
            <RoleBadge role="qa" />
            <RoleBadge role="productowner" />
            <RoleBadge role="scrummaster" />
            <RoleBadge role="uxui" />
            <RoleBadge role="deliverymanager" />
          </Stack>
        </div>

        <div>
          <h4 style={{ ...typography.h3, marginBottom: spacing.lg }}>Seniority Badges</h4>
          <Stack direction="horizontal" gap="md" wrap={true}>
            <SeniorityBadge level="junior" />
            <SeniorityBadge level="mid" />
            <SeniorityBadge level="senior" />
            <SeniorityBadge level="lead" />
          </Stack>
        </div>

        <div>
          <h4 style={{ ...typography.h3, marginBottom: spacing.lg }}>Status Badges</h4>
          <Stack direction="horizontal" gap="md" wrap={true}>
            <StatusBadge status="pending" />
            <StatusBadge status="in-progress" />
            <StatusBadge status="completed" />
            <StatusBadge status="approved" />
            <StatusBadge status="rejected" />
          </Stack>
        </div>

        <div>
          <h4 style={{ ...typography.h3, marginBottom: spacing.lg }}>Score Badges</h4>
          <Stack direction="horizontal" gap="md" wrap={true}>
            <ScoreBadge score={95} />
            <ScoreBadge score={75} />
            <ScoreBadge score={50} />
            <ScoreBadge score={30} />
          </Stack>
        </div>
      </Stack>
    </Section>
  )
}

function TablesShowcase({ currentPage, onPageChange }) {
  const data = [
    { id: 1, name: 'Juan García', role: 'Developer', status: 'Completed', score: 85 },
    { id: 2, name: 'María López', role: 'QA', status: 'In Progress', score: 72 },
    { id: 3, name: 'Carlos Ruiz', role: 'Product Owner', status: 'Pending', score: 58 },
  ]

  return (
    <Section title="Tables" subtitle="Data tables with pagination">
      <Table striped={true} hoverable={true}>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Role</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell align="right">Score</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody striped={true} hoverable={true}>
          {data.map((row, idx) => (
            <TableRow key={row.id} rowIndex={idx}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.role}</TableCell>
              <TableCell type="status">{row.status}</TableCell>
              <TableCell align="right" type="score">{row.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination currentPage={currentPage} totalPages={5} onPageChange={onPageChange} />
    </Section>
  )
}

function LayoutShowcase() {
  return (
    <Section title="Layout Components" subtitle="Stack, Grid, and responsive layouts">
      <Stack gap="xl">
        <div>
          <h4 style={{ ...typography.h3, marginBottom: spacing.lg }}>Stack</h4>
          <Card padding="lg" elevated={true}>
            <Stack gap="md">
              <div style={{ padding: spacing.lg, backgroundColor: colors.primary, color: colors.text.inverse, borderRadius: '4px' }}>Item 1</div>
              <div style={{ padding: spacing.lg, backgroundColor: colors.success, color: colors.text.inverse, borderRadius: '4px' }}>Item 2</div>
              <div style={{ padding: spacing.lg, backgroundColor: colors.warning, color: colors.text.inverse, borderRadius: '4px' }}>Item 3</div>
            </Stack>
          </Card>
        </div>

        <div>
          <h4 style={{ ...typography.h3, marginBottom: spacing.lg }}>Grid</h4>
          <Grid columns={3} gap="base">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                style={{
                  padding: spacing.lg,
                  backgroundColor: colors.primary,
                  color: colors.text.inverse,
                  borderRadius: '4px',
                  textAlign: 'center',
                  fontWeight: 600,
                }}
              >
                Grid Item {i}
              </div>
            ))}
          </Grid>
        </div>
      </Stack>
    </Section>
  )
}

function NavigationShowcase() {
  return (
    <Section title="Navigation" subtitle="Breadcrumbs and navigation patterns">
      <Stack gap="xl">
        <div>
          <h4 style={{ ...typography.h3, marginBottom: spacing.lg }}>Breadcrumb</h4>
          <Breadcrumb
            items={[
              { label: 'Home', href: '#' },
              { label: 'Teams', href: '#' },
              { label: 'Evaluations', href: '#' },
              { label: 'Current' },
            ]}
          />
        </div>
      </Stack>
    </Section>
  )
}

function FeedbackShowcase({ showToast, setShowToast, showModal, setShowModal }) {
  return (
    <Section title="Feedback Components" subtitle="Alerts, modals, spinners, and progress">
      <Stack gap="xl">
        <div>
          <h4 style={{ ...typography.h3, marginBottom: spacing.lg }}>Alert Types</h4>
          <Stack gap="md">
            <Alert type="success" title="Success!" message="Operation completed successfully" />
            <Alert type="warning" title="Warning" message="Please review before proceeding" />
            <Alert type="error" title="Error" message="Something went wrong. Please try again." />
            <Alert type="info" title="Info" message="This is an informational message" />
          </Stack>
        </div>

        <div>
          <h4 style={{ ...typography.h3, marginBottom: spacing.lg }}>Empty State</h4>
          <EmptyState
            icon="📭"
            title="No teams found"
            description="Create your first team to get started"
            action={() => alert('Create team')}
            actionLabel="Create Team"
          />
        </div>

        <div>
          <h4 style={{ ...typography.h3, marginBottom: spacing.lg }}>Progress & Spinner</h4>
          <Stack direction="horizontal" gap="xl">
            <div style={{ flex: 1 }}>
              <ProgressBar value={65} max={100} showLabel={true} size="large" />
            </div>
            <div style={{ display: 'flex', gap: spacing.lg }}>
              <Spinner size="small" />
              <Spinner size="medium" />
              <Spinner size="large" />
            </div>
          </Stack>
        </div>

        <div>
          <Stack direction="horizontal" gap="md">
            <Button variant="primary" onClick={() => setShowToast(true)}>
              Show Toast
            </Button>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Show Modal
            </Button>
          </Stack>
        </div>
      </Stack>
    </Section>
  )
}

function EvaluationShowcase({ scoreValue, setScoreValue }) {
  return (
    <Section title="Evaluation Components" subtitle="Score selectors, competency blocks, and decisions">
      <Stack gap="xl">
        <div>
          <h4 style={{ ...typography.h3, marginBottom: spacing.lg }}>Score Selector (1-10)</h4>
          <ScoreSelector value={scoreValue} onChange={setScoreValue} max={10} />
        </div>

        <div>
          <h4 style={{ ...typography.h3, marginBottom: spacing.lg }}>Skill Evaluation Block</h4>
          <SkillEvaluationBlock
            skillName="React Advanced"
            description="Proficiency with React hooks, performance optimization, and state management"
            value={7}
            onChange={() => {}}
            notes="Strong component design skills with good understanding of hooks"
            maxScore={10}
          />
        </div>

        <div>
          <h4 style={{ ...typography.h3, marginBottom: spacing.lg }}>Competency Progress</h4>
          <CardGrid columns="2" gap="base">
            <CompetencyProgressBlock
              competencyName="Technical Knowledge"
              score={85}
              weight={30}
              weightedScore={25.5}
            />
            <CompetencyProgressBlock
              competencyName="Communication"
              score={72}
              weight={20}
              weightedScore={14.4}
            />
          </CardGrid>
        </div>

        <div>
          <h4 style={{ ...typography.h3, marginBottom: spacing.lg }}>Radar Chart Container</h4>
          <RadarChartContainer
            title="Skills Overview"
            data={[
              { skill: 'Technical', value: 85 },
              { skill: 'Leadership', value: 70 },
              { skill: 'Communication', value: 80 },
              { skill: 'Problem Solving', value: 90 },
            ]}
          />
        </div>

        <div>
          <h4 style={{ ...typography.h3, marginBottom: spacing.lg }}>Decision Block</h4>
          <DecisionBlock
            quarterScore={82}
            quarterLevel="APROBADA"
            annualScore={78}
            annualLevel="APROBADA"
            recommendation="Continue with current growth plan. Strong performance in technical skills. Consider developing leadership capabilities."
          />
        </div>
      </Stack>
    </Section>
  )
}
