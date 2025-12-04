import React from 'react'
import { colors, spacing, typography, radii, shadows } from '../../theme/tokens'

/**
 * Select Component
 * Dropdown select with label, helper text, and error states
 */
export function Select({
  label,
  placeholder,
  options = [],
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

  const selectStyle = {
    fontFamily: typography.fontFamily,
    fontSize: typography.body.fontSize,
    padding: `${spacing.md}px ${spacing.base}px`,
    border: `1px solid ${error ? colors.error : isFocused ? colors.primary : colors.border.medium}`,
    borderRadius: radii.md,
    color: colors.text.primary,
    backgroundColor: disabled ? colors.gray[100] : colors.surface.light,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: isFocused ? shadows.focus : 'none',
    opacity: disabled ? 0.6 : 1,
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${colors.text.primary}' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 8px center',
    backgroundSize: '20px',
    paddingRight: spacing.xxxl,
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
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={selectStyle}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option
            key={typeof option === 'string' ? option : option.value}
            value={typeof option === 'string' ? option : option.value}
          >
            {typeof option === 'string' ? option : option.label}
          </option>
        ))}
      </select>
      {(helperText || error) && (
        <div style={helperStyle}>
          {error || helperText}
        </div>
      )}
    </div>
  )
}

/**
 * Textarea Component
 * Multi-line text input with label, helper text, and error states
 */
export function Textarea({
  label,
  placeholder,
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  required = false,
  rows = 4,
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

  const textareaStyle = {
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
    resize: 'vertical',
    minHeight: `${rows * 24}px`,
    lineHeight: 1.5,
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
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        rows={rows}
        style={textareaStyle}
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

/**
 * Checkbox Component
 * Custom checkbox with label
 */
export function Checkbox({
  label,
  checked = false,
  onChange,
  disabled = false,
  className,
  style,
  ...props
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      ...style,
    }}
    className={className}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        style={{
          width: 20,
          height: 20,
          cursor: 'inherit',
          accentColor: colors.primary,
        }}
        {...props}
      />
      {label && (
        <label style={{
          fontFamily: typography.fontFamily,
          fontSize: typography.body.fontSize,
          color: colors.text.primary,
          cursor: 'inherit',
          userSelect: 'none',
        }}>
          {label}
        </label>
      )}
    </div>
  )
}

/**
 * RadioButton Component
 * Custom radio button with label
 */
export function RadioButton({
  label,
  name,
  value,
  checked = false,
  onChange,
  disabled = false,
  className,
  style,
  ...props
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      ...style,
    }}
    className={className}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        style={{
          width: 20,
          height: 20,
          cursor: 'inherit',
          accentColor: colors.primary,
        }}
        {...props}
      />
      {label && (
        <label style={{
          fontFamily: typography.fontFamily,
          fontSize: typography.body.fontSize,
          color: colors.text.primary,
          cursor: 'inherit',
          userSelect: 'none',
        }}>
          {label}
        </label>
      )}
    </div>
  )
}
