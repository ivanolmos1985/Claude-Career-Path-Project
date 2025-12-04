/**
 * Badge Component - Modern Design System
 * Small label for status, role, or category
 */

import React from 'react';
import './Badge.css';

export const Badge = React.forwardRef(({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
  ...props
}, ref) => {
  const badgeClasses = [
    'badge',
    `badge-${variant}`,
    `badge-${size}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <span ref={ref} className={badgeClasses} {...props}>
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;
