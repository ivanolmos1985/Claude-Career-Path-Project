import React from 'react'

export default function Modal({
  isOpen,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDanger = false,
  isLoading = false
}) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="modal-container">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header">
            <h2 className="modal-title">{title}</h2>
            <button
              className="modal-close"
              onClick={onClose}
              disabled={isLoading}
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="modal-body">
            {children}
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button
              className="modal-btn modal-btn-cancel"
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelText}
            </button>
            {onConfirm && (
              <button
                className={`modal-btn modal-btn-confirm ${isDanger ? 'modal-btn-danger' : ''}`}
                onClick={onConfirm}
                disabled={isLoading}
              >
                {isLoading ? '⏳ Procesando...' : confirmText}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
