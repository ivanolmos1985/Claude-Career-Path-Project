import React, { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '../hooks/useQuery'
import { createClient } from '@supabase/supabase-js'
import Modal from '../components/Modal'
import useModal from '../hooks/useModal'
import { BiLineChart, BiPaperclip, BiSave, BiCheckCircle, BiXCircle, BiFile } from 'react-icons/bi'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default function EvaluationPage() {
  const { teams, updateMember, getCompetencies, getTasksForCompetency, setTaskRating, uploadEvidenceFile, getEvidenceFiles } = useApp()
  const query = useQuery()
  const teamId = Number(query.get('team'))
  const memberId = Number(query.get('member'))
  const team = teams.find(t => t.id === teamId)
  const member = team && team.members.find(m => m.id === memberId)

  const [quarter, setQuarter] = useState('Q1')
  const [navigate] = [useNavigate()]
  const [competencies, setCompetencies] = useState([])
  const [competencyTasks, setCompetencyTasks] = useState({}) // { competencyId: [tasks] }
  const [ratings, setRatings] = useState({}) // { taskId: rating }
  const [evidence, setEvidence] = useState({}) // { taskId: [files] }
  const [loading, setLoading] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState({}) // { taskId: boolean }
  const successModal = useModal()

  useEffect(() => {
    if (!team || !member) navigate('/teams')
  }, [team, member, navigate])

  // Load competencies and tasks
  useEffect(() => {
    if (team && member) {
      loadCompetenciesAndTasks()
    }
  }, [team, member, quarter])

  const loadCompetenciesAndTasks = async () => {
    try {
      setLoading(true)
      const comps = getCompetencies(member.role)
      setCompetencies(comps || [])

      // Load tasks for each competency
      const tasksMap = {}
      for (const comp of (comps || [])) {
        const tasks = await getTasksForCompetency(comp.id)
        tasksMap[comp.id] = tasks || []
      }
      setCompetencyTasks(tasksMap)

      // Load existing ratings for this quarter
      const { data: evaluations } = await supabase
        .from('task_evaluations')
        .select('*')
        .eq('member_id', member.id)
        .eq('quarter', quarter)

      if (evaluations) {
        const ratingsMap = {}
        evaluations.forEach(e => {
          ratingsMap[e.task_id] = e.rating
        })
        setRatings(ratingsMap)
      }

      // Load evidence files
      const { data: files } = await supabase
        .from('evidence_files')
        .select('*')
        .eq('task_id', null) // For now, just load task-level files

      if (files) {
        const filesMap = {}
        files.forEach(f => {
          if (!filesMap[f.task_id]) filesMap[f.task_id] = []
          filesMap[f.task_id].push(f)
        })
        setEvidence(filesMap)
      }
    } catch (error) {
      console.error('Error loading competencies and tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRatingChange = async (taskId, rating) => {
    try {
      setRatings(prev => ({ ...prev, [taskId]: rating }))
      // Auto-save to database
      await setTaskRating(member.id, taskId, quarter, rating)
    } catch (error) {
      console.error('Error setting rating:', error)
      alert('Error al guardar calificación: ' + error.message)
    }
  }

  const handleFileUpload = async (taskId, file) => {
    if (!file) return

    try {
      setUploadingFiles(prev => ({ ...prev, [taskId]: true }))

      const uploadedFile = await uploadEvidenceFile(file, {
        memberId: member.id,
        quarter,
        taskId
      })

      setEvidence(prev => ({
        ...prev,
        [taskId]: [...(prev[taskId] || []), uploadedFile]
      }))
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Error al cargar archivo: ' + error.message)
    } finally {
      setUploadingFiles(prev => ({ ...prev, [taskId]: false }))
    }
  }

  const handleDeleteFile = async (taskId, fileId) => {
    try {
      // Delete file
      setEvidence(prev => ({
        ...prev,
        [taskId]: (prev[taskId] || []).filter(f => f.id !== fileId)
      }))
    } catch (error) {
      console.error('Error deleting file:', error)
      alert('Error al eliminar archivo: ' + error.message)
    }
  }

  const calculateCompetencyRating = (competencyId) => {
    const tasks = competencyTasks[competencyId] || []
    if (tasks.length === 0) return 0

    const totalRating = tasks.reduce((sum, task) => {
      return sum + (ratings[task.id] || 0)
    }, 0)

    return (totalRating / tasks.length).toFixed(1)
  }

  const isCompetencyPassed = (competencyId) => {
    return parseFloat(calculateCompetencyRating(competencyId)) >= 7
  }

  const handleSaveSuccess = () => {
    successModal.open()
  }

  const handleConfirmSuccess = () => {
    successModal.close()
    navigate('/progress?team=' + team.id + '&member=' + member.id)
  }

  if (!team || !member) return null

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: '0 0 8px 0', color: '#003366', fontSize: 28, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BiLineChart size={32} style={{ color: '#6366F1' }} /> Evaluación de Competencias
        </h1>
        <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>
          Evaluando a: <span style={{ fontWeight: 600, color: '#6366F1' }}>{member.name}</span>
        </p>
      </div>

      {/* Quarter Selector */}
      <div className="card" style={{ marginBottom: 20, padding: 16, background: '#eff6ff', borderLeft: '4px solid #6366F1' }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6366F1', marginBottom: 8, textTransform: 'uppercase' }}>
          Selecciona Trimestre
        </label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['Q1', 'Q2', 'Q3', 'Q4'].map(q => (
            <button
              key={q}
              className={'btn' + (quarter === q ? ' btn-primary' : '')}
              onClick={() => setQuarter(q)}
              style={{
                background: quarter === q ? '#6366F1' : '#f3f4f6',
                color: quarter === q ? 'white' : '#003366',
                fontWeight: 600,
                padding: '10px 18px',
                flex: '1 1 auto',
                minWidth: 80
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Competencies with Tasks */}
      <div>
        {competencies.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>
            No hay competencias configuradas. Crea competencias en la gestión de equipos.
          </div>
        ) : (
          competencies.map((competency, compIdx) => {
            const tasks = competencyTasks[competency.id] || []
            const competencyRating = calculateCompetencyRating(competency.id)
            const isPassed = isCompetencyPassed(competency.id)

            return (
              <div key={competency.id} className="card" style={{ marginBottom: 24, padding: 20 }}>
                {/* Competency Header */}
                <div style={{ marginBottom: 16, paddingBottom: 12, borderBottom: '2px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16, color: '#003366', marginBottom: 4 }}>
                        {compIdx + 1}. {competency.name}
                      </div>
                      <div style={{ opacity: 0.7, fontSize: 13, color: '#6b7280' }}>
                        Peso: <span style={{ fontWeight: 600, color: '#6366F1' }}>{competency.weight}%</span>
                      </div>
                    </div>
                    <div style={{
                      background: isPassed ? '#d1fae5' : '#fee2e2',
                      color: isPassed ? '#065f46' : '#7f1d1d',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {isPassed ? <BiCheckCircle size={14} /> : <BiXCircle size={14} />}
                        {isPassed ? 'APROBADA' : 'NO APROBADA'}
                      </div>
                      {competencyRating}/10
                    </div>
                  </div>
                </div>

                {/* Tasks */}
                {tasks.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '16px', color: '#999', fontSize: '14px' }}>
                    No hay tareas configuradas para esta competencia
                  </div>
                ) : (
                  tasks.map((task, taskIdx) => {
                    const taskRating = ratings[task.id] || 0
                    const taskPassed = taskRating >= 7

                    return (
                      <div key={task.id} style={{
                        background: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '16px',
                        marginBottom: '12px'
                      }}>
                        {/* Task Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, color: '#003366', marginBottom: '4px' }}>
                              Tarea {taskIdx + 1}: {task.name}
                            </div>
                            {task.description && (
                              <div style={{ fontSize: '13px', color: '#6b7280' }}>
                                {task.description}
                              </div>
                            )}
                          </div>
                          <div style={{
                            background: taskPassed ? '#d1fae5' : '#fee2e2',
                            color: taskPassed ? '#065f46' : '#7f1d1d',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            marginLeft: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            {taskPassed ? <BiCheckCircle size={12} /> : <BiXCircle size={12} />}
                            {taskRating > 0 ? `${taskRating}/10` : '-'}
                          </div>
                        </div>

                        {/* Rating Buttons (1-10) */}
                        <div style={{ display: 'flex', gap: '4px', marginBottom: '12px', flexWrap: 'wrap' }}>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(r => (
                            <button
                              key={r}
                              onClick={() => handleRatingChange(task.id, r)}
                              style={{
                                padding: '8px 10px',
                                background: taskRating === r ? '#6366F1' : '#f3f4f6',
                                color: taskRating === r ? 'white' : '#003366',
                                border: taskRating === r ? '2px solid #6366F1' : '1px solid #e5e7eb',
                                borderRadius: '6px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontSize: '12px',
                                minWidth: '32px',
                                transition: 'all 0.2s'
                              }}
                            >
                              {r}
                            </button>
                          ))}
                        </div>

                        {/* File Upload Section */}
                        <div style={{ marginBottom: '12px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: '#003366', marginBottom: '6px' }}>
                            <BiPaperclip size={14} /> Archivos de Evidencia
                          </label>
                          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                            <input
                              type="file"
                              accept=".pdf,.docx,.xlsx,.jpg,.jpeg,.png,.gif"
                              onChange={(e) => handleFileUpload(task.id, e.target.files[0])}
                              disabled={uploadingFiles[task.id]}
                              style={{
                                padding: '6px',
                                border: '1px solid #e5e7eb',
                                borderRadius: '4px',
                                flex: 1,
                                fontSize: '12px',
                                cursor: uploadingFiles[task.id] ? 'not-allowed' : 'pointer',
                                opacity: uploadingFiles[task.id] ? 0.6 : 1
                              }}
                            />
                            {uploadingFiles[task.id] && (
                              <span style={{ fontSize: '12px', color: '#6366F1', fontWeight: '600' }}>
                                Cargando...
                              </span>
                            )}
                          </div>

                          {/* Uploaded Files Preview */}
                          {(evidence[task.id] || []).length > 0 && (
                            <div style={{ marginTop: '8px' }}>
                              {(evidence[task.id] || []).map((file, idx) => (
                                <div
                                  key={file.id || idx}
                                  style={{
                                    background: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '4px',
                                    padding: '8px',
                                    marginBottom: '4px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontSize: '12px'
                                  }}
                                >
                                  <span style={{ color: '#6366F1', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <BiFile size={14} /> {file.name || file.file_name}
                                  </span>
                                  <button
                                    onClick={() => handleDeleteFile(task.id, file.id)}
                                    style={{
                                      background: '#ef4444',
                                      color: 'white',
                                      border: 'none',
                                      padding: '4px 8px',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      fontSize: '11px',
                                      fontWeight: '600'
                                    }}
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Save Button */}
      <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #e5e7eb' }}>
        <button
          className="btn btn-success"
          onClick={handleSaveSuccess}
          disabled={loading}
          style={{
            background: '#10b981',
            color: 'white',
            padding: '12px 24px',
            fontSize: 15,
            fontWeight: 600,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <BiSave size={18} /> Guardar y Continuar
        </button>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={successModal.isOpen}
        title={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><BiCheckCircle size={18} style={{ color: '#10b981' }} /> Evaluación Guardada</span>}
        onClose={handleConfirmSuccess}
        onConfirm={handleConfirmSuccess}
        confirmText="Ver Resultado"
        cancelText={null}
      >
        <div>
          <p style={{ margin: 0, color: '#374151', lineHeight: 1.6 }}>
            La evaluación de <strong>{member.name}</strong> para el trimestre <strong>{quarter}</strong> se ha guardado correctamente.
          </p>
        </div>
      </Modal>
    </div>
  )
}
