import React from 'react'
import { useApp } from '../context/AppContext'
import { useQuery } from '../hooks/useQuery'
import html2pdf from 'html2pdf.js'

export default function DecisionPage(){
  const { teams, getCompetencies } = useApp()
  const query = useQuery()
  const teamId = Number(query.get('team'))
  const memberId = Number(query.get('member'))
  const team = teams.find(t=>t.id===teamId)
  const member = team && team.members.find(m=>m.id===memberId)
  if(!team || !member) return <div className="card">Selecciona miembro válido</div>

  const comps = getCompetencies(member.role)
  const max = comps.length * 5
  const q4 = comps.reduce((s,c)=> s + ((member.evaluations['Q4']||{})[c.id] || 0), 0)

  // Calcular promedio por trimestre (promedio de los 4 trimestres)
  const quarters = ['Q1','Q2','Q3','Q4']
  const quarterScores = quarters.map(q => comps.reduce((s,c)=> s + ((member.evaluations[q]||{})[c.id] || 0), 0))
  const avg = quarterScores.reduce((a,b) => a + b, 0) / 4
  const threshold = member.level === 'jr' ? Math.ceil(max * 0.7) : Math.ceil(max * 0.8)
  let status = 'NO APROBADA'
  if(q4 >= threshold) status = 'PROMOCIÓN APROBADA'
  else if(q4 >= threshold * 0.85) status = 'PROMOCIÓN PENDIENTE'

  const exportPDF = () => {
    const htmlContent = generateHTMLReport(team, member, comps, q4, avg, threshold, status)
    const opt = {
      margin: 10,
      filename: `reporte_${member.name.replace(/\s+/g,'_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    }
    html2pdf().set(opt).from(htmlContent).save()
  }

  const getStatusColor = () => {
    if(status === 'PROMOCIÓN APROBADA') return { bg: '#d1fae5', border: '#10b981', color: '#047857' }
    if(status === 'PROMOCIÓN PENDIENTE') return { bg: '#fef3c7', border: '#f59e0b', color: '#92400e' }
    return { bg: '#fee2e2', border: '#dc3545', color: '#991b1b' }
  }

  const statusColors = getStatusColor()

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: '0 0 8px 0', color: '#003366', fontSize: 28, fontWeight: 700 }}>
          ✅ Decisión de Promoción
        </h1>
        <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>
          <span style={{ fontWeight: 600, color: '#0066ff' }}>{member.name}</span>
        </p>
      </div>

      <div style={{ marginBottom: 20, padding: 20, background: statusColors.bg, borderLeft: `4px solid ${statusColors.border}`, borderRadius: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: statusColors.color, marginBottom: 8, textTransform: 'uppercase' }}>
          RESULTADO
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, color: statusColors.color }}>
          {status}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20, padding: 20 }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#003366', fontSize: 18 }}>
          📊 Métricas de Evaluación
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div style={{ padding: 16, background: '#eff6ff', borderRadius: 8, borderLeft: '3px solid #0066ff' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#0066ff', marginBottom: 4, textTransform: 'uppercase' }}>
              Score Q4
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#003366' }}>
              {q4} <span style={{ fontSize: 14, fontWeight: 400 }}>/ {max}</span>
            </div>
          </div>
          <div style={{ padding: 16, background: '#f0fdf4', borderRadius: 8, borderLeft: '3px solid #10b981' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#10b981', marginBottom: 4, textTransform: 'uppercase' }}>
              Promedio Anual
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#003366' }}>
              {Math.round(avg)} <span style={{ fontSize: 14, fontWeight: 400 }}>/ {max}</span>
            </div>
          </div>
          <div style={{ padding: 16, background: '#fef3c7', borderRadius: 8, borderLeft: '3px solid #f59e0b' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#92400e', marginBottom: 4, textTransform: 'uppercase' }}>
              Umbral Requerido
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#003366' }}>
              {threshold}
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20, padding: 20, background: '#f9fafb' }}>
        <h3 style={{ margin: '0 0 12px 0', color: '#003366', fontSize: 18 }}>
          🎯 Información del Empleado
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
            <div style={{ fontWeight: 600, color: '#0066ff' }}>{member.level_target}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Email</div>
            <div style={{ fontWeight: 600, color: '#003366' }}>{member.email}</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #e5e7eb' }}>
        <button
          className="btn"
          onClick={exportPDF}
          style={{
            background: '#0066ff',
            color: 'white',
            padding: '12px 24px',
            fontSize: 15,
            fontWeight: 600,
            width: '100%'
          }}
        >
          📄 Exportar Reporte en PDF
        </button>
      </div>
    </div>
  )
}

function generateHTMLReport(team, member, comps, q4, avg, threshold, status){
  const getStatusColor = (st) => {
    if(st === 'PROMOCIÓN APROBADA') return '#28a745'
    if(st === 'PROMOCIÓN PENDIENTE') return '#ffc107'
    return '#dc3545'
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
        <p><strong>Nivel Objetivo:</strong> ${member.levelTarget}</p>
      </div>

      <h3 style="color: #0a2540; margin-top: 30px;">Información del Equipo</h3>
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <p><strong>Cliente:</strong> ${team.client}</p>
        <p><strong>Descripción:</strong> ${team.description}</p>
      </div>

      <h3 style="color: #0a2540; margin-top: 30px;">Resultados de Evaluación</h3>
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <p><strong>Score Q4:</strong> ${q4} / ${comps.length * 5}</p>
        <p><strong>Promedio Anual (Estimado):</strong> ${Math.round(avg)} / ${comps.length * 5}</p>
        <p><strong>Umbral Requerido:</strong> ${threshold}</p>
      </div>

      <h3 style="color: #0a2540; margin-top: 30px;">Estado de Promoción</h3>
      <div style="background: ${getStatusColor(status)}; color: white; padding: 20px; border-radius: 8px; text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 20px;">
        ${status}
      </div>

      <h3 style="color: #0a2540; margin-top: 30px;">Desglose por Trimestre</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr style="background: #0a2540; color: white;">
          <th style="padding: 10px; text-align: left;">Trimestre</th>
          ${comps.map((c, i) => `<th style="padding: 10px; text-align: center;">C${i+1}</th>`).join('')}
          <th style="padding: 10px; text-align: center;">Total</th>
        </tr>
        ${['Q1','Q2','Q3','Q4'].map(q => {
          const scores = comps.map(c => (member.evaluations[q]||{})[c.id] || 0)
          const total = scores.reduce((a,b) => a+b, 0)
          return `
            <tr style="border-bottom: 1px solid #ddd; background: ${['Q1','Q2','Q3'].includes(q) ? '#f8f9fa' : '#fffbea'};">
              <td style="padding: 10px; font-weight: bold;">${q}</td>
              ${scores.map(s => `<td style="padding: 10px; text-align: center;">${s}</td>`).join('')}
              <td style="padding: 10px; text-align: center; font-weight: bold;">${total}</td>
            </tr>
          `
        }).join('')}
      </table>

      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
      <p style="text-align: center; color: #666; font-size: 12px;">
        Reporte generado el ${new Date().toLocaleDateString('es-ES', {year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit'})}
      </p>
    </div>
  `
}
