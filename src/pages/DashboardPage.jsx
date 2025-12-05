import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { Button } from '../components/ui'
import { MetricCard } from '../components/ui/MetricCard'
import { BiLineChart, BiCheckCircle, BiPlus, BiDownload, BiCog } from 'react-icons/bi'
import { colors } from '../theme/colors'
import { spacing, typography } from '../theme/spacing'

export default function DashboardPage() {
  const { user, userProfile } = useAuth()
  const { teams = [], isAdminUser = false } = useApp() || {}
  const navigate = useNavigate()

  // Calculate metrics
  const metrics = useMemo(() => {
    // Team Members - suma total de todos los miembros
    const totalMembers = teams.reduce((sum, team) => sum + (team.members?.length || 0), 0)

    // Completed Evaluations - suma total de evaluaciones completadas
    const completedEvaluations = teams.reduce((sum, team) => {
      const teamEvaluations = team.members?.reduce((memberSum, member) => {
        // member.evaluations es un objeto { Q1: {}, Q2: {}, Q3: {}, Q4: {} }
        // Contar cuantas evaluaciones tienen datos (no están vacías)
        const evaluationCount = Object.values(member.evaluations || {}).filter(e =>
          e && Object.keys(e).length > 0
        ).length
        return memberSum + evaluationCount
      }, 0) || 0
      return sum + teamEvaluations
    }, 0)

    return {
      totalMembers,
      completedEvaluations
    }
  }, [teams])

  // Get job role from user profile
  const jobRole = userProfile?.job_role || 'Not Set'

  // Access level
  const accessLevel = isAdminUser ? 'Admin' : 'User'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '20px', backgroundColor: '#ffffff' }}>
      {/* Page Header */}
      <div>
        <h1 style={{ margin: '0 0 8px 0', color: '#111', fontSize: 32, fontWeight: 700 }}>
          Dashboard
        </h1>
        <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>
          Welcome back, {userProfile?.full_name || user?.email?.split('@')[0]}
        </p>
      </div>

      {/* Info Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px'
      }}>
        {/* Job Role Card */}
        <div style={{
          padding: '20px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          backgroundColor: '#ffffff'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{
              fontSize: 12,
              fontWeight: 600,
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Job Role
            </span>
            <span style={{
              fontSize: 24,
              fontWeight: 700,
              color: '#111'
            }}>
              {jobRole}
            </span>
          </div>
        </div>

        {/* Access Level Card */}
        <div style={{
          padding: '20px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          backgroundColor: '#ffffff'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{
              fontSize: 12,
              fontWeight: 600,
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Access Level
            </span>
            <span style={{
              fontSize: 24,
              fontWeight: 700,
              color: '#111'
            }}>
              {accessLevel}
            </span>
          </div>
        </div>

        {/* Status Card */}
        <div style={{
          padding: '20px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          backgroundColor: '#ffffff'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{
              fontSize: 12,
              fontWeight: 600,
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Status
            </span>
            <span style={{
              display: 'inline-block',
              paddingLeft: '8px',
              paddingRight: '8px',
              paddingTop: '4px',
              paddingBottom: '4px',
              backgroundColor: '#dcfce7',
              color: '#166534',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '600',
              width: 'fit-content'
            }}>
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: spacing.lg
      }}>
        <MetricCard
          label="Team Members"
          value={metrics.totalMembers}
          Icon={BiLineChart}
          colorScheme="primary"
        />
        <MetricCard
          label="Pending Evaluations"
          value={0}
          Icon={BiDownload}
          colorScheme="warning"
        />
        <MetricCard
          label="Completed Evaluations"
          value={metrics.completedEvaluations}
          Icon={BiCheckCircle}
          colorScheme="success"
        />
      </div>

      {/* Quick Actions */}
      <div style={{ padding: '24px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 600,
            color: '#111'
          }}>
            Quick Actions
          </h3>
          <div style={{
            display: 'flex',
            gap: spacing.md,
            flexWrap: 'wrap'
          }}>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/members')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <BiPlus size={18} /> Create Evaluation
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                alert('View Reports - TBD')
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <BiLineChart size={18} /> View Reports
            </Button>
          </div>
        </div>
      </div>

      {/* Management Panel */}
      <div style={{
        padding: '24px',
        background: 'linear-gradient(135deg, #faf5ff 0%, #f5e6ff 100%)',
        borderLeft: '4px solid #a855f7',
        borderRadius: '8px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 600,
            color: '#6b21a8'
          }}>
            Manage Teams & Members
          </h3>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/teams')}
            style={{
              background: `linear-gradient(135deg, ${colors.accent[500]} 0%, ${colors.accent[600]} 100%)`,
              width: 'fit-content',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <BiCog size={18} /> Go to Teams & Competencies
          </Button>
        </div>
      </div>
    </div>
  )
}
