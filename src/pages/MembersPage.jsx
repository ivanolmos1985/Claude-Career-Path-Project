import React, {useEffect, useState} from 'react'
import { useApp } from '../context/AppContext'
import { useNavigate, useLocation } from 'react-router-dom'
import Modal from '../components/Modal'
import useModal from '../hooks/useModal'

export default function MembersPage(){
  const { teams, addMember, updateMember, deleteMember } = useApp()
  const navigate = useNavigate()
  const loc = useLocation()
  const params = new URLSearchParams(loc.search)
  const teamId = Number(params.get('team')) || (teams[0] && teams[0].id)
  const team = teams.find(t=>t.id===teamId)
  const [name,setName]=useState(''); const [role,setRole]=useState('developer')
  const [level,setLevel]=useState('jr'); const [levelTarget,setLevelTarget]=useState('mid'); const [email,setEmail]=useState('')
  const [memberToEdit, setMemberToEdit] = useState(null)
  const [memberToDelete, setMemberToDelete] = useState(null)
  const addModal = useModal()
  const editModal = useModal()
  const deleteModal = useModal()

  useEffect(()=>{ if(!team && teams.length>0) navigate('/teams') },[teams,navigate,team])

  const handleAddMember = async () => {
    if(!team) return alert('Selecciona un equipo')
    if(!name || !email) return alert('Completa nombre y email')
    try {
      await addMember(team.id, { name, role, level, levelTarget, email })
      setName(''); setEmail('')
      setRole('developer'); setLevel('jr'); setLevelTarget('mid')
      addModal.close()
    } catch (error) {
      console.error('Error in submit:', error)
    }
  }

  const handleEditClick = (member) => {
    setMemberToEdit(member)
    setName(member.name)
    setRole(member.role)
    setLevel(member.level)
    setLevelTarget(member.level_target)
    setEmail(member.email)
    editModal.open()
  }

  const handleEditConfirm = async () => {
    if(!name || !email || !memberToEdit) return
    try {
      const patch = {
        name,
        role,
        level,
        level_target: levelTarget,
        email
      }
      await updateMember(team.id, memberToEdit.id, patch)
      setName(''); setEmail('')
      setRole('developer'); setLevel('jr'); setLevelTarget('mid')
      setMemberToEdit(null)
      editModal.close()
    } catch (error) {
      console.error('Error updating member:', error)
    }
  }

  const handleDeleteClick = (member) => {
    setMemberToDelete(member)
    deleteModal.open()
  }

  const handleConfirmDelete = () => {
    if(memberToDelete) {
      deleteMember(team.id, memberToDelete.id)
      deleteModal.close()
      setMemberToDelete(null)
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

          <button
            className="btn btn-primary"
            onClick={addModal.open}
            style={{ marginBottom: 20 }}
          >
            ➕ Agregar Nuevo Miembro
          </button>

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
                        onClick={() => handleEditClick(m)}
                        style={{ background: '#f59e0b', color: 'white', whiteSpace: 'nowrap' }}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className="btn"
                        onClick={() => handleDeleteClick(m)}
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

          {/* Modal Agregar Miembro */}
          <Modal
            isOpen={addModal.isOpen}
            title="➕ Agregar Nuevo Miembro"
            onClose={addModal.close}
            onConfirm={handleAddMember}
            confirmText="Agregar"
            cancelText="Cancelar"
          >
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#003366' }}>
                Nombre Completo
              </label>
              <input
                placeholder="Nombre del miembro"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ borderColor: '#0066ff', marginBottom: 12 }}
              />

              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#003366' }}>
                Rol
              </label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                style={{ borderColor: '#0066ff', marginBottom: 12 }}
              >
                <option value="developer">Desarrollador</option>
                <option value="qa">QA</option>
                <option value="productowner">Product Owner</option>
                <option value="scrummaster">Scrum Master</option>
                <option value="uxui">UX/UI</option>
                <option value="deliverymanager">Delivery Manager</option>
              </select>

              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#003366' }}>
                Nivel Actual
              </label>
              <select
                value={level}
                onChange={e => setLevel(e.target.value)}
                style={{ borderColor: '#0066ff', marginBottom: 12 }}
              >
                <option value="jr">Junior</option>
                <option value="mid">Mid</option>
                <option value="sr">Senior</option>
              </select>

              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#003366' }}>
                Meta de Nivel
              </label>
              <select
                value={levelTarget}
                onChange={e => setLevelTarget(e.target.value)}
                style={{ borderColor: '#0066ff', marginBottom: 12 }}
              >
                <option value="mid">Mid</option>
                <option value="sr">Senior</option>
              </select>

              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#003366' }}>
                Email
              </label>
              <input
                placeholder="email@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ borderColor: '#0066ff' }}
              />
            </div>
          </Modal>

          {/* Modal Editar Miembro */}
          <Modal
            isOpen={editModal.isOpen}
            title="✏️ Editar Miembro"
            onClose={editModal.close}
            onConfirm={handleEditConfirm}
            confirmText="Guardar Cambios"
            cancelText="Cancelar"
          >
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#003366' }}>
                Nombre Completo
              </label>
              <input
                placeholder="Nombre del miembro"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ borderColor: '#f59e0b', marginBottom: 12 }}
              />

              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#003366' }}>
                Rol
              </label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                style={{ borderColor: '#f59e0b', marginBottom: 12 }}
              >
                <option value="developer">Desarrollador</option>
                <option value="qa">QA</option>
                <option value="productowner">Product Owner</option>
                <option value="scrummaster">Scrum Master</option>
                <option value="uxui">UX/UI</option>
                <option value="deliverymanager">Delivery Manager</option>
              </select>

              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#003366' }}>
                Nivel Actual
              </label>
              <select
                value={level}
                onChange={e => setLevel(e.target.value)}
                style={{ borderColor: '#f59e0b', marginBottom: 12 }}
              >
                <option value="jr">Junior</option>
                <option value="mid">Mid</option>
                <option value="sr">Senior</option>
              </select>

              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#003366' }}>
                Meta de Nivel
              </label>
              <select
                value={levelTarget}
                onChange={e => setLevelTarget(e.target.value)}
                style={{ borderColor: '#f59e0b', marginBottom: 12 }}
              >
                <option value="mid">Mid</option>
                <option value="sr">Senior</option>
              </select>

              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#003366' }}>
                Email
              </label>
              <input
                placeholder="email@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ borderColor: '#f59e0b' }}
              />
            </div>
          </Modal>

          {/* Modal Confirmar Eliminar Miembro */}
          <Modal
            isOpen={deleteModal.isOpen}
            title="⚠️ Eliminar Miembro"
            onClose={deleteModal.close}
            onConfirm={handleConfirmDelete}
            confirmText="Eliminar"
            cancelText="Cancelar"
            isDanger={true}
          >
            <div>
              <p style={{ margin: 0, color: '#374151', lineHeight: 1.6 }}>
                ¿Está seguro de que desea eliminar a <strong>"{memberToDelete?.name}"</strong>?
              </p>
              <p style={{ margin: '12px 0 0 0', color: '#6b7280', fontSize: 13 }}>
                Esta acción no se puede deshacer. Se eliminarán todas las evaluaciones asociadas.
              </p>
            </div>
          </Modal>
        </>
      )}
    </div>
  )
}
