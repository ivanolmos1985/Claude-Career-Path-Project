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
      <h3>Progreso - {member.name}</h3>
      <div style={{marginTop:12}} className="card">
        <div>Objetivo: {member.level} → {member.levelTarget}</div>
      </div>

      <div style={{marginTop:12}}>
        {['Q1','Q2','Q3','Q4'].map(q=>{
          const sc = calcQuarterScore(q)
          const perc = Math.round((sc / maxScore)*100)
          return <div key={q} className="card" style={{marginBottom:8}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div><strong>{q}</strong></div>
              <div>{sc}/{maxScore} · {perc}%</div>
            </div>
          </div>
        })}
      </div>

      <div style={{marginTop:12}}>
        <button className="btn" onClick={()=>navigate(`/decision?team=${team.id}&member=${member.id}`)}>Ver Decisión</button>
      </div>
    </div>
  )
}
