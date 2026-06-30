import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

/**
 * Modal — accessible dialog with focus trapping, ESC to close, portal rendering.
 */
export default function Modal({ open, onClose, title, children, footer, maxWidth = 500 }) {
  const dialogRef = useRef(null)
  const previouslyFocused = useRef(null)

  // ESC to close + focus trap
  useEffect(() => {
    if (!open) return
    previouslyFocused.current = document.activeElement

    const onKey = (e) => {
      if (e.key === 'Escape') { onClose?.(); return }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    // focus first element
    const t = setTimeout(() => {
      const first = dialogRef.current?.querySelector('button, [href], input, select, textarea')
      first?.focus()
    }, 30)
    // lock body scroll
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      clearTimeout(t)
      document.body.style.overflow = prevOverflow
      previouslyFocused.current?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[600] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        className="card relative w-full animate-fade-up"
        style={{ maxWidth, maxHeight: '92vh', overflowY: 'auto' }}
      >
        {title && (
          <div className="flex items-center justify-between p-5 border-b border-brand-100">
            <h2 id="modal-title" className="text-lg font-extrabold text-ink-900">{title}</h2>
            <button
              onClick={onClose}
              aria-label="إغلاق"
              className="btn btn-ghost btn-sm !p-1.5 !rounded-lg"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
        {footer && <div className="p-5 border-t border-brand-100">{footer}</div>}
      </div>
    </div>,
    document.body
  )
}
