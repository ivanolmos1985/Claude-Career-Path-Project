import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Navbar, Sidebar, Container, colors, spacing } from '../components/ui'

/**
 * Main Layout Wrapper
 * Provides consistent Navbar and Sidebar across all authenticated pages
 */
export default function MainLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signOut } = useAuth()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { id: 'teams', label: 'Equipos', icon: '👥', path: '/teams' },
    { id: 'members', label: 'Miembros', icon: '👤', path: '/members' },
    { id: 'evaluations', label: 'Evaluaciones', icon: '📝', path: '/evaluations' },
    { id: 'progress', label: 'Progreso', icon: '📈', path: '/progress' },
    { id: 'decisions', label: 'Decisiones', icon: '✅', path: '/decisions' },
  ]

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: colors.gray[50],
    }}>
      {/* Sidebar */}
      <Sidebar
        items={sidebarItems}
        currentPath={location.pathname}
        onItemClick={(item) => navigate(item.path)}
        collapsed={sidebarCollapsed}
        header={
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.md,
            fontSize: 24,
          }}>
            <span>🎯</span>
            {!sidebarCollapsed && (
              <div style={{
                fontSize: 16,
                fontWeight: 700,
                color: '#3A7AFE',
              }}>
                Career Path
              </div>
            )}
          </div>
        }
        footer={
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.md,
            fontSize: 14,
          }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: colors.primary,
              color: colors.text.inverse,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
            }}>
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            {!sidebarCollapsed && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: spacing.xs,
              }}>
                <div style={{ fontWeight: 600, color: colors.text.primary }}>
                  {user?.email?.split('@')[0]}
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: colors.error,
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600,
                    padding: 0,
                    textAlign: 'left',
                  }}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        }
      />

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Navbar */}
        <Navbar
          logo="🎯"
          logoText="Career Path System"
          menuItems={[
            {
              id: 1,
              label: 'Documentación',
              href: '#',
              onClick: () => navigate('/components'),
            },
          ]}
          rightContent={
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.lg,
            }}>
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 20,
                  cursor: 'pointer',
                  color: colors.text.primary,
                }}
                title="Toggle sidebar"
              >
                {sidebarCollapsed ? '☰' : '✕'}
              </button>
              <div style={{
                fontSize: 12,
                color: colors.text.secondary,
              }}>
                {user?.email}
              </div>
            </div>
          }
        />

        {/* Page Content */}
        <main style={{
          flex: 1,
          overflow: 'auto',
          padding: spacing.xl,
        }}>
          <Container maxWidth="xl">
            {children}
          </Container>
        </main>
      </div>
    </div>
  )
}
