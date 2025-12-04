import React from 'react'
import { colors, spacing, typography, radii } from '../../theme/tokens'
import { ProgressBar } from './Feedback'

/**
 * Evaluation-Specific Components
 * Score selector, skill blocks, radar chart, etc.
 */

/**
 * ScoreSelector Component
 * Interactive score selector (0-10 or 1-5)
 */
export function ScoreSelector({
  value = 0,
  onChange,
  min = 1,
  max = 10,
  disabled = false,
  className,
  style,
}) {
  return (
    <div
      style={{
        display: 'flex',
        gap: spacing.md,
        flexWrap: 'wrap',
        ...style,
      }}
      className={className}
    >
      {Array.from({ length: max - min + 1 }).map((_, i) => {
        const score = min + i
        const isSelected = value === score

        return (
          <button
            key={score}
            onClick={() => !disabled && onChange(score)}
            disabled={disabled}
            style={{
              width: 48,
              height: 48,
              borderRadius: radii.md,
              border: `2px solid ${isSelected ? colors.primary : colors.border.medium}`,
              backgroundColor: isSelected ? colors.primary : colors.surface.light,
              color: isSelected ? colors.text.inverse : colors.text.primary,
              fontWeight: 600,
              fontSize: typography.body.fontSize,
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              opacity: disabled ? 0.6 : 1,
            }}
          >
            {score}
          </button>
        )
      })}
    </div>
  )
}

/**
 * SkillEvaluationBlock Component
 * Complete skill evaluation with score selector and description
 */
export function SkillEvaluationBlock({
  skillName,
  description,
  value = 0,
  onChange,
  notes = '',
  onNotesChange,
  maxScore = 10,
  disabled = false,
  className,
  style,
}) {
  return (
    <div
      style={{
        padding: spacing.lg,
        border: `1px solid ${colors.border.subtle}`,
        borderRadius: radii.md,
        backgroundColor: colors.gray[50],
        ...style,
      }}
      className={className}
    >
      {/* Header */}
      <div style={{ marginBottom: spacing.base }}>
        <h4 style={{
          fontSize: typography.h3.fontSize,
          fontWeight: typography.h3.fontWeight,
          color: colors.text.primary,
          margin: 0,
          marginBottom: spacing.sm,
        }}>
          {skillName}
        </h4>
        {description && (
          <p style={{
            fontSize: typography.bodySmall.fontSize,
            color: colors.text.secondary,
            margin: 0,
          }}>
            {description}
          </p>
        )}
      </div>

      {/* Score Selector */}
      <div style={{ marginBottom: spacing.lg }}>
        <label style={{
          fontSize: typography.bodySmall.fontSize,
          fontWeight: 600,
          color: colors.text.primary,
          display: 'block',
          marginBottom: spacing.md,
        }}>
          Calificación (1-{maxScore})
        </label>
        <ScoreSelector
          value={value}
          onChange={onChange}
          max={maxScore}
          disabled={disabled}
        />
      </div>

      {/* Notes */}
      {onNotesChange && (
        <div>
          <label style={{
            fontSize: typography.bodySmall.fontSize,
            fontWeight: 600,
            color: colors.text.primary,
            display: 'block',
            marginBottom: spacing.sm,
          }}>
            Notas (Opcional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            disabled={disabled}
            placeholder="Detalles sobre la evaluación..."
            style={{
              width: '100%',
              minHeight: 80,
              padding: spacing.md,
              border: `1px solid ${colors.border.medium}`,
              borderRadius: radii.md,
              fontSize: typography.body.fontSize,
              fontFamily: typography.fontFamily,
              color: colors.text.primary,
              resize: 'vertical',
              opacity: disabled ? 0.6 : 1,
              cursor: disabled ? 'not-allowed' : 'text',
            }}
          />
        </div>
      )}
    </div>
  )
}

/**
 * CompetencyProgressBlock Component
 * Shows competency name with progress bar
 */
export function CompetencyProgressBlock({
  competencyName,
  score,
  maxScore = 100,
  weight,
  weightedScore,
  className,
  style,
}) {
  const percentage = (score / maxScore) * 100

  return (
    <div
      style={{
        padding: spacing.base,
        border: `1px solid ${colors.border.subtle}`,
        borderRadius: radii.md,
        ...style,
      }}
      className={className}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
      }}>
        <div>
          <h4 style={{
            fontSize: typography.body.fontSize,
            fontWeight: 600,
            color: colors.text.primary,
            margin: 0,
          }}>
            {competencyName}
          </h4>
          {weight && (
            <p style={{
              fontSize: typography.caption.fontSize,
              color: colors.text.secondary,
              margin: 0,
            }}>
              Peso: {weight}%
            </p>
          )}
        </div>
        <div style={{
          textAlign: 'right',
        }}>
          <div style={{
            fontSize: typography.h3.fontSize,
            fontWeight: 700,
            color: percentage >= 80 ? colors.success : percentage >= 60 ? colors.warning : colors.error,
          }}>
            {score}/{maxScore}
          </div>
          {weightedScore && (
            <p style={{
              fontSize: typography.caption.fontSize,
              color: colors.text.secondary,
              margin: 0,
            }}>
              Ponderado: {weightedScore.toFixed(1)}
            </p>
          )}
        </div>
      </div>
      <ProgressBar
        value={score}
        max={maxScore}
        color={percentage >= 80 ? 'success' : percentage >= 60 ? 'warning' : 'error'}
        size="medium"
      />
    </div>
  )
}

/**
 * RadarChartContainer Component
 * Placeholder for radar chart (use with chart library)
 */
export function RadarChartContainer({
  title,
  data = [],
  className,
  style,
}) {
  return (
    <div
      style={{
        padding: spacing.lg,
        border: `2px dashed ${colors.border.medium}`,
        borderRadius: radii.md,
        backgroundColor: colors.gray[50],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 300,
        ...style,
      }}
      className={className}
    >
      <div style={{ textAlign: 'center' }}>
        {title && (
          <h3 style={{
            fontSize: typography.h3.fontSize,
            fontWeight: typography.h3.fontWeight,
            color: colors.text.primary,
            marginBottom: spacing.md,
          }}>
            {title}
          </h3>
        )}
        <p style={{
          fontSize: typography.bodySmall.fontSize,
          color: colors.text.secondary,
          marginBottom: spacing.base,
        }}>
          📊 Gráfico Radar
        </p>
        <p style={{
          fontSize: typography.caption.fontSize,
          color: colors.text.muted,
        }}>
          Conecta con React-Vis, Recharts o Chart.js para visualizar
        </p>
        {data.length > 0 && (
          <div style={{
            marginTop: spacing.base,
            padding: spacing.md,
            backgroundColor: colors.surface.light,
            borderRadius: radii.md,
            fontSize: typography.caption.fontSize,
            textAlign: 'left',
          }}>
            <strong>Datos disponibles:</strong>
            <pre style={{
              margin: spacing.sm,
              padding: spacing.md,
              backgroundColor: colors.gray[100],
              borderRadius: radii.sm,
              overflow: 'auto',
              fontSize: 11,
            }}>
              {JSON.stringify(data, null, 2).substring(0, 200)}...
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * DecisionBlock Component
 * Final evaluation decision display
 */
export function DecisionBlock({
  quarterScore,
  quarterLevel,
  annualScore,
  annualLevel,
  recommendation,
  className,
  style,
}) {
  const getDecisionColor = (level) => {
    switch (level) {
      case 'APROBADA':
        return colors.success
      case 'PENDIENTE':
        return colors.warning
      case 'NO APROBADA':
        return colors.error
      default:
        return colors.primary
    }
  }

  return (
    <div
      style={{
        padding: spacing.xl,
        borderRadius: radii.lg,
        backgroundColor: getDecisionColor(quarterLevel) + '15',
        border: `2px solid ${getDecisionColor(quarterLevel)}`,
        ...style,
      }}
      className={className}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: spacing.lg,
        marginBottom: spacing.lg,
      }}>
        {/* Q4 Score */}
        <div>
          <p style={{
            fontSize: typography.caption.fontSize,
            color: colors.text.secondary,
            fontWeight: 600,
            margin: 0,
            marginBottom: spacing.sm,
          }}>
            CALIFICACIÓN Q4
          </p>
          <div style={{
            fontSize: 32,
            fontWeight: 700,
            color: getDecisionColor(quarterLevel),
          }}>
            {quarterScore}%
          </div>
          <div style={{
            fontSize: typography.body.fontSize,
            fontWeight: 600,
            color: getDecisionColor(quarterLevel),
          }}>
            {quarterLevel}
          </div>
        </div>

        {/* Annual Score */}
        <div>
          <p style={{
            fontSize: typography.caption.fontSize,
            color: colors.text.secondary,
            fontWeight: 600,
            margin: 0,
            marginBottom: spacing.sm,
          }}>
            CALIFICACIÓN ANUAL
          </p>
          <div style={{
            fontSize: 32,
            fontWeight: 700,
            color: colors.primary,
          }}>
            {annualScore}%
          </div>
          <div style={{
            fontSize: typography.body.fontSize,
            fontWeight: 600,
            color: colors.primary,
          }}>
            Promedio
          </div>
        </div>
      </div>

      {/* Recommendation */}
      {recommendation && (
        <div style={{
          padding: spacing.base,
          backgroundColor: colors.surface.light,
          borderRadius: radii.md,
          borderLeft: `4px solid ${getDecisionColor(quarterLevel)}`,
        }}>
          <p style={{
            fontSize: typography.bodySmall.fontSize,
            fontWeight: 600,
            color: colors.text.primary,
            margin: 0,
            marginBottom: spacing.sm,
          }}>
            Recomendación:
          </p>
          <p style={{
            fontSize: typography.body.fontSize,
            color: colors.text.secondary,
            margin: 0,
          }}>
            {recommendation}
          </p>
        </div>
      )}
    </div>
  )
}
