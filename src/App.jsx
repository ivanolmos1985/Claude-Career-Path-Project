import React, { useEffect, useState, useRef } from 'react'
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

// ---- Componente de Card de Usuarios Conectados (Independiente) ----
function OnlineUsersCard() {
  const { allUsers } = useApp()
  const [isOpen, setIsOpen] = useState(false)
  const cardRef = useRef(null)

  // Generar avatares para usuarios conectados
  const getAvatarColor = (index) => {
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b']
    return colors[index % colors.length]
  }

  const getInitials = (email) => {
    return email?.split('@')[0]?.substring(0, 2).toUpperCase() || 'U'
  }

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="online-users-card" ref={cardRef}>
      {/* CARD CLICKEABLE con Avatares */}
      <button
        className="users-card-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="avatar-group">
          {allUsers.slice(0, 3).map((u, idx) => (
            <div
              key={u.id}
              className="avatar-small"
              style={{
                backgroundColor: getAvatarColor(idx),
                marginLeft: idx > 0 ? '-8px' : 0,
                zIndex: 3 - idx
              }}
              title={u.email}
            >
              {getInitials(u.email)}
            </div>
          ))}
          {allUsers.length > 3 && (
            <div
              className="avatar-small"
              style={{
                backgroundColor: '#d1d5db',
                marginLeft: '-8px',
                zIndex: 0
              }}
            >
              +{allUsers.length - 3}
            </div>
          )}
        </div>
        <span className="online-count">{allUsers.length} Online</span>
      </button>

      {/* DROPDOWN con Lista de Usuarios */}
      {isOpen && (
        <div className="users-dropdown">
          <div className="dropdown-header">
            <span className="dropdown-title">Active Users ({allUsers.length})</span>
          </div>
          <div className="users-list">
            {allUsers.map((u) => (
              <div key={u.id} className="user-item">
                <div
                  className="user-avatar"
                  style={{ backgroundColor: getAvatarColor(allUsers.indexOf(u)) }}
                >
                  {getInitials(u.email)}
                </div>
                <div className="user-info">
                  <div className="user-item-name">
                    {u.full_name || u.email?.split('@')[0]}
                  </div>
                  <div className="user-item-email">{u.email}</div>
                  <div className="user-status">Active now</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ---- Header Solo con Logo + Título ----
function Header() {
  const { user, userProfile, signOut } = useAuth()
  const { isAdminUser } = useApp()

  return (
    <div className="header-main">
      {/* SECCIÓN IZQUIERDA: Logo + Título + Descripción */}
      <div className="header-branding">
        <img src="/arkus-logo.webp" alt="Arkusnexus" style={{ height: 40 }} />
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#003366' }}>
            Delivery Management Dashboard
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#6b7280' }}>
            Track account health and team performance
          </p>
        </div>
      </div>

      {/* SECCIÓN CENTRAL: Card de Usuarios (Independiente) */}
      <OnlineUsersCard />

      {/* SECCIÓN DERECHA: Info Usuario + Logout */}
      <div className="user-info-section">
        {/* Información del usuario actual */}
        <div className="user-profile">
          <div className="user-detail">
            <div className="user-label">Nombre</div>
            <div className="user-value">{userProfile?.full_name || user?.email?.split('@')[0]}</div>
          </div>
          <div className="user-detail">
            <div className="user-label">Email</div>
            <div className="user-value-email">{user?.email}</div>
          </div>
          {isAdminUser && (
            <div className="admin-indicator">ADMIN</div>
          )}
        </div>

        {/* Botón Logout */}
        <button
          className="logout-btn"
          onClick={signOut}
        >
          ➜ Logout
        </button>
      </div>
    </div>
  )
}

// ---- Subheader con Tabs de Navegación ----
function SubHeader() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const tabs = [
    { label: 'Equipos', path: '/teams' },
    { label: 'Miembros', path: '/members' },
    { label: 'Evaluación', path: '/evaluation' },
    { label: 'Progreso', path: '/progress' },
    { label: 'Decisión', path: '/decision' }
  ]

  return (
    <div className="subheader-tabs">
      {tabs.map(tab => (
        <button
          key={tab.path}
          className={`subheader-tab ${pathname === tab.path ? 'active' : ''}`}
          onClick={() => navigate(tab.path)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

// ---- renderiza la app completa SOLO si hay usuario ----
function AppShell() {
  return (
    <div className="container-app">
      <ScrollToTop />

      {/* HEADER PRINCIPAL */}
      <Header />

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
