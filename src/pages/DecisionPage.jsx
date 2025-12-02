import React from 'react'
import { useApp } from '../context/AppContext'
import { useQuery } from '../hooks/useQuery'

export default function DecisionPage(){
  const { teams, getCompetencies } = useApp()
  const query = useQuery()
  const teamId = Number(query.get('team'))
  const memberId = Number(query.get('member'))
  const team = teams.find(t=>t.id===teamId)
  const member = team && team.members.find(m=>m.id===memberId)
  if(!team || !member) return <div className="card">Selecciona miembro válido</div>

  const comps = getCompetencies(member.role)
  const max = comps.length * 5
  const q4 = comps.reduce((s,c)=> s + ((member.evaluations['Q4']||{})[c.id] || 0), 0)

  // Calcular promedio por trimestre (promedio de los 4 trimestres)
  const quarters = ['Q1','Q2','Q3','Q4']
  const quarterScores = quarters.map(q => comps.reduce((s,c)=> s + ((member.evaluations[q]||{})[c.id] || 0), 0))
  const avg = quarterScores.reduce((a,b) => a + b, 0) / 4
  const threshold = member.level === 'jr' ? Math.ceil(max * 0.7) : Math.ceil(max * 0.8)
  let status = 'NO APROBADA'
  if(q4 >= threshold) status = 'PROMOCIÓN APROBADA'
  else if(q4 >= threshold * 0.85) status = 'PROMOCIÓN PENDIENTE'

  return (
    <div>
      <h3>Decisión - {member.name}</h3>
      <div style={{marginTop:12}} className="card">
        <div>Score Q4: {q4}/{max}</div>
        <div>Promedio anual (estimado): {Math.round(avg)}/{max}</div>
        <div>Umbral requerido: {threshold}</div>
        <div style={{marginTop:8,fontWeight:700}}>Estado: {status}</div>
      </div>

      <div style={{marginTop:12}}>
        <button className="btn btn-primary" onClick={()=>{
          const report = generateReport(team, member, comps, q4, avg, threshold)
          const blob = new Blob([report], {type:'text/plain'})
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a'); a.href=url; a.download=`reporte_${member.name.replace(/\s+/g,'_')}.txt`; a.click(); URL.revokeObjectURL(url)
        }}>📄 Exportar Reporte</button>
      </div>
    </div>
  )
}

function generateReport(team, member, comps, q4, avg, threshold){
  let r = ''
  r += `Reporte - ${member.name}\n`
  r += `Equipo: ${team.client} - ${team.description}\n`
  r += `Rol: ${member.role} - Nivel: ${member.level} -> ${member.levelTarget}\n`
  r += `Score Q4: ${q4} / ${comps.length * 5}\n`
  r += `Umbral requerido: ${threshold}\n\n`
  ['Q1','Q2','Q3','Q4'].forEach(q=>{
    r += `${q}: ${comps.map(c=> (member.evaluations[q]||{})[c.id] || 0).join(', ')}\n`
  })
  return r
}
