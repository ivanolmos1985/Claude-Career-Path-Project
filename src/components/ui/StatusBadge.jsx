import React from 'react'
import { colors } from '../../theme/colors'
import { typography } from '../../theme/spacing'

export function StatusBadge({
  status = 'active',
  variant = 'success',
  size = 'md',
  icon = null
}) {
  const variants = {
    success: {
      backgroundColor: colors.success[50],
      color: colors.success[700],
      borderColor: colors.success[200]
    },
    warning: {
      backgroundColor: colors.warning[50],
      color: colors.warning[700],
      borderColor: colors.warning[200]
    },
    error: {
      backgroundColor: colors.error[50],
      color: colors.error[700],
      borderColor: colors.error[200]
    },
    info: {
      backgroundColor: colors.primary[50],
      color: colors.primary[700],
      borderColor: colors.primary[200]
    },
    neutral: {
      backgroundColor: colors.neutral[100],
      color: colors.neutral[700],
      borderColor: colors.neutral[200]
    }
  }

  const sizes = {
    sm: {
      padding: '2px 8px',
      fontSize: '11px',
      fontWeight: 600
    },
    md: {
      padding: '4px 12px',
      fontSize: '12px',
      fontWeight: 600
    },
    lg: {
      padding: '6px 16px',
      fontSize: '13px',
      fontWeight: 600
    }
  }

  const style = variants[variant] || variants.neutral
  const sizeStyle = sizes[size] || sizes.md

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        ...style,
        ...sizeStyle,
        borderRadius: '4px',
        border: `1px solid ${style.borderColor}`,
        width: 'fit-content',
        whiteSpace: 'nowrap'
      }}
    >
      {icon && <span>{icon}</span>}
      {status}
    </span>
  )
}

export default StatusBadge
