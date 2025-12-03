import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function TeamsPage(){
  const { teams, addTeam, deleteTeam, isAdminUser, selectedUserId, setSelectedUserId, allUsers } = useApp()
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
      <h3>Gestión de Equipos</h3>

      {isAdminUser && (
        <div className="card" style={{marginTop:12, background:'#f0f8ff', borderLeft:'4px solid #007bff'}}>
          <div style={{marginBottom:8}}>
            <label style={{fontWeight:600}}>👤 Admin - Selecciona Usuario:</label>
          </div>
          <select
            value={selectedUserId || ''}
            onChange={(e) => setSelectedUserId(e.target.value || null)}
            style={{width:'100%', padding:'8px', fontSize:'14px'}}
          >
            <option value="">Ver mis propios datos</option>
            {allUsers.map(u => (
              <option key={u.id} value={u.id}>
                {u.full_name || u.email}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="card" style={{marginTop:12}}>
        <div className="form-row">
          <input placeholder="Cliente/Proyecto" value={client} onChange={e=>setClient(e.target.value)} />
          <input placeholder="Descripción" value={desc} onChange={e=>setDesc(e.target.value)} />
          <button className="btn btn-primary" onClick={create}>➕ Crear Equipo</button>
        </div>
      </div>

      <div className="list" style={{marginTop:12}}>
        {teams.length===0 && <div className="card">No hay equipos</div>}
        {teams.map(t=>(
          <div key={t.id} className="card">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div style={{fontWeight:700}}>{t.client}</div>
                <div style={{opacity:0.8}}>{t.description}</div>
              </div>
              <div style={{display:'flex',gap:8}}>
                <button className="btn" onClick={() => navigate(`/members?team=${t.id}`)}>Gestionar</button>
                <button className="btn" onClick={() => { if(window.confirm(`¿Eliminar equipo "${t.client}"?`)) deleteTeam(t.id) }} style={{background:'#dc3545',color:'white'}}>Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
