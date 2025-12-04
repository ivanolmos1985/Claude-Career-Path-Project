/**
 * Input Component - Modern Design System
 * Text input with support for icons, errors, and validation states
 */

import React from 'react';
import './Input.css';

export const Input = React.forwardRef(({
  label = null,
  error = null,
  hint = null,
  icon = null,
  iconPosition = 'left',
  disabled = false,
  className = '',
  ...props
}, ref) => {
  const inputClasses = [
    'input',
    error && 'input-error',
    disabled && 'input-disabled',
    icon && `input-with-icon-${iconPosition}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className="input-wrapper">
      {label && (
        <label className="input-label">
          {label}
          {props.required && <span className="input-required">*</span>}
        </label>
      )}
      <div className="input-container">
        {icon && iconPosition === 'left' && (
          <span className="input-icon input-icon-left">{icon}</span>
        )}
        <input
          ref={ref}
          className={inputClasses}
          disabled={disabled}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <span className="input-icon input-icon-right">{icon}</span>
        )}
      </div>
      {error && <div className="input-error-message">{error}</div>}
      {hint && !error && <div className="input-hint">{hint}</div>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
