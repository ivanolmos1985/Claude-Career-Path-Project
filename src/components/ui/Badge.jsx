import React from 'react'
import { colors, spacing, typography, radii } from '../../theme/tokens'

/**
 * Badge Component
 * Small label component for tags, roles, status
 */
export default function Badge({
  children,
  variant = 'default',
  size = 'medium',
  icon,
  className,
  style,
  ...props
}) {
  const variantStyles = {
    default: {
      backgroundColor: colors.gray[100],
      color: colors.text.primary,
      border: `1px solid ${colors.border.subtle}`,
    },
    primary: {
      backgroundColor: colors.primary,
      color: colors.text.inverse,
      border: 'none',
    },
    success: {
      backgroundColor: colors.success,
      color: colors.text.inverse,
      border: 'none',
    },
    warning: {
      backgroundColor: colors.warning,
      color: colors.text.inverse,
      border: 'none',
    },
    error: {
      backgroundColor: colors.error,
      color: colors.text.inverse,
      border: 'none',
    },
  }

  const sizeStyles = {
    small: {
      fontSize: typography.caption.fontSize,
      padding: `${spacing.xs}px ${spacing.sm}px`,
    },
    medium: {
      fontSize: typography.bodySmall.fontSize,
      padding: `${spacing.sm}px ${spacing.base}px`,
    },
    large: {
      fontSize: typography.body.fontSize,
      padding: `${spacing.md}px ${spacing.lg}px`,
    },
  }

  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderRadius: radii.pill,
    fontWeight: 600,
    whiteSpace: 'nowrap',
    cursor: 'default',
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...style,
  }

  return (
    <span style={badgeStyle} className={className} {...props}>
      {icon && <span>{icon}</span>}
      {children}
    </span>
  )
}

/**
 * Role Badge
 * Pre-configured badge for team roles
 */
export function RoleBadge({ role, className, style }) {
  const roleConfig = {
    developer: { icon: '💻', label: 'Desarrollador', variant: 'primary' },
    qa: { icon: '🧪', label: 'QA', variant: 'success' },
    productowner: { icon: '📋', label: 'Product Owner', variant: 'primary' },
    scrummaster: { icon: '🎯', label: 'Scrum Master', variant: 'warning' },
    uxui: { icon: '🎨', label: 'UX/UI Designer', variant: 'primary' },
    deliverymanager: { icon: '📦', label: 'Delivery Manager', variant: 'warning' },
  }

  const config = roleConfig[role] || { icon: '👤', label: role, variant: 'default' }

  return (
    <Badge variant={config.variant} size="medium" className={className} style={style}>
      <span>{config.icon}</span>
      {config.label}
    </Badge>
  )
}

/**
 * Seniority Badge
 * Pre-configured badge for seniority levels
 */
export function SeniorityBadge({ level, className, style }) {
  const levelConfig = {
    junior: { icon: '🌱', label: 'Junior', variant: 'default' },
    mid: { icon: '📈', label: 'Mid', variant: 'primary' },
    senior: { icon: '⭐', label: 'Senior', variant: 'success' },
    lead: { icon: '👑', label: 'Lead', variant: 'warning' },
  }

  const config = levelConfig[level] || { icon: '👤', label: level, variant: 'default' }

  return (
    <Badge variant={config.variant} size="medium" className={className} style={style}>
      <span>{config.icon}</span>
      {config.label}
    </Badge>
  )
}

/**
 * Status Badge
 * Pre-configured badge for evaluation status
 */
export function StatusBadge({ status, className, style }) {
  const statusConfig = {
    pending: { icon: '⏳', label: 'Pendiente', variant: 'default' },
    'in-progress': { icon: '⚙️', label: 'En Progreso', variant: 'warning' },
    completed: { icon: '✅', label: 'Completada', variant: 'success' },
    approved: { icon: '🎉', label: 'Aprobada', variant: 'success' },
    rejected: { icon: '❌', label: 'Rechazada', variant: 'error' },
  }

  const config = statusConfig[status] || { icon: '❓', label: status, variant: 'default' }

  return (
    <Badge variant={config.variant} size="medium" className={className} style={style}>
      <span>{config.icon}</span>
      {config.label}
    </Badge>
  )
}

/**
 * Score Badge
 * Badge displaying a numeric score with color coding
 */
export function ScoreBadge({ score, maxScore = 100, className, style }) {
  const percentage = (score / maxScore) * 100

  let variant = 'default'
  if (percentage >= 80) variant = 'success'
  else if (percentage >= 60) variant = 'warning'
  else if (percentage >= 40) variant = 'default'
  else variant = 'error'

  return (
    <Badge variant={variant} size="medium" className={className} style={style}>
      {score}/{maxScore}
    </Badge>
  )
}
