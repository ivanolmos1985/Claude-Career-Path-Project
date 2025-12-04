/**
 * Button Component - Modern Design System
 * Supports multiple variants, sizes, and states
 */

import React from 'react';
import './Button.css';

export const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  ...props
}, ref) => {
  const buttonClasses = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && 'btn-full-width',
    disabled && 'btn-disabled',
    loading && 'btn-loading',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="btn-spinner"></span>
          {children && <span className="btn-text">{children}</span>}
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="btn-icon">{icon}</span>}
          {children && <span className="btn-text">{children}</span>}
          {icon && iconPosition === 'right' && <span className="btn-icon">{icon}</span>}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
