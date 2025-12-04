import React from 'react'
import { colors, spacing, typography, radii, shadows } from '../../theme/tokens'

/**
 * Button Component
 * Variants: primary, secondary, ghost, destructive
 * Sizes: small, medium, large
 * States: default, hover, focus, disabled
 */
export default function Button({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  children,
  onClick,
  className,
  style,
  ...props
}) {
  const baseStyle = {
    fontFamily: typography.fontFamily,
    fontWeight: typography.buttonText.fontWeight,
    fontSize: typography.buttonText.fontSize,
    lineHeight: typography.buttonText.lineHeight,
    border: 'none',
    borderRadius: radii.md,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    whiteSpace: 'nowrap',
    opacity: disabled ? 0.6 : 1,
  }

  const sizeStyles = {
    small: {
      padding: `${spacing.sm}px ${spacing.base}px`,
    },
    medium: {
      padding: `${spacing.md}px ${spacing.lg}px`,
    },
    large: {
      padding: `${spacing.base}px ${spacing.xxl}px`,
    },
  }

  const variantStyles = {
    primary: {
      backgroundColor: disabled ? colors.gray[300] : colors.primary,
      color: colors.text.inverse,
      boxShadow: `0 1px 2px rgba(0, 0, 0, 0.05)`,
    },
    secondary: {
      backgroundColor: colors.gray[100],
      color: colors.text.primary,
      border: `1px solid ${colors.border.medium}`,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: colors.primary,
      border: `1px solid ${colors.border.subtle}`,
    },
    destructive: {
      backgroundColor: disabled ? colors.gray[300] : colors.error,
      color: colors.text.inverse,
      boxShadow: `0 1px 2px rgba(0, 0, 0, 0.05)`,
    },
  }

  const hoverStyles = {
    primary: !disabled ? { backgroundColor: '#2C5FDD' } : {},
    secondary: !disabled ? { backgroundColor: colors.gray[200] } : {},
    ghost: !disabled ? { backgroundColor: colors.gray[50] } : {},
    destructive: !disabled ? { backgroundColor: '#D43D3D' } : {},
  }

  const [isHovered, setIsHovered] = React.useState(false)

  const finalStyle = {
    ...baseStyle,
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...(isHovered && hoverStyles[variant]),
    ...style,
  }

  return (
    <button
      style={finalStyle}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={className}
      {...props}
    >
      {children}
    </button>
  )
}
