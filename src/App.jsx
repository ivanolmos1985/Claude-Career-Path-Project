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

// ---- Componente de Header con Navegación Integrada ----
function Header() {
  const { user, signOut } = useAuth()
  const { isAdminUser, allUsers } = useApp()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const tabs = [
    { label: 'Dashboard', path: '/teams' },
    { label: 'Manager Summary', path: '/members' },
    { label: 'Accounts', path: '/evaluation' },
    { label: 'Analytics', path: '/progress' },
    { label: 'Year Comparison', path: '/decision' }
  ]

  // Generar avatares para usuarios conectados (primeras letras)
  const getAvatarColor = (index) => {
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b']
    return colors[index % colors.length]
  }

  const getInitials = (email) => {
    return email?.split('@')[0]?.substring(0, 2).toUpperCase() || 'U'
  }

  return (
    <div className="header-new">
      {/* SECCIÓN IZQUIERDA: Logo + Título */}
      <div className="header-left">
        <img src="/arkus-logo.webp" alt="Arkusnexus" style={{ height: 32 }} />
        <div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#003366' }}>
            Delivery Management Dashboard
          </h1>
          <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>
            Track account health and team performance
          </p>
        </div>
      </div>

      {/* SECCIÓN CENTRAL: Tabs de Navegación */}
      <div className="header-tabs">
        {tabs.map(tab => (
          <button
            key={tab.path}
            className={`header-tab ${pathname === tab.path ? 'active' : ''}`}
            onClick={() => navigate(tab.path)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SECCIÓN DERECHA: Usuarios conectados + User Info + Logout */}
      <div className="header-right">
        {/* Usuarios conectados (avatares) */}
        <div className="online-users">
          <div className="avatar-group">
            {allUsers.slice(0, 3).map((u, idx) => (
              <div
                key={u.id}
                className="avatar"
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
                className="avatar"
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
        </div>

        {/* Información del usuario actual */}
        <div className="user-current">
          <div className="user-name">{user?.email?.split('@')[0]}</div>
          <div className="user-email">{user?.email}</div>
          {isAdminUser && (
            <span className="admin-badge-small">ADMIN</span>
          )}
        </div>

        {/* Botón Logout */}
        <button
          className="btn-logout"
          onClick={signOut}
          title="Logout"
        >
          ➜ Logout
        </button>
      </div>
    </div>
  )
}

// ---- renderiza la app completa SOLO si hay usuario ----
function AppShell() {
  return (
    <div className="container-new">
      <ScrollToTop />

      {/* HEADER TODO EN UNO */}
      <Header />

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
