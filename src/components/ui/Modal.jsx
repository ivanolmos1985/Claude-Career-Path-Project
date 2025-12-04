/**
 * Modal Component - Modern Design System
 * Dialog with backdrop, header, footer, and body sections
 */

import React, { useEffect } from 'react';
import './Modal.css';

export const Modal = React.forwardRef(({
  isOpen = false,
  onClose = () => {},
  title = '',
  children,
  footer = null,
  size = 'md',
  closeOnBackdrop = true,
  closeButton = true,
  className = '',
  ...props
}, ref) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalClasses = [
    'modal-overlay',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={ref}
      className={modalClasses}
      onClick={handleBackdropClick}
      {...props}
    >
      <div className={`modal-dialog modal-${size}`}>
        <div className="modal-content">
          {(title || closeButton) && (
            <div className="modal-header">
              {title && <h2 className="modal-title">{title}</h2>}
              {closeButton && (
                <button
                  className="modal-close-btn"
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          <div className="modal-body">
            {children}
          </div>

          {footer && (
            <div className="modal-footer">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

Modal.displayName = 'Modal';

export default Modal;
