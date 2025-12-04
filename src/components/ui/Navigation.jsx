import React from 'react'
import { colors, spacing, typography, radii, shadows } from '../../theme/tokens'

/**
 * Navigation Components
 * Navbar and Sidebar components
 */

/**
 * Navbar Component
 * Top navigation bar with logo and user menu
 */
export function Navbar({
  logo,
  logoText = 'Career Path',
  onLogoClick,
  menuItems = [],
  rightContent,
  className,
  style,
  ...props
}) {
  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `${spacing.base}px ${spacing.lg}px`,
        backgroundColor: colors.surface.light,
        borderBottom: `1px solid ${colors.border.subtle}`,
        boxShadow: shadows.card,
        ...style,
      }}
      className={className}
      {...props}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.md,
          cursor: 'pointer',
        }}
        onClick={onLogoClick}
      >
        {logo && <div style={{ fontSize: 24 }}>{logo}</div>}
        <div style={{
          fontSize: typography.h3.fontSize,
          fontWeight: typography.h3.fontWeight,
          color: colors.primary,
        }}>
          {logoText}
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.lg,
      }}>
        {menuItems.map((item) => (
          <a
            key={item.id}
            href={item.href || '#'}
            onClick={(e) => {
              if (item.onClick) {
                e.preventDefault()
                item.onClick()
              }
            }}
            style={{
              color: colors.text.primary,
              textDecoration: 'none',
              fontSize: typography.body.fontSize,
              fontWeight: item.active ? 600 : 400,
              borderBottom: item.active ? `2px solid ${colors.primary}` : 'none',
              paddingBottom: item.active ? spacing.sm : 0,
              transition: 'all 0.2s ease',
            }}
          >
            {item.icon && <span style={{ marginRight: spacing.xs }}>{item.icon}</span>}
            {item.label}
          </a>
        ))}
      </div>

      {rightContent && (
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.base }}>
          {rightContent}
        </div>
      )}
    </nav>
  )
}

/**
 * Sidebar Component
 * Vertical navigation sidebar
 */
export function Sidebar({
  items = [],
  currentPath,
  onItemClick,
  collapsed = false,
  header,
  footer,
  className,
  style,
  ...props
}) {
  return (
    <aside
      style={{
        width: collapsed ? 80 : 260,
        backgroundColor: colors.gray[50],
        borderRight: `1px solid ${colors.border.subtle}`,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        transition: 'all 0.3s ease',
        ...style,
      }}
      className={className}
      {...props}
    >
      {/* Header */}
      {header && (
        <div style={{
          padding: spacing.lg,
          borderBottom: `1px solid ${colors.border.subtle}`,
        }}>
          {header}
        </div>
      )}

      {/* Menu Items */}
      <nav style={{
        flex: 1,
        overflowY: 'auto',
        padding: spacing.md,
      }}>
        {items.map((item) => {
          const isActive = currentPath === item.path
          return (
            <button
              key={item.id}
              onClick={() => onItemClick && onItemClick(item)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: spacing.base,
                padding: `${spacing.md}px ${spacing.base}px`,
                marginBottom: spacing.sm,
                borderRadius: radii.md,
                border: 'none',
                backgroundColor: isActive ? colors.primary : 'transparent',
                color: isActive ? colors.text.inverse : colors.text.primary,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: collapsed ? 0 : typography.body.fontSize,
                fontWeight: isActive ? 600 : 400,
              }}
              title={collapsed ? item.label : ''}
            >
              <span style={{ fontSize: 20, flexShrink: 0 }}>
                {item.icon}
              </span>
              {!collapsed && (
                <span style={{ flex: 1, textAlign: 'left' }}>
                  {item.label}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      {footer && (
        <div style={{
          padding: spacing.lg,
          borderTop: `1px solid ${colors.border.subtle}`,
          backgroundColor: colors.gray[100],
        }}>
          {footer}
        </div>
      )}
    </aside>
  )
}

/**
 * Breadcrumb Component
 * Navigation breadcrumb trail
 */
export function Breadcrumb({
  items = [],
  separator = '/',
  className,
  style,
  ...props
}) {
  return (
    <nav
      aria-label="breadcrumb"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.sm,
        fontSize: typography.bodySmall.fontSize,
        ...style,
      }}
      className={className}
      {...props}
    >
      {items.map((item, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
          }}
        >
          {item.href ? (
            <a
              href={item.href}
              style={{
                color: colors.primary,
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
            >
              {item.label}
            </a>
          ) : (
            <span style={{ color: colors.text.primary }}>
              {item.label}
            </span>
          )}
          {index < items.length - 1 && (
            <span style={{ color: colors.text.muted }}>
              {separator}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}

/**
 * Tabs Component
 * Tabbed interface
 */
export function Tabs({
  tabs = [],
  activeTab = 0,
  onTabChange,
  className,
  style,
  ...props
}) {
  return (
    <div style={style} className={className} {...props}>
      <div
        style={{
          display: 'flex',
          borderBottom: `2px solid ${colors.border.subtle}`,
          gap: spacing.base,
        }}
      >
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => onTabChange && onTabChange(index)}
            style={{
              padding: `${spacing.md}px ${spacing.lg}px`,
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              color: activeTab === index ? colors.primary : colors.text.secondary,
              fontWeight: activeTab === index ? 600 : 400,
              fontSize: typography.body.fontSize,
              borderBottom: activeTab === index ? `3px solid ${colors.primary}` : 'none',
              marginBottom: -2,
              transition: 'all 0.2s ease',
            }}
          >
            {tab.icon && <span style={{ marginRight: spacing.xs }}>{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      {tabs[activeTab] && tabs[activeTab].content && (
        <div style={{ padding: spacing.lg }}>
          {tabs[activeTab].content}
        </div>
      )}
    </div>
  )
}
