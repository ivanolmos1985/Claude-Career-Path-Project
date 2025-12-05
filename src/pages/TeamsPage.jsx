import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Modal from '../components/Modal'
import useModal from '../hooks/useModal'
import CompetencyManager from '../components/CompetencyManager'
import { Button, Card, Input, Badge } from '../components/ui'
import { BiBuildings, BiPlus, BiBook, BiPencil, BiTrash } from 'react-icons/bi'

export default function TeamsPage(){
  const { teams, addTeam, updateTeam, deleteTeam, isAdminUser, selectedUserId, setSelectedUserId, allUsersForAdmin } = useApp()
  const navigate = useNavigate()
  const createModal = useModal()
  const editModal = useModal()
  const deleteModal = useModal()
  const competencyModal = useModal()
  const [client, setClient] = useState('')
  const [desc, setDesc] = useState('')
  const [teamToEdit, setTeamToEdit] = useState(null)
  const [teamToDelete, setTeamToDelete] = useState(null)
  const [selectedTeamForCompetencies, setSelectedTeamForCompetencies] = useState(null)

  const handleCreate = () => {
    if(!client) return
    addTeam({ client, description: desc })
    setClient('')
    setDesc('')
    createModal.close()
  }

  const handleEditClick = (team) => {
    setTeamToEdit(team)
    setClient(team.client)
    setDesc(team.description || '')
    editModal.open()
  }

  const handleEditConfirm = () => {
    if(!client || !teamToEdit) return
    updateTeam(teamToEdit.id, { client, description: desc })
    setClient('')
    setDesc('')
    setTeamToEdit(null)
    editModal.close()
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
      {/* Page Header */}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ margin: '0 0 8px 0', color: 'var(--color-neutral-900)', fontSize: 28, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <BiBuildings size={32} style={{ color: '#6366F1' }} /> Gestión de Equipos
          </h1>
          <p style={{ margin: 0, color: 'var(--color-neutral-600)', fontSize: 14 }}>
            Crea y gestiona tus equipos de trabajo
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={createModal.open}
        >
          <BiPlus size={18} /> Crear Nuevo Equipo
        </Button>
      </div>

      {/* Admin Mode Selector */}
      {isAdminUser && (
        <Card
          style={{
            marginBottom: 16,
            background: 'var(--color-primary-50)',
            borderLeft: '4px solid var(--color-primary-500)',
          }}
        >
          <div>
            <label style={{ fontWeight: 600, color: 'var(--color-primary-700)', fontSize: 14, display: 'block', marginBottom: 12 }}>
              👤 Modo Admin - Selecciona Usuario:
            </label>
            <select
              value={selectedUserId || ''}
              onChange={(e) => setSelectedUserId(e.target.value || null)}
              style={{
                width: '100%',
                borderColor: 'var(--color-primary-500)',
                maxWidth: 300,
              }}
            >
              <option value="">Ver mis propios datos</option>
              {allUsersForAdmin.map(u => (
                <option key={u.id} value={u.id}>
                  {u.full_name || u.email}
                </option>
              ))}
            </select>
          </div>
        </Card>
      )}

      {/* Teams List */}
      <div style={{ display: 'grid', gap: 16 }}>
        {teams.length === 0 && (
          <Card style={{ textAlign: 'center', padding: 'var(--spacing-xxxl)', color: 'var(--color-neutral-500)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <BiBuildings size={40} style={{ color: '#d1d5db' }} />
              No hay equipos creados
            </div>
          </Card>
        )}
        {teams.map(t => (
          <Card key={t.id} hoverable>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: 16, fontWeight: 700, color: 'var(--color-neutral-900)' }}>
                  {t.client}
                </h3>
                <p style={{ margin: 0, color: 'var(--color-neutral-600)', fontSize: 14 }}>
                  {t.description || 'Sin descripción'}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(`/members?team=${t.id}`)}
                >
                  Gestionar
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSelectedTeamForCompetencies(t)
                    competencyModal.open()
                  }}
                >
                  <BiBook size={16} /> Competencias
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleEditClick(t)}
                >
                  <BiPencil size={16} /> Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteClick(t)}
                >
                  <BiTrash size={16} /> Eliminar
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal Crear Equipo */}
      <Modal
        isOpen={createModal.isOpen}
        title={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><BiPlus size={18} /> Crear Nuevo Equipo</span>}
        onClose={createModal.close}
        onConfirm={handleCreate}
        confirmText="Crear"
        cancelText="Cancelar"
      >
        <Input
          label="Cliente/Proyecto"
          placeholder="Nombre del cliente o proyecto"
          value={client}
          onChange={e => setClient(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <Input
          label="Descripción (Opcional)"
          placeholder="Descripción del equipo"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          as="textarea"
        />
      </Modal>

      {/* Modal Editar Equipo */}
      <Modal
        isOpen={editModal.isOpen}
        title={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><BiPencil size={18} /> Editar Equipo</span>}
        onClose={editModal.close}
        onConfirm={handleEditConfirm}
        confirmText="Guardar Cambios"
        cancelText="Cancelar"
      >
        <Input
          label="Cliente/Proyecto"
          placeholder="Nombre del cliente o proyecto"
          value={client}
          onChange={e => setClient(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <Input
          label="Descripción (Opcional)"
          placeholder="Descripción del equipo"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          as="textarea"
        />
      </Modal>

      {/* Modal Confirmar Eliminar */}
      <Modal
        isOpen={deleteModal.isOpen}
        title={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><BiTrash size={18} style={{ color: '#ef4444' }} /> Eliminar Equipo</span>}
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

      {/* Competency Manager Modal */}
      {selectedTeamForCompetencies && (
        <CompetencyManager
          teamId={selectedTeamForCompetencies.id}
          isOpen={competencyModal.isOpen}
          onClose={competencyModal.close}
        />
      )}
    </div>
  )
}
