import React, {useEffect, useState} from 'react'
import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '../hooks/useQuery'

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

  const setRating = (q, compId, rating) => {
    const patch = { evaluations: {...member.evaluations, [q]: {...member.evaluations[q], [compId]: rating}} }
    updateMember(team.id, member.id, patch)
  }

  const setEvidence = (q, compId, text) => {
    const patch = { evidence: {...member.evidence, [q]: {...member.evidence[q], [compId]: text}} }
    updateMember(team.id, member.id, patch)
  }

  const saveAndBack = () => {
    alert('Evaluación guardada')
    navigate('/progress?team='+team.id+'&member='+member.id)
  }

  return (
    <div>
      <h3>Evaluando: {member.name}</h3>
      <div style={{marginTop:10}} className="card">
        <div style={{display:'flex',gap:8}}>
          {['Q1','Q2','Q3','Q4'].map(q=>(
            <button key={q} className={'btn'+(quarter===q?' btn-primary':'')} onClick={()=>setQuarter(q)}>{q}</button>
          ))}
        </div>
      </div>

      <div style={{marginTop:12}}>
        {comps.map(c=>(
          <div key={c.id} className="card" style={{marginBottom:8}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div><strong>{c.name}</strong><div style={{opacity:0.7,fontSize:13}}>Peso: {c.weight}%</div></div>
              <div>
                {[1,2,3,4,5].map(r=>(
                  <button key={r} className={'btn'+((member.evaluations[quarter]||{})[c.id]===r ? ' btn-primary' : '')}
                    onClick={()=>setRating(quarter,c.id,r)} style={{marginLeft:6}}>{r}</button>
                ))}
              </div>
            </div>
            <textarea placeholder="Evidencia..." value={(member.evidence[quarter]||{})[c.id] || ''} onChange={e=>setEvidence(quarter,c.id,e.target.value)} style={{marginTop:8,width:'100%',padding:8,borderRadius:6,border:'1px solid #ccc',fontFamily:'inherit',fontSize:14,minHeight:80,resize:'vertical'}} />
          </div>
        ))}
      </div>

      <div style={{marginTop:12}}>
        <button className="btn btn-success" onClick={saveAndBack}>💾 Guardar Evaluación</button>
      </div>
    </div>
  )
}
