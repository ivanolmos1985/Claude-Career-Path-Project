import React from 'react'
import { colors } from '../../theme/colors'
import { spacing, typography } from '../../theme/spacing'

export function MetricCard({
  label,
  value,
  Icon,
  colorScheme = 'primary',
  showBorder = true
}) {
  const colorMap = {
    primary: colors.primary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    accent: colors.accent
  };

  const scheme = colorMap[colorScheme] || colorMap.primary;
  const mainColor = scheme[500];
  const lightColor = scheme[50] || colors.neutral[50];
  const darkColor = scheme[700] || scheme[600];

  return (
    <div
      style={{
        padding: spacing.xl,
        background: `linear-gradient(135deg, ${lightColor} 0%, ${lightColor}dd 100%)`,
        borderLeft: showBorder ? `4px solid ${mainColor}` : 'none',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.md,
        minHeight: '140px',
        justifyContent: 'space-between'
      }}
    >
      <span
        style={{
          ...typography.label,
          color: darkColor,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}
      >
        {label}
      </span>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: spacing.md }}>
        {Icon && (
          <Icon
            size={32}
            color={mainColor}
            style={{ flexShrink: 0 }}
          />
        )}
        <span
          style={{
            ...typography.h2,
            color: mainColor,
            margin: 0
          }}
        >
          {value}
        </span>
      </div>
    </div>
  )
}

export default MetricCard;
