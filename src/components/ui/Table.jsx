import React from 'react'
import { colors, spacing, typography, radii, shadows } from '../../theme/tokens'

/**
 * Table Component System
 * Complete table with headers, rows, and cells
 */

export function Table({
  children,
  striped = true,
  hoverable = true,
  bordered = false,
  className,
  style,
  ...props
}) {
  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    fontFamily: typography.fontFamily,
    fontSize: typography.body.fontSize,
    ...style,
  }

  return (
    <div style={{
      overflowX: 'auto',
      borderRadius: radii.md,
      boxShadow: shadows.card,
    }}>
      <table style={tableStyle} className={className} {...props}>
        {children}
      </table>
    </div>
  )
}

/**
 * TableHead Component
 */
export function TableHead({
  children,
  className,
  style,
  ...props
}) {
  const headStyle = {
    backgroundColor: colors.gray[50],
    borderBottom: `2px solid ${colors.border.medium}`,
    ...style,
  }

  return (
    <thead style={headStyle} className={className} {...props}>
      {children}
    </thead>
  )
}

/**
 * TableBody Component
 */
export function TableBody({
  children,
  striped = true,
  hoverable = true,
  className,
  style,
  ...props
}) {
  const bodyStyle = {
    ...style,
  }

  return (
    <tbody style={bodyStyle} className={className} {...props}>
      {React.Children.map(children, (child, index) => {
        if (!child) return null
        return React.cloneElement(child, {
          striped,
          hoverable,
          rowIndex: index,
        })
      })}
    </tbody>
  )
}

/**
 * TableRow Component
 */
export function TableRow({
  children,
  striped = true,
  hoverable = true,
  rowIndex = 0,
  isHeader = false,
  className,
  style,
  onClick,
  ...props
}) {
  const [isHovered, setIsHovered] = React.useState(false)

  const rowStyle = {
    borderBottom: `1px solid ${colors.border.subtle}`,
    backgroundColor: striped && rowIndex % 2 === 1 ? colors.gray[50] : 'transparent',
    ...(hoverable && isHovered && { backgroundColor: colors.gray[100] }),
    cursor: onClick ? 'pointer' : 'default',
    transition: 'background-color 0.2s ease',
    ...style,
  }

  return (
    <tr
      style={rowStyle}
      className={className}
      onClick={onClick}
      onMouseEnter={() => hoverable && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {children}
    </tr>
  )
}

/**
 * TableHeader Cell Component
 */
export function TableHeaderCell({
  children,
  align = 'left',
  sortable = false,
  onSort,
  sorted,
  className,
  style,
  ...props
}) {
  const cellStyle = {
    padding: `${spacing.base}px`,
    textAlign: align,
    fontWeight: 600,
    color: colors.text.primary,
    fontSize: typography.bodySmall.fontSize,
    userSelect: 'none',
    cursor: sortable ? 'pointer' : 'default',
    ...style,
  }

  return (
    <th style={cellStyle} className={className} onClick={onSort} {...props}>
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
        {children}
        {sortable && (
          <span style={{ fontSize: 12, opacity: 0.6 }}>
            {sorted === 'asc' ? '↑' : sorted === 'desc' ? '↓' : '↕'}
          </span>
        )}
      </div>
    </th>
  )
}

/**
 * TableCell Component
 */
export function TableCell({
  children,
  align = 'left',
  type = 'text',
  className,
  style,
  ...props
}) {
  const cellStyle = {
    padding: `${spacing.base}px`,
    textAlign: align,
    color: colors.text.primary,
    fontSize: typography.body.fontSize,
    ...style,
  }

  let content = children

  // Type-specific rendering
  if (type === 'badge' && typeof children === 'object') {
    content = children
  } else if (type === 'status') {
    content = (
      <span style={{
        display: 'inline-block',
        padding: `${spacing.xs}px ${spacing.md}px`,
        borderRadius: radii.pill,
        fontSize: typography.caption.fontSize,
        fontWeight: 600,
        backgroundColor: colors.gray[100],
        color: colors.text.primary,
      }}>
        {children}
      </span>
    )
  } else if (type === 'score') {
    content = (
      <span style={{
        fontWeight: 600,
        color: children >= 80 ? colors.success : children >= 60 ? colors.warning : colors.error,
      }}>
        {children}
      </span>
    )
  }

  return (
    <td style={cellStyle} className={className} {...props}>
      {content}
    </td>
  )
}

/**
 * Pagination Component
 */
export function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className,
  style,
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.md,
      marginTop: spacing.lg,
      ...style,
    }}
    className={className}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: `${spacing.sm}px ${spacing.md}px`,
          borderRadius: radii.md,
          border: `1px solid ${colors.border.medium}`,
          backgroundColor: colors.surface.light,
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          opacity: currentPage === 1 ? 0.5 : 1,
          transition: 'all 0.2s ease',
        }}
      >
        ← Anterior
      </button>

      {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
        let page = i + 1
        if (totalPages > 5 && currentPage > 3) {
          page = currentPage - 2 + i
        }
        if (page > totalPages) return null

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            style={{
              padding: `${spacing.sm}px ${spacing.base}px`,
              borderRadius: radii.md,
              border: `1px solid ${page === currentPage ? colors.primary : colors.border.medium}`,
              backgroundColor: page === currentPage ? colors.primary : colors.surface.light,
              color: page === currentPage ? colors.text.inverse : colors.text.primary,
              cursor: 'pointer',
              fontWeight: page === currentPage ? 600 : 400,
              transition: 'all 0.2s ease',
            }}
          >
            {page}
          </button>
        )
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          padding: `${spacing.sm}px ${spacing.md}px`,
          borderRadius: radii.md,
          border: `1px solid ${colors.border.medium}`,
          backgroundColor: colors.surface.light,
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          opacity: currentPage === totalPages ? 0.5 : 1,
          transition: 'all 0.2s ease',
        }}
      >
        Siguiente →
      </button>
    </div>
  )
}
