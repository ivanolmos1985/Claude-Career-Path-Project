import React, { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import Modal from './Modal'
import useModal from '../hooks/useModal'

export default function TaskManager({ competency, teamId, isOpen, onClose }) {
  const { addTask, updateTask, deleteTask, getTasksForCompetency } = useApp()
  const createModal = useModal()
  const editModal = useModal()

  const [tasks, setTasks] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedTask, setSelectedTask] = useState(null)
  const [loading, setLoading] = useState(false)

  // Load tasks for the competency
  useEffect(() => {
    if (isOpen && competency) {
      loadTasks()
    }
  }, [isOpen, competency])

  const loadTasks = async () => {
    try {
      setLoading(true)
      const data = await getTasksForCompetency(competency.id)
      setTasks(data || [])
    } catch (error) {
      console.error('Error loading tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!name) return
    try {
      setLoading(true)
      await addTask(competency.id, {
        name,
        description,
        teamId
      })
      setName('')
      setDescription('')
      createModal.close()
      await loadTasks()
    } catch (error) {
      console.error('Error creating task:', error)
      alert('Error creating task: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = (task) => {
    setSelectedTask(task)
    setName(task.name)
    setDescription(task.description || '')
    editModal.open()
  }

  const handleEditConfirm = async () => {
    if (!name || !selectedTask) return
    try {
      setLoading(true)
      await updateTask(selectedTask.id, { name, description })
      setName('')
      setDescription('')
      setSelectedTask(null)
      editModal.close()
      await loadTasks()
    } catch (error) {
      console.error('Error updating task:', error)
      alert('Error updating task: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = async (task) => {
    if (!window.confirm(`¿Eliminar tarea "${task.name}"?`)) return
    try {
      setLoading(true)
      await deleteTask(task.id)
      await loadTasks()
    } catch (error) {
      console.error('Error deleting task:', error)
      alert('Error deleting task: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !competency) return null

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
      zIndex: 1001
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
          <h2 style={{ margin: 0, color: '#003366' }}>📋 Tareas - {competency.name}</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#999'
            }}
          >
            ✕
          </button>
        </div>

        <button
          onClick={createModal.open}
          disabled={loading}
          style={{
            background: '#10b981',
            color: 'white',
            padding: '10px 16px',
            borderRadius: '6px',
            border: 'none',
            marginBottom: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          ➕ Nueva Tarea
        </button>

        <div>
          {tasks.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
              No hay tareas aún. Crea una nueva.
            </p>
          ) : (
            tasks.map((task, idx) => (
              <div
                key={task.id}
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
                    {idx + 1}. {task.name}
                  </div>
                  {task.description && (
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      {task.description}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => handleEditClick(task)}
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
                      opacity: loading ? 0.6 : 1
                    }}
                  >
                    ✏️ Editar
                  </button>

                  <button
                    onClick={() => handleDeleteClick(task)}
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
                      opacity: loading ? 0.6 : 1
                    }}
                  >
                    🗑️ Eliminar
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
        title="➕ Nueva Tarea"
        onClose={createModal.close}
        onConfirm={handleCreate}
        confirmText="Crear"
        cancelText="Cancelar"
      >
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#003366' }}>
            Nombre de la Tarea
          </label>
          <input
            placeholder="Ej: Dominio de C# y .NET Framework"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ borderColor: '#0066ff', marginBottom: 12, width: '100%' }}
          />

          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#003366' }}>
            Descripción (Opcional)
          </label>
          <textarea
            placeholder="Descripción de la tarea"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            style={{ borderColor: '#0066ff', marginBottom: 12, width: '100%', resize: 'none' }}
          />
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editModal.isOpen}
        title="✏️ Editar Tarea"
        onClose={editModal.close}
        onConfirm={handleEditConfirm}
        confirmText="Guardar"
        cancelText="Cancelar"
      >
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#003366' }}>
            Nombre de la Tarea
          </label>
          <input
            placeholder="Ej: Dominio de C# y .NET Framework"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ borderColor: '#0066ff', marginBottom: 12, width: '100%' }}
          />

          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#003366' }}>
            Descripción (Opcional)
          </label>
          <textarea
            placeholder="Descripción de la tarea"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            style={{ borderColor: '#0066ff', marginBottom: 12, width: '100%', resize: 'none' }}
          />
        </div>
      </Modal>
    </div>
  )
}
