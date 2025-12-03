import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function TeamsPage(){
  const { teams, addTeam, deleteTeam, isAdminUser, selectedUserId, setSelectedUserId, allUsersForAdmin } = useApp()
  const navigate = useNavigate()
  const [client, setClient] = useState('')
  const [desc, setDesc] = useState('')

  const create = () => {
    if(!client) return alert('Cliente requerido')
    addTeam({ client, description: desc })
    setClient(''); setDesc('')
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: '0 0 8px 0', color: '#003366', fontSize: 28, fontWeight: 700 }}>
          🏢 Gestión de Equipos
        </h1>
        <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>
          Crea y gestiona tus equipos de trabajo
        </p>
      </div>

      {isAdminUser && (
        <div className="card" style={{ marginBottom: 20, background: '#eff6ff', borderLeft: '4px solid #0066ff', padding: 20 }}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontWeight: 600, color: '#0066ff', fontSize: 15 }}>
              👤 Modo Admin - Selecciona Usuario:
            </label>
          </div>
          <select
            value={selectedUserId || ''}
            onChange={(e) => setSelectedUserId(e.target.value || null)}
            style={{ width: '100%', padding: 10, fontSize: '14px', borderColor: '#0066ff' }}
          >
            <option value="">Ver mis propios datos</option>
            {allUsersForAdmin.map(u => (
              <option key={u.id} value={u.id}>
                {u.full_name || u.email}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="card" style={{ marginBottom: 20, padding: 20 }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#003366', fontSize: 18 }}>
          ➕ Crear Nuevo Equipo
        </h3>
        <div className="form-row">
          <input
            placeholder="Cliente/Proyecto"
            value={client}
            onChange={e => setClient(e.target.value)}
            style={{ borderColor: '#0066ff' }}
          />
          <input
            placeholder="Descripción"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            style={{ borderColor: '#0066ff' }}
          />
          <button className="btn btn-primary" onClick={create} style={{ whiteSpace: 'nowrap' }}>
            ➕ Crear
          </button>
        </div>
      </div>

      <div className="list">
        {teams.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>
            📭 No hay equipos creados
          </div>
        )}
        {teams.map(t => (
          <div key={t.id} className="card" style={{ padding: 20, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#003366', marginBottom: 4 }}>
                  {t.client}
                </div>
                <div style={{ opacity: 0.7, fontSize: 14 }}>
                  {t.description || 'Sin descripción'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="btn"
                  onClick={() => navigate(`/members?team=${t.id}`)}
                  style={{ background: '#0066ff', color: 'white' }}
                >
                  Gestionar
                </button>
                <button
                  className="btn"
                  onClick={() => { if (window.confirm(`¿Eliminar equipo "${t.client}"?`)) deleteTeam(t.id) }}
                  style={{ background: '#dc3545', color: 'white' }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
