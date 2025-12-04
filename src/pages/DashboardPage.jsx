import React from 'react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import {
  Section,
  CardGrid,
  Card,
  Stack,
  Grid,
  ProgressBar,
  colors,
  spacing,
  typography,
} from '../components/ui'

/**
 * Dashboard Page
 * Overview of teams, members, evaluations, and progress
 */
export default function DashboardPage() {
  const { teams, members } = useApp()
  const { user } = useAuth()

  // Calculate some stats
  const totalTeams = teams?.length || 0
  const totalMembers = members?.length || 0
  const completionRate = 65 // Placeholder - calcular según evaluaciones reales

  return (
    <div>
      {/* Header */}
      <Section
        title="📊 Dashboard"
        subtitle={`Bienvenido, ${user?.email?.split('@')[0]}`}
      >
        <p style={{
          fontSize: typography.body.fontSize,
          color: colors.text.secondary,
          margin: 0,
        }}>
          Aquí puedes ver un resumen de tus equipos, miembros y evaluaciones.
        </p>
      </Section>

      {/* Key Metrics */}
      <Section title="Métricas Principales" style={{ marginTop: spacing.xl }}>
        <CardGrid columns="4">
          <Card padding="lg" elevated>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 40,
                marginBottom: spacing.md,
              }}>
                👥
              </div>
              <div style={{
                fontSize: typography.h2.fontSize,
                fontWeight: 700,
                color: colors.primary,
                marginBottom: spacing.sm,
              }}>
                {totalTeams}
              </div>
              <div style={{
                fontSize: typography.bodySmall.fontSize,
                color: colors.text.secondary,
              }}>
                Equipos
              </div>
            </div>
          </Card>

          <Card padding="lg" elevated>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 40,
                marginBottom: spacing.md,
              }}>
                👤
              </div>
              <div style={{
                fontSize: typography.h2.fontSize,
                fontWeight: 700,
                color: colors.success,
                marginBottom: spacing.sm,
              }}>
                {totalMembers}
              </div>
              <div style={{
                fontSize: typography.bodySmall.fontSize,
                color: colors.text.secondary,
              }}>
                Miembros
              </div>
            </div>
          </Card>

          <Card padding="lg" elevated>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 40,
                marginBottom: spacing.md,
              }}>
                📝
              </div>
              <div style={{
                fontSize: typography.h2.fontSize,
                fontWeight: 700,
                color: colors.warning,
                marginBottom: spacing.sm,
              }}>
                12
              </div>
              <div style={{
                fontSize: typography.bodySmall.fontSize,
                color: colors.text.secondary,
              }}>
                Evaluaciones
              </div>
            </div>
          </Card>

          <Card padding="lg" elevated>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 40,
                marginBottom: spacing.md,
              }}>
                ✅
              </div>
              <div style={{
                fontSize: typography.h2.fontSize,
                fontWeight: 700,
                color: colors.success,
                marginBottom: spacing.sm,
              }}>
                {completionRate}%
              </div>
              <div style={{
                fontSize: typography.bodySmall.fontSize,
                color: colors.text.secondary,
              }}>
                Completadas
              </div>
            </div>
          </Card>
        </CardGrid>
      </Section>

      {/* Completion Progress */}
      <Section title="Progreso de Completación" style={{ marginTop: spacing.xl }}>
        <Card padding="lg">
          <Stack gap="md">
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: spacing.md,
              }}>
                <div style={{
                  fontSize: typography.body.fontSize,
                  fontWeight: 600,
                  color: colors.text.primary,
                }}>
                  Evaluaciones Q4
                </div>
                <div style={{
                  fontSize: typography.bodySmall.fontSize,
                  color: colors.text.secondary,
                }}>
                  {completionRate}% completadas
                </div>
              </div>
              <ProgressBar
                value={completionRate}
                max={100}
                color="success"
                size="large"
              />
            </div>

            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: spacing.md,
              }}>
                <div style={{
                  fontSize: typography.body.fontSize,
                  fontWeight: 600,
                  color: colors.text.primary,
                }}>
                  Carga de Evidencia
                </div>
                <div style={{
                  fontSize: typography.bodySmall.fontSize,
                  color: colors.text.secondary,
                }}>
                  48% completadas
                </div>
              </div>
              <ProgressBar
                value={48}
                max={100}
                color="warning"
                size="large"
              />
            </div>

            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: spacing.md,
              }}>
                <div style={{
                  fontSize: typography.body.fontSize,
                  fontWeight: 600,
                  color: colors.text.primary,
                }}>
                  Decisiones Finales
              </div>
                <div style={{
                  fontSize: typography.bodySmall.fontSize,
                  color: colors.text.secondary,
                }}>
                  32% completadas
                </div>
              </div>
              <ProgressBar
                value={32}
                max={100}
                color="error"
                size="large"
              />
            </div>
          </Stack>
        </Card>
      </Section>

      {/* Quick Actions */}
      <Section title="Acciones Rápidas" style={{ marginTop: spacing.xl }}>
        <Grid columns={2} gap="lg">
          <Card
            padding="lg"
            elevated
            style={{
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textDecoration: 'none',
            }}
            onClick={() => window.location.href = '/teams'}
          >
            <Stack gap="md">
              <div style={{ fontSize: 32 }}>👥</div>
              <div>
                <h3 style={{
                  margin: 0,
                  marginBottom: spacing.sm,
                  fontSize: typography.h3.fontSize,
                  fontWeight: typography.h3.fontWeight,
                }}>
                  Gestionar Equipos
                </h3>
                <p style={{
                  margin: 0,
                  fontSize: typography.bodySmall.fontSize,
                  color: colors.text.secondary,
                }}>
                  Crea, edita y administra tus equipos de trabajo
                </p>
              </div>
            </Stack>
          </Card>

          <Card
            padding="lg"
            elevated
            style={{
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textDecoration: 'none',
            }}
            onClick={() => window.location.href = '/members'}
          >
            <Stack gap="md">
              <div style={{ fontSize: 32 }}>👤</div>
              <div>
                <h3 style={{
                  margin: 0,
                  marginBottom: spacing.sm,
                  fontSize: typography.h3.fontSize,
                  fontWeight: typography.h3.fontWeight,
                }}>
                  Gestionar Miembros
                </h3>
                <p style={{
                  margin: 0,
                  fontSize: typography.bodySmall.fontSize,
                  color: colors.text.secondary,
                }}>
                  Agrega y administra miembros de tus equipos
                </p>
              </div>
            </Stack>
          </Card>

          <Card
            padding="lg"
            elevated
            style={{
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textDecoration: 'none',
            }}
            onClick={() => window.location.href = '/evaluation'}
          >
            <Stack gap="md">
              <div style={{ fontSize: 32 }}>📝</div>
              <div>
                <h3 style={{
                  margin: 0,
                  marginBottom: spacing.sm,
                  fontSize: typography.h3.fontSize,
                  fontWeight: typography.h3.fontWeight,
                }}>
                  Realizar Evaluaciones
                </h3>
                <p style={{
                  margin: 0,
                  fontSize: typography.bodySmall.fontSize,
                  color: colors.text.secondary,
                }}>
                  Califica competencias y sube evidencia
                </p>
              </div>
            </Stack>
          </Card>

          <Card
            padding="lg"
            elevated
            style={{
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textDecoration: 'none',
            }}
            onClick={() => window.location.href = '/decision'}
          >
            <Stack gap="md">
              <div style={{ fontSize: 32 }}>✅</div>
              <div>
                <h3 style={{
                  margin: 0,
                  marginBottom: spacing.sm,
                  fontSize: typography.h3.fontSize,
                  fontWeight: typography.h3.fontWeight,
                }}>
                  Decisiones Finales
                </h3>
                <p style={{
                  margin: 0,
                  fontSize: typography.bodySmall.fontSize,
                  color: colors.text.secondary,
                }}>
                  Revisa las decisiones de evaluación
                </p>
              </div>
            </Stack>
          </Card>
        </Grid>
      </Section>
    </div>
  )
}
