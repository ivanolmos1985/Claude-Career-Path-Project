import React from 'react'
import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '../hooks/useQuery'

export default function ProgressPage(){
  const { teams, getCompetencies } = useApp()
  const query = useQuery()
  const teamId = Number(query.get('team'))
  const memberId = Number(query.get('member'))
  const team = teams.find(t=>t.id===teamId)
  const member = team && team.members.find(m=>m.id===memberId)
  const navigate = useNavigate()
  if(!team || !member) return <div className="card">Selecciona miembro válido</div>

  const comps = getCompetencies(member.role)
  const calcQuarterScore = (q) => comps.reduce((s,c)=> s + ((member.evaluations[q]||{})[c.id] || 0), 0)
  const maxScore = comps.length * 5

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: '0 0 8px 0', color: '#003366', fontSize: 28, fontWeight: 700 }}>
          📈 Progreso de Evaluación
        </h1>
        <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>
          <span style={{ fontWeight: 600, color: '#0066ff' }}>{member.name}</span>
        </p>
      </div>

      <div className="card" style={{ marginBottom: 20, padding: 20, background: '#eff6ff', borderLeft: '4px solid #0066ff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#0066ff', marginBottom: 4, textTransform: 'uppercase' }}>
              Objetivo de Desarrollo
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#003366' }}>
              {member.level} → <span style={{ color: '#0066ff' }}>{member.level_target}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        {['Q1', 'Q2', 'Q3', 'Q4'].map(q => {
          const sc = calcQuarterScore(q)
          const perc = Math.round((sc / maxScore) * 100)
          const barColor = perc >= 70 ? '#10b981' : perc >= 40 ? '#f59e0b' : '#dc3545'
          return (
            <div key={q} className="card" style={{ marginBottom: 12, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#003366' }}>{q}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0066ff' }}>
                  {sc}/{maxScore} ({perc}%)
                </div>
              </div>
              <div style={{ height: 8, background: '#e5e7eb', borderRadius: 4, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    background: barColor,
                    width: `${perc}%`,
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #e5e7eb', display: 'flex', gap: 12 }}>
        <button
          className="btn"
          onClick={() => navigate(`/evaluation?team=${team.id}&member=${member.id}`)}
          style={{ background: '#6b7280', color: 'white', padding: '10px 16px' }}
        >
          ← Volver a Evaluar
        </button>
        <button
          className="btn"
          onClick={() => navigate(`/decision?team=${team.id}&member=${member.id}`)}
          style={{ background: '#0066ff', color: 'white', padding: '10px 16px', flex: 1 }}
        >
          Ver Decisión →
        </button>
      </div>
    </div>
  )
}
