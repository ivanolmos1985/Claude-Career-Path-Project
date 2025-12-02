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

  return (
    <div>
      <h3>Decisión - {member.name}</h3>
      <div style={{marginTop:12}} className="card">
        <div>Score Q4: {q4}/{max}</div>
        <div>Promedio anual (estimado): {Math.round(avg)}/{max}</div>
        <div>Umbral requerido: {threshold}</div>
        <div style={{marginTop:8,fontWeight:700}}>Estado: {status}</div>
      </div>

      <div style={{marginTop:12}}>
        <button className="btn btn-primary" onClick={exportPDF}>📄 Exportar Reporte PDF</button>
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
