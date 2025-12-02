import React, { useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
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

// ---- renderiza la app completa SOLO si hay usuario ----
function AppShell() {
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="container">
      <ScrollToTop />

      {/* HEADER */}
      <div className="header">
        <h2 style={{ margin: 0 }}>Career Path System</h2>

        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/teams">
            <button className="btn btn-primary">Equipos</button>
          </Link>
          <button className="btn" onClick={handleSignOut} style={{ background: '#dc3545', color: 'white' }}>Cerrar sesión</button>
        </div>
      </div>

      {/* LAYOUT */}
      <div style={{ display: 'flex' }}>

        {/* SIDEBAR */}
        <div className="sidebar" style={{ minHeight: 400 }}>
          <div style={{ fontWeight: 700, marginBottom: 12 }}>Navegación</div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link to="/teams">🏢 Equipos</Link>
            <Link to="/members">👥 Miembros</Link>
            <Link to="/evaluation">📊 Evaluación</Link>
            <Link to="/progress">📈 Progreso</Link>
            <Link to="/decision">✅ Decisión</Link>
          </nav>
        </div>

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
