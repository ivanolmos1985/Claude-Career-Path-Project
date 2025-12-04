import React from 'react'
import { colors, spacing, typography, radii, shadows } from '../../theme/tokens'

/**
 * TextField Component
 * Text input with label, helper text, and error states
 */
export default function TextField({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  required = false,
  className,
  style,
  ...props
}) {
  const [isFocused, setIsFocused] = React.useState(false)

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
    width: '100%',
    ...style,
  }

  const labelStyle = {
    fontFamily: typography.fontFamily,
    fontSize: typography.bodySmall.fontSize,
    fontWeight: 600,
    color: colors.text.primary,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
  }

  const inputStyle = {
    fontFamily: typography.fontFamily,
    fontSize: typography.body.fontSize,
    padding: `${spacing.md}px ${spacing.base}px`,
    border: `1px solid ${error ? colors.error : isFocused ? colors.primary : colors.border.medium}`,
    borderRadius: radii.md,
    color: colors.text.primary,
    backgroundColor: disabled ? colors.gray[100] : colors.surface.light,
    cursor: disabled ? 'not-allowed' : 'text',
    transition: 'all 0.2s ease',
    boxShadow: isFocused ? shadows.focus : 'none',
    opacity: disabled ? 0.6 : 1,

    '&::placeholder': {
      color: colors.text.muted,
    },
  }

  const helperStyle = {
    fontFamily: typography.fontFamily,
    fontSize: typography.caption.fontSize,
    color: error ? colors.error : colors.text.secondary,
    marginTop: spacing.xs,
  }

  return (
    <div style={containerStyle} className={className}>
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={{ color: colors.error }}>*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={inputStyle}
        {...props}
      />
      {(helperText || error) && (
        <div style={helperStyle}>
          {error || helperText}
        </div>
      )}
    </div>
  )
}
