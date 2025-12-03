import React, {useEffect, useState} from 'react'
import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '../hooks/useQuery'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default function EvaluationPage(){
  const { teams, updateMember, getCompetencies } = useApp()
  const query = useQuery()
  const teamId = Number(query.get('team'))
  const memberId = Number(query.get('member'))
  const team = teams.find(t=>t.id===teamId)
  const member = team && team.members.find(m=>m.id===memberId)
  const [quarter,setQuarter]=useState('Q1')
  const navigate = useNavigate()

  useEffect(()=>{ if(!team || !member) navigate('/teams') },[team,member,navigate])

  if(!team || !member) return null

  const comps = getCompetencies(member.role)

  const setRating = async (q, compId, rating) => {
    try {
      // Actualizar estado local primero para feedback inmediato
      const patch = { evaluations: {...member.evaluations, [q]: {...member.evaluations[q], [compId]: rating}} }
      updateMember(team.id, member.id, patch)

      // Guardar a Supabase
      const { error } = await supabase
        .from('evaluations')
        .upsert({
          member_id: member.id,
          quarter: q,
          competency_id: compId,
          rating: rating
        }, { onConflict: 'member_id,quarter,competency_id' })

      if (error) {
        console.error('Error saving rating:', error)
        alert(`Error al guardar evaluación: ${error.message}`)
      }
    } catch (err) {
      console.error('Error in setRating:', err)
    }
  }

  const setEvidence = async (q, compId, text) => {
    try {
      // Actualizar estado local primero para feedback inmediato
      const patch = { evidence: {...member.evidence, [q]: {...member.evidence[q], [compId]: text}} }
      updateMember(team.id, member.id, patch)

      // Guardar a Supabase
      const { error } = await supabase
        .from('evidence')
        .upsert({
          member_id: member.id,
          quarter: q,
          competency_id: compId,
          description: text
        }, { onConflict: 'member_id,quarter,competency_id' })

      if (error) {
        console.error('Error saving evidence:', error)
        alert(`Error al guardar evidencia: ${error.message}`)
      }
    } catch (err) {
      console.error('Error in setEvidence:', err)
    }
  }

  const saveAndBack = () => {
    alert('Evaluación guardada')
    navigate('/progress?team='+team.id+'&member='+member.id)
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: '0 0 8px 0', color: '#003366', fontSize: 28, fontWeight: 700 }}>
          📊 Evaluación de Competencias
        </h1>
        <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>
          Evaluando a: <span style={{ fontWeight: 600, color: '#0066ff' }}>{member.name}</span>
        </p>
      </div>

      <div className="card" style={{ marginBottom: 20, padding: 16, background: '#eff6ff', borderLeft: '4px solid #0066ff' }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#0066ff', marginBottom: 8, textTransform: 'uppercase' }}>
            Selecciona Trimestre
          </label>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['Q1', 'Q2', 'Q3', 'Q4'].map(q => (
            <button
              key={q}
              className={'btn' + (quarter === q ? ' btn-primary' : '')}
              onClick={() => setQuarter(q)}
              style={{
                background: quarter === q ? '#0066ff' : '#f3f4f6',
                color: quarter === q ? 'white' : '#003366',
                fontWeight: 600,
                padding: '10px 18px',
                flex: '1 1 auto',
                minWidth: 80
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <div>
        {comps.map((c, idx) => (
          <div key={c.id} className="card" style={{ marginBottom: 16, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#003366', marginBottom: 4 }}>
                  {idx + 1}. {c.name}
                </div>
                <div style={{ opacity: 0.7, fontSize: 13, color: '#6b7280' }}>
                  Peso: <span style={{ fontWeight: 600, color: '#0066ff' }}>{c.weight}%</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[1, 2, 3, 4, 5].map(r => (
                  <button
                    key={r}
                    className={'btn' + ((member.evaluations[quarter] || {})[c.id] === r ? ' btn-primary' : '')}
                    onClick={() => setRating(quarter, c.id, r)}
                    style={{
                      padding: '8px 12px',
                      background: (member.evaluations[quarter] || {})[c.id] === r ? '#0066ff' : '#f3f4f6',
                      color: (member.evaluations[quarter] || {})[c.id] === r ? 'white' : '#003366',
                      fontWeight: 600,
                      minWidth: 40,
                      textAlign: 'center'
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              placeholder="Agregar evidencia para esta competencia..."
              value={(member.evidence[quarter] || {})[c.id] || ''}
              onChange={e => setEvidence(quarter, c.id, e.target.value)}
              style={{
                marginTop: 0,
                width: '100%',
                padding: 12,
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                borderColor: '#0066ff',
                fontFamily: 'inherit',
                fontSize: 14,
                minHeight: 80,
                resize: 'vertical',
                fontColor: '#003366'
              }}
            />
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #e5e7eb' }}>
        <button
          className="btn btn-success"
          onClick={saveAndBack}
          style={{
            background: '#10b981',
            color: 'white',
            padding: '12px 24px',
            fontSize: 15,
            fontWeight: 600
          }}
        >
          💾 Guardar y Continuar
        </button>
      </div>
    </div>
  )
}
