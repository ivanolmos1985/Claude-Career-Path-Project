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
      <h3>Gestión del Equipo</h3>
      {!team && <div className="card">Selecciona un equipo en Equipos</div>}
      {team && <>
        <div className="card">
          <div style={{fontWeight:700}}>{team.client}</div>
          <div style={{opacity:0.8}}>{team.description}</div>
        </div>

        <div className="card" style={{marginTop:12}}>
          <div className="form-row">
            <input placeholder="Nombre completo" value={name} onChange={e=>setName(e.target.value)} />
            <select value={role} onChange={e=>setRole(e.target.value)}>
              <option value="developer">Desarrollador</option>
              <option value="qa">QA</option>
              <option value="productowner">Product Owner</option>
              <option value="scrummaster">Scrum Master</option>
              <option value="uxui">UX/UI</option>
              <option value="deliverymanager">Delivery Manager</option>
            </select>
            <select value={level} onChange={e=>setLevel(e.target.value)}>
              <option value="jr">Junior</option>
              <option value="mid">Mid</option>
              <option value="sr">Senior</option>
            </select>
            <select value={levelTarget} onChange={e=>setLevelTarget(e.target.value)}>
              <option value="mid">Mid</option>
              <option value="sr">Senior</option>
            </select>
            <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div style={{marginTop:10}}>
            <button className="btn btn-primary" onClick={submit}>➕ Agregar Miembro del Equipo</button>
          </div>
        </div>

        <div style={{marginTop:12}}>
          <h4>Miembros</h4>
          <div className="list">
            {team.members.length===0 && <div className="card">No hay miembros</div>}
            {team.members.map(m=>(
              <div key={m.id} className="card">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <div style={{fontWeight:700}}>{m.name}</div>
                    <div style={{opacity:0.8}}>{m.role} · {m.level}</div>
                    <div style={{fontSize:12,opacity:0.8}}>{m.email}</div>
                  </div>
                  <div style={{display:'flex',gap:8}}>
                    <button className="btn" onClick={() => navigate(`/evaluation?team=${team.id}&member=${m.id}`)}>Evaluar</button>
                    <button className="btn" onClick={() => { if(window.confirm(`¿Eliminar miembro "${m.name}"?`)) deleteMember(team.id, m.id) }} style={{background:'#dc3545',color:'white'}}>Eliminar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>}
    </div>
  )
}
