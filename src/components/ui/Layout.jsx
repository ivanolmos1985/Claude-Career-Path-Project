import React from 'react'
import { spacing, colors, radii, typography } from '../../theme/tokens'

/**
 * Layout Components
 * Grid system, stacks, and page layouts
 */

/**
 * Container Component
 * Responsive container with max-width
 */
export function Container({
  children,
  maxWidth = 'lg',
  className,
  style,
  ...props
}) {
  const maxWidthMap = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    full: '100%',
  }

  const containerStyle = {
    maxWidth: maxWidthMap[maxWidth],
    margin: '0 auto',
    padding: `0 ${spacing.base}px`,
    width: '100%',
    ...style,
  }

  return (
    <div style={containerStyle} className={className} {...props}>
      {children}
    </div>
  )
}

/**
 * Stack Component
 * Flexible layout for stacking items vertically or horizontally
 */
export function Stack({
  children,
  direction = 'vertical',
  gap = 'base',
  align = 'stretch',
  justify = 'flex-start',
  wrap = false,
  className,
  style,
  ...props
}) {
  const gapMap = {
    xs: spacing.xs,
    sm: spacing.sm,
    md: spacing.md,
    base: spacing.base,
    lg: spacing.lg,
    xl: spacing.xl,
    xxl: spacing.xxl,
  }

  const alignMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch',
  }

  const justifyMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
    around: 'space-around',
    evenly: 'space-evenly',
  }

  const stackStyle = {
    display: 'flex',
    flexDirection: direction === 'horizontal' ? 'row' : 'column',
    gap: gapMap[gap],
    alignItems: alignMap[align],
    justifyContent: justifyMap[justify],
    flexWrap: wrap ? 'wrap' : 'nowrap',
    ...style,
  }

  return (
    <div style={stackStyle} className={className} {...props}>
      {children}
    </div>
  )
}

/**
 * Grid Component
 * Responsive grid layout with configurable columns
 */
export function Grid({
  children,
  columns = 3,
  gap = 'base',
  columnsMobile = 1,
  columnsTablet = 2,
  className,
  style,
  ...props
}) {
  const gapMap = {
    xs: spacing.xs,
    sm: spacing.sm,
    md: spacing.md,
    base: spacing.base,
    lg: spacing.lg,
    xl: spacing.xl,
    xxl: spacing.xxl,
  }

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fit, minmax(300px, 1fr))`,
    gap: gapMap[gap],
    ...style,
  }

  return (
    <div style={gridStyle} className={className} {...props}>
      {children}
    </div>
  )
}

/**
 * SidebarLayout Component
 * Two-column layout with sidebar and main content
 */
export function SidebarLayout({
  sidebar,
  children,
  sidebarWidth = 280,
  gap = 'lg',
  className,
  style,
  ...props
}) {
  const gapMap = {
    xs: spacing.xs,
    sm: spacing.sm,
    md: spacing.md,
    base: spacing.base,
    lg: spacing.lg,
    xl: spacing.xl,
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: gapMap[gap],
        ...style,
      }}
      className={className}
      {...props}
    >
      <aside
        style={{
          width: sidebarWidth,
          flexShrink: 0,
          backgroundColor: colors.gray[50],
          borderRight: `1px solid ${colors.border.subtle}`,
        }}
      >
        {sidebar}
      </aside>
      <main style={{ flex: 1, minWidth: 0 }}>
        {children}
      </main>
    </div>
  )
}

/**
 * Form Layout Component
 * Responsive form layout with labeled inputs
 */
export function FormLayout({
  children,
  gap = 'lg',
  columnCount = 1,
  className,
  style,
  ...props
}) {
  const gapMap = {
    xs: spacing.xs,
    sm: spacing.sm,
    md: spacing.md,
    base: spacing.base,
    lg: spacing.lg,
    xl: spacing.xl,
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
        gap: gapMap[gap],
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Card Grid Component
 * Grid specifically for card layouts
 */
export function CardGrid({
  children,
  gap = 'base',
  columns = 'auto',
  className,
  style,
  ...props
}) {
  const gapMap = {
    xs: spacing.xs,
    sm: spacing.sm,
    md: spacing.md,
    base: spacing.base,
    lg: spacing.lg,
    xl: spacing.xl,
  }

  const columnsMap = {
    auto: 'repeat(auto-fill, minmax(280px, 1fr))',
    '2': 'repeat(2, 1fr)',
    '3': 'repeat(3, 1fr)',
    '4': 'repeat(4, 1fr)',
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: columnsMap[columns] || columnsMap.auto,
        gap: gapMap[gap],
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Spacer Component
 * Add vertical or horizontal space
 */
export function Spacer({
  size = 'base',
  direction = 'vertical',
  className,
  style,
  ...props
}) {
  const sizeMap = {
    xs: spacing.xs,
    sm: spacing.sm,
    md: spacing.md,
    base: spacing.base,
    lg: spacing.lg,
    xl: spacing.xl,
    xxl: spacing.xxl,
    xxxl: spacing.xxxl,
    huge: spacing.huge,
  }

  const spacerStyle = {
    [direction === 'vertical' ? 'height' : 'width']: sizeMap[size],
    flexShrink: 0,
    ...style,
  }

  return <div style={spacerStyle} className={className} {...props} />
}

/**
 * Section Component
 * Semantic section wrapper with padding
 */
export function Section({
  children,
  padding = 'lg',
  title,
  subtitle,
  className,
  style,
  ...props
}) {
  const paddingMap = {
    none: 0,
    sm: spacing.base,
    base: spacing.lg,
    lg: spacing.xl,
    xl: spacing.xxl,
  }

  return (
    <section
      style={{
        padding: paddingMap[padding],
        ...style,
      }}
      className={className}
      {...props}
    >
      {(title || subtitle) && (
        <div style={{ marginBottom: spacing.lg }}>
          {title && (
            <h2 style={{
              fontSize: typography.h2.fontSize,
              fontWeight: typography.h2.fontWeight,
              color: colors.text.primary,
              marginBottom: subtitle ? spacing.sm : 0,
            }}>
              {title}
            </h2>
          )}
          {subtitle && (
            <p style={{
              fontSize: typography.body.fontSize,
              color: colors.text.secondary,
            }}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  )
}
