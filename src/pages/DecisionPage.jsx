import React, { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import { useQuery } from '../hooks/useQuery'
import { createClient } from '@supabase/supabase-js'
import html2pdf from 'html2pdf.js'
import { BiCheckCircle, BiLineChart, BiDownload, BiUser, BiXCircle } from 'react-icons/bi'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default function DecisionPage() {
  const { teams, getCompetencies, getTasksForCompetency } = useApp()
  const query = useQuery()
  const teamId = Number(query.get('team'))
  const memberId = Number(query.get('member'))
  const team = teams.find(t => t.id === teamId)
  const member = team && team.members.find(m => m.id === memberId)

  const [competencyData, setCompetencyData] = useState([])
  const [loading, setLoading] = useState(true)
  const [q4Score, setQ4Score] = useState(0)
  const [annualAverage, setAnnualAverage] = useState(0)
  const [status, setStatus] = useState('NO APROBADA')

  useEffect(() => {
    if (team && member) {
      loadEvaluationData()
    }
  }, [team, member])

  const loadEvaluationData = async () => {
    try {
      setLoading(true)
      const comps = getCompetencies(member.role)

      // Load competency data with tasks and ratings
      const compDataArray = []
      for (const comp of (comps || [])) {
        const tasks = await getTasksForCompetency(comp.id)

        // Load ratings for all quarters
        const quarterRatings = {}
        const quarters = ['Q1', 'Q2', 'Q3', 'Q4']

        for (const quarter of quarters) {
          const { data: evaluations } = await supabase
            .from('task_evaluations')
            .select('*')
            .eq('member_id', member.id)
            .eq('quarter', quarter)
            .in('task_id', tasks.map(t => t.id))

          quarterRatings[quarter] = evaluations || []
        }

        compDataArray.push({
          ...comp,
          tasks,
          quarterRatings
        })
      }

      setCompetencyData(compDataArray)

      // Calculate scores
      calculateScores(compDataArray)
    } catch (error) {
      console.error('Error loading evaluation data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateScores = (compDataArray) => {
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4']
    const quarterScores = {}

    // Calculate scores for each quarter
    quarters.forEach(quarter => {
      let totalScore = 0
      let totalWeightedScore = 0
      let totalWeight = 0

      compDataArray.forEach(comp => {
        const ratings = comp.quarterRatings[quarter]
        if (ratings && ratings.length > 0) {
          // Calculate competency rating for this quarter (average of tasks)
          const compRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length

          // Add to total
          totalScore += compRating

          // Weighted score
          const weight = comp.weight || 20
          totalWeightedScore += (compRating / 10) * weight
          totalWeight += weight
        }
      })

      quarterScores[quarter] = {
        rawScore: totalScore,
        weightedScore: totalWeightedScore,
        count: compDataArray.length
      }
    })

    // Q4 weighted score (0-100 scale)
    const q4WeightedScore = quarterScores.Q4?.weightedScore || 0

    // Annual average (average of all quarters)
    const avgWeightedScore =
      (Object.values(quarterScores).reduce((sum, qs) => sum + (qs.weightedScore || 0), 0) / 4)

    setQ4Score(q4WeightedScore)
    setAnnualAverage(avgWeightedScore)

    // Determine status based on weighted score
    let newStatus = 'NO APROBADA'
    if (q4WeightedScore >= 80) newStatus = 'PROMOCIÓN APROBADA'
    else if (q4WeightedScore >= 70) newStatus = 'PROMOCIÓN PENDIENTE'

    setStatus(newStatus)
  }

  const getCompetencyScore = (comp, quarter) => {
    const ratings = comp.quarterRatings[quarter]
    if (!ratings || ratings.length === 0) return 0
    return (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
  }

  const getCompetencyWeightedScore = (comp, quarter) => {
    const score = parseFloat(getCompetencyScore(comp, quarter))
    const weight = comp.weight || 20
    return ((score / 10) * weight).toFixed(2)
  }

  const exportPDF = () => {
    const htmlContent = generateHTMLReport(
      team,
      member,
      competencyData,
      q4Score,
      annualAverage,
      status
    )
    const opt = {
      margin: 10,
      filename: `reporte_${member.name.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    }
    html2pdf().set(opt).from(htmlContent).save()
  }

  const getStatusColor = () => {
    if (status === 'PROMOCIÓN APROBADA') return { bg: '#d1fae5', border: '#10b981', color: '#047857' }
    if (status === 'PROMOCIÓN PENDIENTE') return { bg: '#fef3c7', border: '#f59e0b', color: '#92400e' }
    return { bg: '#fee2e2', border: '#dc3545', color: '#991b1b' }
  }

  if (!team || !member) return <div className="card">Selecciona miembro válido</div>

  const statusColors = getStatusColor()

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: '0 0 8px 0', color: '#003366', fontSize: 28, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BiCheckCircle size={32} style={{ color: '#6366F1' }} /> Decisión de Promoción
        </h1>
        <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>
          <span style={{ fontWeight: 600, color: '#6366F1' }}>{member.name}</span>
        </p>
      </div>

      {/* Status Card */}
      <div style={{ marginBottom: 20, padding: 20, background: statusColors.bg, borderLeft: `4px solid ${statusColors.border}`, borderRadius: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: statusColors.color, marginBottom: 8, textTransform: 'uppercase' }}>
          RESULTADO
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, color: statusColors.color }}>
          {status}
        </div>
        <div style={{ fontSize: 14, color: statusColors.color, marginTop: 8 }}>
          Puntaje Q4: <span style={{ fontWeight: 700 }}>{q4Score.toFixed(2)}/100</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="card" style={{ marginBottom: 20, padding: 20 }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#003366', fontSize: 18, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BiLineChart size={22} style={{ color: '#6366F1' }} /> Métricas de Evaluación
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div style={{ padding: 16, background: '#eff6ff', borderRadius: 8, borderLeft: '3px solid #6366F1' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#6366F1', marginBottom: 4, textTransform: 'uppercase' }}>
              Score Q4 (Ponderado)
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#003366' }}>
              {q4Score.toFixed(2)} <span style={{ fontSize: 14, fontWeight: 400 }}>/100</span>
            </div>
          </div>
          <div style={{ padding: 16, background: '#f0fdf4', borderRadius: 8, borderLeft: '3px solid #10b981' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#10b981', marginBottom: 4, textTransform: 'uppercase' }}>
              Promedio Anual
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#003366' }}>
              {annualAverage.toFixed(2)} <span style={{ fontSize: 14, fontWeight: 400 }}>/100</span>
            </div>
          </div>
          <div style={{ padding: 16, background: '#fef3c7', borderRadius: 8, borderLeft: '3px solid #f59e0b' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#92400e', marginBottom: 4, textTransform: 'uppercase' }}>
              Umbral Requerido
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#003366' }}>
              80 <span style={{ fontSize: 14, fontWeight: 400 }}>/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Competencies Breakdown */}
      {!loading && competencyData.length > 0 && (
        <div className="card" style={{ marginBottom: 20, padding: 20 }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#003366', fontSize: 18, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BiLineChart size={22} style={{ color: '#6366F1' }} /> Desglose por Competencia (Q4)
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#003366' }}>Competencia</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#003366' }}>Peso</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#003366' }}>Score</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#003366' }}>Ponderado</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#003366' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {competencyData.map((comp, idx) => {
                  const score = parseFloat(getCompetencyScore(comp, 'Q4'))
                  const weightedScore = parseFloat(getCompetencyWeightedScore(comp, 'Q4'))
                  const isPassed = score >= 7

                  return (
                    <tr key={comp.id} style={{ borderBottom: '1px solid #e5e7eb', background: idx % 2 === 0 ? '#fff' : '#f9fafb' }}>
                      <td style={{ padding: '12px', color: '#003366', fontWeight: 500 }}>
                        {comp.name}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', color: '#6366F1', fontWeight: 600 }}>
                        {comp.weight}%
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#003366' }}>
                        {isNaN(score) ? '-' : score.toFixed(1)}/10
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#003366' }}>
                        {isNaN(weightedScore) ? '-' : weightedScore}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 600,
                          background: isPassed ? '#d1fae5' : '#fee2e2',
                          color: isPassed ? '#065f46' : '#7f1d1d',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          {isPassed ? <BiCheckCircle size={14} /> : <BiXCircle size={14} />}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Employee Info */}
      <div className="card" style={{ marginBottom: 20, padding: 20, background: '#f9fafb' }}>
        <h3 style={{ margin: '0 0 12px 0', color: '#003366', fontSize: 18, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BiUser size={22} style={{ color: '#6366F1' }} /> Información del Empleado
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Rol</div>
            <div style={{ fontWeight: 600, color: '#003366' }}>{member.role}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Nivel Actual</div>
            <div style={{ fontWeight: 600, color: '#003366' }}>{member.level}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Objetivo</div>
            <div style={{ fontWeight: 600, color: '#6366F1' }}>{member.level_target}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Email</div>
            <div style={{ fontWeight: 600, color: '#003366' }}>{member.email}</div>
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #e5e7eb' }}>
        <button
          className="btn"
          onClick={exportPDF}
          disabled={loading}
          style={{
            background: '#6366F1',
            color: 'white',
            padding: '12px 24px',
            fontSize: 15,
            fontWeight: 600,
            width: '100%',
            opacity: loading ? 0.6 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <BiDownload size={18} /> Exportar Reporte en PDF
        </button>
      </div>
    </div>
  )
}

function generateHTMLReport(team, member, competencyData, q4Score, annualAverage, status) {
  const getStatusColor = (st) => {
    if (st === 'PROMOCIÓN APROBADA') return '#28a745'
    if (st === 'PROMOCIÓN PENDIENTE') return '#ffc107'
    return '#dc3545'
  }

  const getCompetencyScore = (comp, quarter) => {
    const ratings = comp.quarterRatings[quarter]
    if (!ratings || ratings.length === 0) return 0
    return (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
  }

  const getCompetencyWeightedScore = (comp, quarter) => {
    const score = parseFloat(getCompetencyScore(comp, quarter))
    const weight = comp.weight || 20
    return ((score / 10) * weight).toFixed(2)
  }

  return `
    <div style="font-family: Arial, sans-serif; padding: 40px; color: #333;">
      <h1 style="text-align: center; color: #0a2540; margin-bottom: 10px;">Reporte de Evaluación</h1>
      <hr style="border: none; border-top: 2px solid #0a2540; margin: 20px 0;">

      <h3 style="color: #0a2540; margin-top: 30px;">Información del Empleado</h3>
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <p><strong>Nombre:</strong> ${member.name}</p>
        <p><strong>Rol:</strong> ${member.role}</p>
        <p><strong>Nivel Actual:</strong> ${member.level}</p>
        <p><strong>Nivel Objetivo:</strong> ${member.level_target}</p>
      </div>

      <h3 style="color: #0a2540; margin-top: 30px;">Información del Equipo</h3>
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <p><strong>Cliente:</strong> ${team.client}</p>
        <p><strong>Descripción:</strong> ${team.description || 'N/A'}</p>
      </div>

      <h3 style="color: #0a2540; margin-top: 30px;">Resultados de Evaluación</h3>
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <p><strong>Score Q4 (Ponderado):</strong> ${q4Score.toFixed(2)} / 100</p>
        <p><strong>Promedio Anual:</strong> ${annualAverage.toFixed(2)} / 100</p>
        <p><strong>Umbral Requerido:</strong> 80 / 100</p>
      </div>

      <h3 style="color: #0a2540; margin-top: 30px;">Estado de Promoción</h3>
      <div style="background: ${getStatusColor(status)}; color: white; padding: 20px; border-radius: 8px; text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 20px;">
        ${status}
      </div>

      <h3 style="color: #0a2540; margin-top: 30px;">Desglose por Competencia (Q4)</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr style="background: #0a2540; color: white;">
          <th style="padding: 10px; text-align: left;">Competencia</th>
          <th style="padding: 10px; text-align: center;">Peso</th>
          <th style="padding: 10px; text-align: center;">Score</th>
          <th style="padding: 10px; text-align: center;">Ponderado</th>
        </tr>
        ${competencyData.map(comp => `
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px;">${comp.name}</td>
            <td style="padding: 10px; text-align: center;">${comp.weight}%</td>
            <td style="padding: 10px; text-align: center;">${getCompetencyScore(comp, 'Q4')}/10</td>
            <td style="padding: 10px; text-align: center;">${getCompetencyWeightedScore(comp, 'Q4')}</td>
          </tr>
        `).join('')}
      </table>

      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
      <p style="text-align: center; color: #666; font-size: 12px;">
        Reporte generado el ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  `
}
