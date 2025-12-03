import React, {useEffect, useState} from 'react'
import { useApp } from '../context/AppContext'
import { useNavigate, useLocation } from 'react-router-dom'

export default function MembersPage(){
  const { teams, addMember, deleteMember } = useApp()
  const navigate = useNavigate()
  const loc = useLocation()
  const params = new URLSearchParams(loc.search)
  const teamId = Number(params.get('team')) || (teams[0] && teams[0].id)
  const team = teams.find(t=>t.id===teamId)
  const [name,setName]=useState(''); const [role,setRole]=useState('developer')
  const [level,setLevel]=useState('jr'); const [levelTarget,setLevelTarget]=useState('mid'); const [email,setEmail]=useState('')

  useEffect(()=>{ if(!team && teams.length>0) navigate('/teams') },[teams,navigate,team])

  const submit = async () => {
    if(!team) return alert('Selecciona un equipo')
    if(!name || !email) return alert('Completa nombre y email')
    try {
      await addMember(team.id, { name, role, level, levelTarget, email })
      setName(''); setEmail('')
      alert('✅ Miembro agregado exitosamente')
    } catch (error) {
      console.error('Error in submit:', error)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: '0 0 8px 0', color: '#003366', fontSize: 28, fontWeight: 700 }}>
          👥 Gestión de Miembros
        </h1>
        <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>
          Añade y gestiona los miembros de tu equipo
        </p>
      </div>

      {!team && (
        <div className="card" style={{ padding: 24, textAlign: 'center', color: '#6b7280' }}>
          📭 Selecciona un equipo en la sección de Equipos para continuar
        </div>
      )}

      {team && (
        <>
          <div className="card" style={{ marginBottom: 20, padding: 20, background: '#eff6ff', borderLeft: '4px solid #0066ff' }}>
            <div style={{ color: '#0066ff', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
              EQUIPO ACTUAL
            </div>
            <div style={{ fontWeight: 700, fontSize: 18, color: '#003366', marginBottom: 4 }}>
              {team.client}
            </div>
            <div style={{ opacity: 0.7, fontSize: 14 }}>
              {team.description || 'Sin descripción'}
            </div>
          </div>

          <div className="card" style={{ marginBottom: 20, padding: 20 }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#003366', fontSize: 18 }}>
              ➕ Agregar Nuevo Miembro
            </h3>
            <div className="form-row">
              <input
                placeholder="Nombre completo"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ borderColor: '#0066ff' }}
              />
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                style={{ borderColor: '#0066ff' }}
              >
                <option value="developer">Desarrollador</option>
                <option value="qa">QA</option>
                <option value="productowner">Product Owner</option>
                <option value="scrummaster">Scrum Master</option>
                <option value="uxui">UX/UI</option>
                <option value="deliverymanager">Delivery Manager</option>
              </select>
              <select
                value={level}
                onChange={e => setLevel(e.target.value)}
                style={{ borderColor: '#0066ff' }}
              >
                <option value="jr">Junior</option>
                <option value="mid">Mid</option>
                <option value="sr">Senior</option>
              </select>
              <select
                value={levelTarget}
                onChange={e => setLevelTarget(e.target.value)}
                style={{ borderColor: '#0066ff' }}
              >
                <option value="mid">Mid</option>
                <option value="sr">Senior</option>
              </select>
              <input
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ borderColor: '#0066ff' }}
              />
            </div>
            <div style={{ marginTop: 12 }}>
              <button className="btn btn-primary" onClick={submit} style={{ width: '100%' }}>
                ➕ Agregar Miembro
              </button>
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <h2 style={{ margin: '0 0 16px 0', color: '#003366', fontSize: 22, fontWeight: 700 }}>
              📋 Miembros del Equipo ({team.members.length})
            </h2>
            <div className="list">
              {team.members.length === 0 && (
                <div className="card" style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>
                  👤 No hay miembros en este equipo aún
                </div>
              )}
              {team.members.map(m => (
                <div key={m.id} className="card" style={{ padding: 20, marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 16, color: '#003366', marginBottom: 4 }}>
                        {m.name}
                      </div>
                      <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 6 }}>
                        <span style={{ fontWeight: 600, color: '#0066ff' }}>{m.role}</span>
                        {' • '}
                        <span>Nivel: {m.level}</span>
                        {' • '}
                        <span>Meta: {m.level_target}</span>
                      </div>
                      <div style={{ fontSize: 12, color: '#9ca3af' }}>
                        ✉️ {m.email}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <button
                        className="btn"
                        onClick={() => navigate(`/evaluation?team=${team.id}&member=${m.id}`)}
                        style={{ background: '#0066ff', color: 'white', whiteSpace: 'nowrap' }}
                      >
                        📊 Evaluar
                      </button>
                      <button
                        className="btn"
                        onClick={() => {
                          if (window.confirm(`¿Eliminar miembro "${m.name}"?`)) deleteMember(team.id, m.id)
                        }}
                        style={{ background: '#dc3545', color: 'white', whiteSpace: 'nowrap' }}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
