import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Modal from '../components/Modal'
import useModal from '../hooks/useModal'

export default function TeamsPage(){
  const { teams, addTeam, deleteTeam, isAdminUser, selectedUserId, setSelectedUserId, allUsersForAdmin } = useApp()
  const navigate = useNavigate()
  const createModal = useModal()
  const deleteModal = useModal()
  const [client, setClient] = useState('')
  const [desc, setDesc] = useState('')
  const [teamToDelete, setTeamToDelete] = useState(null)

  const handleCreate = () => {
    if(!client) return
    addTeam({ client, description: desc })
    setClient('')
    setDesc('')
    createModal.close()
  }

  const handleDeleteClick = (team) => {
    setTeamToDelete(team)
    deleteModal.open()
  }

  const handleConfirmDelete = () => {
    if(teamToDelete) {
      deleteTeam(teamToDelete.id)
      deleteModal.close()
      setTeamToDelete(null)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: '0 0 8px 0', color: '#003366', fontSize: 28, fontWeight: 700 }}>
          🏢 Gestión de Equipos
        </h1>
        <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>
          Crea y gestiona tus equipos de trabajo
        </p>
      </div>

      {isAdminUser && (
        <div className="card" style={{ marginBottom: 20, background: '#eff6ff', borderLeft: '4px solid #0066ff', padding: 20 }}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontWeight: 600, color: '#0066ff', fontSize: 15 }}>
              👤 Modo Admin - Selecciona Usuario:
            </label>
          </div>
          <select
            value={selectedUserId || ''}
            onChange={(e) => setSelectedUserId(e.target.value || null)}
            style={{ width: '100%', padding: 10, fontSize: '14px', borderColor: '#0066ff' }}
          >
            <option value="">Ver mis propios datos</option>
            {allUsersForAdmin.map(u => (
              <option key={u.id} value={u.id}>
                {u.full_name || u.email}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        className="btn btn-primary"
        onClick={createModal.open}
        style={{ marginBottom: 20 }}
      >
        ➕ Crear Nuevo Equipo
      </button>

      <div className="list">
        {teams.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>
            📭 No hay equipos creados
          </div>
        )}
        {teams.map(t => (
          <div key={t.id} className="card" style={{ padding: 20, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#003366', marginBottom: 4 }}>
                  {t.client}
                </div>
                <div style={{ opacity: 0.7, fontSize: 14 }}>
                  {t.description || 'Sin descripción'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="btn"
                  onClick={() => navigate(`/members?team=${t.id}`)}
                  style={{ background: '#0066ff', color: 'white' }}
                >
                  Gestionar
                </button>
                <button
                  className="btn"
                  onClick={() => handleDeleteClick(t)}
                  style={{ background: '#dc3545', color: 'white' }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Crear Equipo */}
      <Modal
        isOpen={createModal.isOpen}
        title="➕ Crear Nuevo Equipo"
        onClose={createModal.close}
        onConfirm={handleCreate}
        confirmText="Crear"
        cancelText="Cancelar"
      >
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#003366' }}>
            Cliente/Proyecto
          </label>
          <input
            placeholder="Nombre del cliente o proyecto"
            value={client}
            onChange={e => setClient(e.target.value)}
            style={{ borderColor: '#0066ff' }}
          />
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#003366' }}>
            Descripción (Opcional)
          </label>
          <textarea
            placeholder="Descripción del equipo"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            rows={3}
            style={{ borderColor: '#0066ff', resize: 'none' }}
          />
        </div>
      </Modal>

      {/* Modal Confirmar Eliminar */}
      <Modal
        isOpen={deleteModal.isOpen}
        title="⚠️ Eliminar Equipo"
        onClose={deleteModal.close}
        onConfirm={handleConfirmDelete}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isDanger={true}
      >
        <div>
          <p style={{ margin: 0, color: '#374151', lineHeight: 1.6 }}>
            ¿Está seguro de que desea eliminar el equipo <strong>"{teamToDelete?.client}"</strong>?
          </p>
          <p style={{ margin: '12px 0 0 0', color: '#6b7280', fontSize: 13 }}>
            Esta acción no se puede deshacer. Se eliminarán todos los miembros y evaluaciones asociadas.
          </p>
        </div>
      </Modal>
    </div>
  )
}
