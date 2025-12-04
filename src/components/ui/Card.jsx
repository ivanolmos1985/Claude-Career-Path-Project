import React from 'react'
import { colors, spacing, typography, radii, shadows } from '../../theme/tokens'

/**
 * Card Component
 * Base card container with configurable padding and styling
 */
export default function Card({
  children,
  padding = 'base',
  variant = 'outlined',
  elevated = false,
  className,
  style,
  ...props
}) {
  const paddingMap = {
    none: 0,
    sm: spacing.base,
    base: spacing.lg,
    lg: spacing.xl,
  }

  const cardStyle = {
    borderRadius: radii.md,
    padding: paddingMap[padding],
    backgroundColor: colors.surface.light,
    border: variant === 'outlined' ? `1px solid ${colors.border.subtle}` : 'none',
    boxShadow: elevated ? shadows.elevated : shadows.card,
    transition: 'all 0.2s ease',
    ...style,
  }

  return (
    <div style={cardStyle} className={className} {...props}>
      {children}
    </div>
  )
}

/**
 * TeamCard - Displays team information
 */
export function TeamCard({
  teamName,
  memberCount,
  icon = '👥',
  onClick,
  className,
  style,
}) {
  return (
    <Card
      padding="base"
      className={className}
      style={{
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        ...style,
      }}
      onClick={onClick}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.base }}>
        <div style={{
          fontSize: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: typography.h3.fontSize,
            fontWeight: typography.h3.fontWeight,
            color: colors.text.primary,
            marginBottom: spacing.sm,
          }}>
            {teamName}
          </div>
          <div style={{
            fontSize: typography.bodySmall.fontSize,
            color: colors.text.secondary,
          }}>
            {memberCount} miembros
          </div>
        </div>
      </div>
    </Card>
  )
}

/**
 * MemberCard - Displays member information
 */
export function MemberCard({
  name,
  role,
  seniority,
  photo,
  onClick,
  className,
  style,
}) {
  return (
    <Card
      padding="base"
      className={className}
      style={{
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        ...style,
      }}
      onClick={onClick}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.base }}>
        {photo ? (
          <img
            src={photo}
            alt={name}
            style={{
              width: 48,
              height: 48,
              borderRadius: radii.pill,
              objectFit: 'cover',
            }}
          />
        ) : (
          <div style={{
            width: 48,
            height: 48,
            borderRadius: radii.pill,
            backgroundColor: colors.gray[200],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
          }}>
            {name.charAt(0).toUpperCase()}
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: typography.body.fontSize,
            fontWeight: 600,
            color: colors.text.primary,
            marginBottom: spacing.xs,
          }}>
            {name}
          </div>
          <div style={{
            fontSize: typography.caption.fontSize,
            color: colors.text.secondary,
            display: 'flex',
            gap: spacing.sm,
          }}>
            <span>{role}</span>
            <span>•</span>
            <span>{seniority}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

/**
 * SkillCard - Displays skill with level indicator
 */
export function SkillCard({
  skillName,
  level,
  maxLevel = 5,
  className,
  style,
}) {
  return (
    <Card
      padding="md"
      className={className}
      style={style}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
      }}>
        <div style={{
          fontSize: typography.body.fontSize,
          fontWeight: 600,
          color: colors.text.primary,
        }}>
          {skillName}
        </div>
        <div style={{
          fontSize: typography.caption.fontSize,
          color: colors.text.secondary,
        }}>
          {level}/{maxLevel}
        </div>
      </div>
      <div style={{
        display: 'flex',
        gap: spacing.xs,
      }}>
        {Array.from({ length: maxLevel }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 6,
              borderRadius: radii.xs,
              backgroundColor: i < level ? colors.primary : colors.gray[200],
              transition: 'all 0.2s ease',
            }}
          />
        ))}
      </div>
    </Card>
  )
}
