/**
 * Card Component - Modern Design System
 * Container for content with optional shadow and hover effects
 */

import React from 'react';
import './Card.css';

export const Card = React.forwardRef(({
  children,
  hoverable = false,
  noPadding = false,
  header = null,
  footer = null,
  className = '',
  ...props
}, ref) => {
  const cardClasses = [
    'card',
    hoverable && 'card-hoverable',
    noPadding && 'card-no-padding',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={cardClasses} {...props}>
      {header && <div className="card-header">{header}</div>}
      <div className="card-content">
        {children}
      </div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
