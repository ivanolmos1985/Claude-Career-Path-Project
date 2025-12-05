import React from 'react'
import { colors } from '../../theme/colors'

export function ActionButton({
  children,
  icon: Icon = null,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick = null,
  style = {},
  ...props
}) {
  const variants = {
    primary: {
      backgroundColor: colors.primary[500],
      color: '#ffffff',
      border: 'none',
      '&:hover': {
        backgroundColor: colors.primary[600]
      },
      '&:active': {
        backgroundColor: colors.primary[700]
      }
    },
    secondary: {
      backgroundColor: colors.neutral[100],
      color: colors.neutral[700],
      border: `1px solid ${colors.neutral[200]}`,
      '&:hover': {
        backgroundColor: colors.neutral[50]
      },
      '&:active': {
        backgroundColor: colors.neutral[200]
      }
    },
    danger: {
      backgroundColor: colors.error[500],
      color: '#ffffff',
      border: 'none',
      '&:hover': {
        backgroundColor: colors.error[600]
      },
      '&:active': {
        backgroundColor: colors.error[700]
      }
    },
    ghost: {
      backgroundColor: 'transparent',
      color: colors.primary[500],
      border: `1px solid ${colors.primary[200]}`,
      '&:hover': {
        backgroundColor: colors.primary[50]
      },
      '&:active': {
        backgroundColor: colors.primary[100]
      }
    }
  }

  const sizes = {
    sm: {
      padding: '6px 12px',
      fontSize: '12px',
      fontWeight: 600,
      gap: '6px',
      minHeight: '32px'
    },
    md: {
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: 600,
      gap: '8px',
      minHeight: '40px'
    },
    lg: {
      padding: '12px 24px',
      fontSize: '15px',
      fontWeight: 600,
      gap: '10px',
      minHeight: '48px'
    }
  }

  const variantStyle = variants[variant] || variants.primary
  const sizeStyle = sizes[size] || sizes.md

  const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '6px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.5 : 1,
    ...variantStyle,
    ...sizeStyle,
    ...style
  }

  return (
    <button
      style={buttonStyle}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} />}
      {children}
    </button>
  )
}

export default ActionButton
