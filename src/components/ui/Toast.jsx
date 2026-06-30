import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react'

const ToastContext = createContext(null)

const VARIANT = {
  success: { icon: CheckCircle2, cls: 'badge-success',  bar: '#2d9b5a' },
  error:   { icon: XCircle,      cls: 'badge-danger',   bar: '#c0392b' },
  warn:    { icon: AlertTriangle,cls: 'badge-gold',     bar: '#c9a227' },
  info:    { icon: Info,         cls: 'badge-info',     bar: '#3a7ab0' },
}

let _id = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const addToast = useCallback((msg, type = 'info', duration = 4000) => {
    const id = ++_id
    setToasts((t) => [...t, { id, msg, type }])
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration)
    }
    return id
  }, [removeToast])

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toasts }}>
      {children}
      <ToastViewport />
    </ToastContext.Provider>
  )
}

function ToastViewport() {
  const { toasts, removeToast } = useToast()
  if (toasts.length === 0) return null
  return (
    <div
      className="fixed z-[9999] flex flex-col gap-2 items-center pointer-events-none"
      style={{ bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)' }}
      role="region"
      aria-label="الإشعارات"
      aria-live="polite"
    >
      {toasts.map((t) => {
        const v = VARIANT[t.type] || VARIANT.info
        const Icon = v.icon
        return (
          <div
            key={t.id}
            className="card pointer-events-auto animate-fade-up flex items-center gap-3 ps-4 pe-3 py-3"
            style={{ minWidth: 260, maxWidth: 380 }}
            role="alert"
          >
            <span style={{ position: 'absolute', insetInlineStart: 0, top: 0, bottom: 0, width: 4, background: v.bar, borderRadius: '12px 0 0 12px' }} />
            <Icon size={18} aria-hidden="true" />
            <span className="flex-1 text-sm font-medium text-ink-700">{t.msg}</span>
            <button
              onClick={() => removeToast(t.id)}
              aria-label="إغلاق"
              className="text-ink-300 hover:text-ink-700"
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
