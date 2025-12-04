import React from 'react'
import { colors, spacing, typography, radii, shadows } from '../../theme/tokens'
import Button from './Button'

/**
 * Feedback Components
 * Toasts, Empty States, and Modals
 */

/**
 * Toast Component
 * Notification toast
 */
export function Toast({
  type = 'info',
  message,
  title,
  icon,
  onClose,
  duration = 4000,
  className,
  style,
}) {
  React.useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const typeConfig = {
    success: {
      backgroundColor: colors.success,
      icon: '✅',
      color: colors.text.inverse,
    },
    error: {
      backgroundColor: colors.error,
      icon: '❌',
      color: colors.text.inverse,
    },
    warning: {
      backgroundColor: colors.warning,
      icon: '⚠️',
      color: colors.text.inverse,
    },
    info: {
      backgroundColor: colors.primary,
      icon: 'ℹ️',
      color: colors.text.inverse,
    },
  }

  const config = typeConfig[type]

  return (
    <div
      style={{
        backgroundColor: config.backgroundColor,
        color: config.color,
        padding: spacing.lg,
        borderRadius: radii.md,
        boxShadow: shadows.elevated,
        display: 'flex',
        gap: spacing.base,
        alignItems: 'flex-start',
        maxWidth: 400,
        animation: 'slideInRight 0.3s ease',
        ...style,
      }}
      className={className}
    >
      <span style={{ fontSize: 20, flexShrink: 0 }}>
        {icon || config.icon}
      </span>
      <div style={{ flex: 1 }}>
        {title && (
          <div style={{
            fontWeight: 600,
            marginBottom: spacing.xs,
          }}>
            {title}
          </div>
        )}
        {message && (
          <div style={{
            fontSize: typography.bodySmall.fontSize,
            opacity: 0.9,
          }}>
            {message}
          </div>
        )}
      </div>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
          fontSize: 20,
          flexShrink: 0,
          opacity: 0.7,
          transition: 'opacity 0.2s',
        }}
      >
        ✕
      </button>
    </div>
  )
}

/**
 * EmptyState Component
 * Display when there's no content
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  actionLabel = 'Crear',
  className,
  style,
}) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: spacing.xxxl,
        backgroundColor: colors.gray[50],
        borderRadius: radii.md,
        border: `1px solid ${colors.border.subtle}`,
        ...style,
      }}
      className={className}
    >
      {icon && (
        <div style={{
          fontSize: 48,
          marginBottom: spacing.lg,
        }}>
          {icon}
        </div>
      )}
      {title && (
        <h3 style={{
          fontSize: typography.h3.fontSize,
          fontWeight: typography.h3.fontWeight,
          color: colors.text.primary,
          marginBottom: spacing.sm,
        }}>
          {title}
        </h3>
      )}
      {description && (
        <p style={{
          fontSize: typography.body.fontSize,
          color: colors.text.secondary,
          marginBottom: spacing.lg,
        }}>
          {description}
        </p>
      )}
      {action && (
        <Button variant="primary" onClick={action}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

/**
 * Modal Component
 * Modal dialog
 */
export function Modal({
  isOpen,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'standard',
  size = 'medium',
  className,
  style,
}) {
  if (!isOpen) return null

  const sizeMap = {
    small: 400,
    medium: 600,
    large: 800,
  }

  const variantConfig = {
    standard: {
      backgroundColor: colors.surface.light,
      borderColor: colors.border.subtle,
    },
    danger: {
      backgroundColor: colors.error,
      borderColor: colors.error,
    },
  }

  const config = variantConfig[variant]
  const isDanger = variant === 'danger'

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: config.backgroundColor,
          borderRadius: radii.lg,
          boxShadow: shadows.elevated,
          width: `min(${sizeMap[size]}px, 90vw)`,
          maxHeight: '90vh',
          overflowY: 'auto',
          color: isDanger ? colors.text.inverse : colors.text.primary,
          ...style,
        }}
        className={className}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div style={{
            padding: spacing.lg,
            borderBottom: `1px solid ${isDanger ? 'rgba(255,255,255,0.1)' : colors.border.subtle}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <h2 style={{
              fontSize: typography.h2.fontSize,
              fontWeight: typography.h2.fontWeight,
              margin: 0,
            }}>
              {title}
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 24,
                cursor: 'pointer',
                color: 'inherit',
                opacity: 0.7,
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Content */}
        <div style={{ padding: spacing.lg }}>
          {children}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: spacing.lg,
            borderTop: `1px solid ${isDanger ? 'rgba(255,255,255,0.1)' : colors.border.subtle}`,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: spacing.md,
          }}
        >
          <Button
            variant={isDanger ? 'secondary' : 'secondary'}
            onClick={onClose}
            style={{
              color: isDanger ? colors.text.inverse : undefined,
              borderColor: isDanger ? 'rgba(255,255,255,0.3)' : undefined,
            }}
          >
            {cancelText}
          </Button>
          <Button
            variant={isDanger ? 'destructive' : 'primary'}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}

/**
 * Alert Component
 * Inline alert message
 */
export function Alert({
  type = 'info',
  title,
  message,
  onClose,
  closeable = true,
  className,
  style,
}) {
  const typeConfig = {
    success: {
      backgroundColor: '#D1F4E8',
      borderColor: colors.success,
      icon: '✅',
      color: '#065F4C',
    },
    error: {
      backgroundColor: '#FED7D7',
      borderColor: colors.error,
      icon: '❌',
      color: '#742A2A',
    },
    warning: {
      backgroundColor: '#FEEBC8',
      borderColor: colors.warning,
      icon: '⚠️',
      color: '#7C2D12',
    },
    info: {
      backgroundColor: '#BEE3F8',
      borderColor: colors.primary,
      icon: 'ℹ️',
      color: '#2C5282',
    },
  }

  const config = typeConfig[type]

  return (
    <div
      style={{
        backgroundColor: config.backgroundColor,
        borderLeft: `4px solid ${config.borderColor}`,
        borderRadius: radii.md,
        padding: spacing.base,
        display: 'flex',
        gap: spacing.base,
        ...style,
      }}
      className={className}
    >
      <span style={{ fontSize: 20, flexShrink: 0 }}>
        {config.icon}
      </span>
      <div style={{ flex: 1, color: config.color }}>
        {title && (
          <div style={{ fontWeight: 600, marginBottom: spacing.xs }}>
            {title}
          </div>
        )}
        {message && (
          <div style={{ fontSize: typography.bodySmall.fontSize }}>
            {message}
          </div>
        )}
      </div>
      {closeable && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: config.color,
            fontSize: 20,
            opacity: 0.7,
            transition: 'opacity 0.2s',
            flexShrink: 0,
          }}
        >
          ✕
        </button>
      )}
    </div>
  )
}

/**
 * Spinner Component
 * Loading spinner
 */
export function Spinner({
  size = 'medium',
  color = 'primary',
  className,
  style,
}) {
  const sizeMap = {
    small: 24,
    medium: 40,
    large: 56,
  }

  const colorMap = {
    primary: colors.primary,
    success: colors.success,
    error: colors.error,
    white: '#FFFFFF',
  }

  return (
    <div
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
        border: `3px solid ${colorMap[color]}20`,
        borderTop: `3px solid ${colorMap[color]}`,
        borderRadius: radii.pill,
        animation: 'spin 1s linear infinite',
        ...style,
      }}
      className={className}
    />
  )
}

/**
 * Progress Bar Component
 * Shows progress
 */
export function ProgressBar({
  value = 0,
  max = 100,
  color = 'primary',
  size = 'medium',
  showLabel = false,
  className,
  style,
}) {
  const colorMap = {
    primary: colors.primary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
  }

  const sizeMap = {
    small: 4,
    medium: 8,
    large: 12,
  }

  const percentage = (value / max) * 100

  return (
    <div style={style} className={className}>
      <div
        style={{
          width: '100%',
          height: sizeMap[size],
          backgroundColor: colors.gray[200],
          borderRadius: radii.pill,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: colorMap[color],
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      {showLabel && (
        <div style={{
          marginTop: spacing.sm,
          fontSize: typography.caption.fontSize,
          color: colors.text.secondary,
          textAlign: 'center',
        }}>
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  )
}
