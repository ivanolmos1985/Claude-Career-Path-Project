import React, { useEffect, useState } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppProvider, useApp } from './context/AppContext'
import ProtectedRoute from './components/ProtectedRoute'

import TeamsPage from './pages/TeamsPage'
import MembersPage from './pages/MembersPage'
import EvaluationPage from './pages/EvaluationPage'
import ProgressPage from './pages/ProgressPage'
import DecisionPage from './pages/DecisionPage'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'

// Scroll to top cuando cambia la ruta
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

// ---- Componente de Usuario Dropdown ----
function UserDropdown() {
  const { user, signOut } = useAuth()
  const { isAdminUser, allUsers } = useApp()
  const [isOpen, setIsOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
  }

  const dropdownRef = React.useRef(null)

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="user-dropdown-container" ref={dropdownRef}>
      <button
        className="user-dropdown-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        👤 {user?.email?.split('@')[0] || 'Usuario'}
      </button>

      <div className={`user-dropdown-menu ${isOpen ? 'active' : ''}`}>
        <div className="user-dropdown-header">
          <div className="user-email">{user?.email}</div>
          <div className="user-role">Usuario</div>
          {isAdminUser && (
            <span className="admin-badge">Admin</span>
          )}
        </div>

        {isAdminUser && allUsers.length > 0 && (
          <>
            <div style={{ padding: '8px 16px', fontSize: '12px', fontWeight: '600', color: '#6b7280', marginTop: '8px' }}>
              USUARIOS CONECTADOS
            </div>
            <div className="user-list">
              {allUsers.map(u => (
                <div key={u.id} className="user-list-item">
                  📧 {u.email}
                </div>
              ))}
            </div>
            <div className="dropdown-divider"></div>
          </>
        )}

        <button
          className="dropdown-logout"
          onClick={handleSignOut}
        >
          🚪 Cerrar sesión
        </button>
      </div>
    </div>
  )
}

// ---- Componente de Tabs de Navegación ----
function SubHeader() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const tabs = [
    { label: '🏢 Equipos', path: '/teams' },
    { label: '👥 Miembros', path: '/members' },
    { label: '📊 Evaluación', path: '/evaluation' },
    { label: '📈 Progreso', path: '/progress' },
    { label: '✅ Decisión', path: '/decision' }
  ]

  return (
    <div className="subheader">
      <div className="subheader-tabs">
        {tabs.map(tab => (
          <button
            key={tab.path}
            className={`tab ${pathname === tab.path ? 'active' : ''}`}
            onClick={() => navigate(tab.path)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ---- renderiza la app completa SOLO si hay usuario ----
function AppShell() {
  return (
    <div className="container">
      <ScrollToTop />

      {/* HEADER */}
      <div className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <img src="/arkus-logo.webp" alt="Arkusnexus" style={{ height: 40 }} />
          <h2 style={{ margin: 0, fontSize: 20 }}>Career Path System</h2>
        </div>

        <UserDropdown />
      </div>

      {/* SUBHEADER CON TABS */}
      <SubHeader />

      {/* CONTENT */}
      <div className="content">
        <Routes>
          <Route path="/" element={<ProtectedRoute><TeamsPage /></ProtectedRoute>} />
          <Route path="/teams" element={<ProtectedRoute><TeamsPage /></ProtectedRoute>} />
          <Route path="/members" element={<ProtectedRoute><MembersPage /></ProtectedRoute>} />
          <Route path="/evaluation" element={<ProtectedRoute><EvaluationPage /></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
          <Route path="/decision" element={<ProtectedRoute><DecisionPage /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  )
}

// ---- controlador que decide qué renderizar ----
function AppController() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div style={{ padding: 40, color: 'white' }}>Cargando...</div>
  }

  // sin usuario → SOLO muestra login y register
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* si intenta entrar a otra ruta → redirige a login */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    )
  }

  // usuario presente → mostrar app real con AppProvider
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}

// ---- app principal ----
export default function App() {
  return (
    <AuthProvider>
      <AppController />
    </AuthProvider>
  )
}
