import React, { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import Modal from './Modal'
import useModal from '../hooks/useModal'
import TaskManager from './TaskManager'
import { BiBook, BiPlus, BiPencil, BiTrash, BiClipboard, BiX } from 'react-icons/bi'

const ROLES = [
  { id: 'developer', name: 'Desarrollador' },
  { id: 'qa', name: 'QA' },
  { id: 'productowner', name: 'Product Owner' },
  { id: 'scrummaster', name: 'Scrum Master' },
  { id: 'uxui', name: 'UX/UI Designer' },
  { id: 'deliverymanager', name: 'Delivery Manager' }
]

export default function CompetencyManager({ teamId, isOpen, onClose }) {
  const { addCompetency, updateCompetency, deleteCompetency, getCompetenciesFromDB } = useApp()
  const createModal = useModal()
  const editModal = useModal()
  const taskModal = useModal()

  const [competencies, setCompetencies] = useState([])
  const [selectedRole, setSelectedRole] = useState('developer')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [weight, setWeight] = useState(20)
  const [selectedCompetency, setSelectedCompetency] = useState(null)
  const [loading, setLoading] = useState(false)

  // Load competencies for the team and role
  useEffect(() => {
    if (isOpen) {
      loadCompetencies()
    }
  }, [isOpen, teamId, selectedRole])

  const loadCompetencies = async () => {
    try {
      setLoading(true)
      // Get competencies for this team and role
      // Shows base competencies (team_id IS NULL) + team's custom competencies
      const allComps = await getCompetenciesFromDB(teamId, selectedRole)
      setCompetencies(allComps || [])
    } catch (error) {
      console.error('Error loading competencies:', error)
      setCompetencies([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!name || !weight) return
    try {
      setLoading(true)
      // Pass the selected role when creating a custom competency
      await addCompetency(teamId, { name, description, weight, role: selectedRole })
      setName('')
      setDescription('')
      setWeight(20)
      createModal.close()
      await loadCompetencies()
    } catch (error) {
      console.error('Error creating competency:', error)
      alert('Error creating competency: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = (competency) => {
    setSelectedCompetency(competency)
    setName(competency.name)
    setDescription(competency.description || '')
    setWeight(competency.weight || 20)
    editModal.open()
  }

  const handleEditConfirm = async () => {
    if (!name || !selectedCompetency) return
    try {
      setLoading(true)
      await updateCompetency(selectedCompetency.id, { name, description, weight })
      setName('')
      setDescription('')
      setWeight(20)
      setSelectedCompetency(null)
      editModal.close()
      await loadCompetencies()
    } catch (error) {
      console.error('Error updating competency:', error)
      alert('Error updating competency: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = async (competency) => {
    if (!window.confirm(`¿Eliminar competencia "${competency.name}"?`)) return
    try {
      setLoading(true)
      await deleteCompetency(competency.id)
      await loadCompetencies()
    } catch (error) {
      console.error('Error deleting competency:', error)
      alert('Error deleting competency: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleTasksClick = (competency) => {
    setSelectedCompetency(competency)
    taskModal.open()
  }

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#003366', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BiBook size={24} style={{ color: '#6366F1' }} /> Competencias del Equipo
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#999',
              padding: 0,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <BiX size={24} />
          </button>
        </div>

        {/* Role Filter Dropdown */}
        <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <label style={{ fontWeight: 600, color: '#003366', fontSize: '14px', whiteSpace: 'nowrap' }}>
            Filtrar por Rol:
          </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            disabled={loading}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              background: 'white',
              color: '#003366',
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              flex: 1,
              opacity: loading ? 0.6 : 1
            }}
          >
            {ROLES.map(role => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={createModal.open}
          disabled={loading}
          style={{
            background: '#6366F1',
            color: 'white',
            padding: '10px 16px',
            borderRadius: '6px',
            border: 'none',
            marginBottom: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            opacity: loading ? 0.6 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <BiPlus size={18} /> Nueva Competencia
        </button>

        <div>
          {competencies.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
              No hay competencias aún. Crea una nueva.
            </p>
          ) : (
            competencies.map(comp => (
              <div
                key={comp.id}
                style={{
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: '#003366', marginBottom: '4px' }}>
                    {comp.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    Peso: <span style={{ fontWeight: 600, color: '#6366F1' }}>{comp.weight}%</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => handleTasksClick(comp)}
                    disabled={loading}
                    style={{
                      background: '#6366F1',
                      color: 'white',
                      padding: '6px 10px',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 600,
                      opacity: loading ? 0.6 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    title="Gestionar tareas"
                  >
                    <BiClipboard size={14} /> Tareas
                  </button>

                  <button
                    onClick={() => handleEditClick(comp)}
                    disabled={loading}
                    style={{
                      background: '#f59e0b',
                      color: 'white',
                      padding: '6px 10px',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 600,
                      opacity: loading ? 0.6 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    title="Editar competencia"
                  >
                    <BiPencil size={14} /> Editar
                  </button>

                  <button
                    onClick={() => handleDeleteClick(comp)}
                    disabled={loading}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      padding: '6px 10px',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 600,
                      opacity: loading ? 0.6 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    title="Eliminar competencia"
                  >
                    <BiTrash size={14} /> Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={createModal.isOpen}
        title={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><BiPlus size={18} /> Nueva Competencia</span>}
        onClose={createModal.close}
        onConfirm={handleCreate}
        confirmText="Crear"
        cancelText="Cancelar"
      >
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#003366' }}>
            Nombre de la Competencia
          </label>
          <input
            placeholder="Ej: Conocimientos Técnicos"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ borderColor: '#6366F1', marginBottom: 12, width: '100%' }}
          />

          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#003366' }}>
            Descripción (Opcional)
          </label>
          <textarea
            placeholder="Descripción de la competencia"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            style={{ borderColor: '#6366F1', marginBottom: 12, width: '100%', resize: 'none' }}
          />

          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#003366' }}>
            Peso (%) - {weight}%
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={weight}
            onChange={e => setWeight(parseInt(e.target.value))}
            style={{ width: '100%', marginBottom: 12 }}
          />
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editModal.isOpen}
        title={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><BiPencil size={18} /> Editar Competencia</span>}
        onClose={editModal.close}
        onConfirm={handleEditConfirm}
        confirmText="Guardar"
        cancelText="Cancelar"
      >
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#003366' }}>
            Nombre de la Competencia
          </label>
          <input
            placeholder="Ej: Conocimientos Técnicos"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ borderColor: '#6366F1', marginBottom: 12, width: '100%' }}
          />

          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#003366' }}>
            Descripción (Opcional)
          </label>
          <textarea
            placeholder="Descripción de la competencia"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            style={{ borderColor: '#6366F1', marginBottom: 12, width: '100%', resize: 'none' }}
          />

          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#003366' }}>
            Peso (%) - {weight}%
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={weight}
            onChange={e => setWeight(parseInt(e.target.value))}
            style={{ width: '100%', marginBottom: 12 }}
          />
        </div>
      </Modal>

      {/* Task Manager Modal */}
      {selectedCompetency && (
        <TaskManager
          competency={selectedCompetency}
          teamId={teamId}
          isOpen={taskModal.isOpen}
          onClose={taskModal.close}
        />
      )}
    </div>
  )
}
