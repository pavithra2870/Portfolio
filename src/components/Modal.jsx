import { useEffect, useRef } from 'react'
import './Modal.css'

export default function Modal({ onClose, labelledBy, children }) {
  const panelRef = useRef(null)

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="modal" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className="modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        ref={panelRef}
      >
        <button className="modal__close" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <div className="modal__content">{children}</div>
      </div>
    </div>
  )
}
