import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { Button } from '../components/ui'

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
        gap: '16px'
      }}>
        {/* Team Members */}
        <div style={{
          padding: '24px',
          background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)',
          borderLeft: '4px solid #0066ff',
          borderRadius: '8px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#0066cc'
            }}>
              Team Members
            </span>
            <span style={{
              fontSize: 36,
              fontWeight: 700,
              color: '#0066ff'
            }}>
              {metrics.totalMembers}
            </span>
          </div>
        </div>

        {/* Pending Evaluations */}
        <div style={{
          padding: '24px',
          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
          borderLeft: '4px solid #f59e0b',
          borderRadius: '8px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#b45309'
            }}>
              Pending Evaluations
            </span>
            <span style={{
              fontSize: 36,
              fontWeight: 700,
              color: '#f59e0b'
            }}>
              0
            </span>
          </div>
        </div>

        {/* Completed Evaluations */}
        <div style={{
          padding: '24px',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          borderLeft: '4px solid #10b981',
          borderRadius: '8px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#047857'
            }}>
              Completed Evaluations
            </span>
            <span style={{
              fontSize: 36,
              fontWeight: 700,
              color: '#10b981'
            }}>
              {metrics.completedEvaluations}
            </span>
          </div>
        </div>
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
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/members')}
            >
              ➕ Create Evaluation
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                alert('View Reports - TBD')
              }}
            >
              📊 View Reports
            </Button>
          </div>
        </div>
      </div>

      {/* Administrator Panel */}
      {isAdminUser && (
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
              Administrator Panel
            </h3>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/teams')}
              style={{
                background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
                width: 'fit-content'
              }}
            >
              ⚙️ Manage Users & Competencies
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
