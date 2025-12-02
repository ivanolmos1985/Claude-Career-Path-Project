import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function TeamsPage(){
  const { teams, addTeam, deleteTeam } = useApp()
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
