import { useState, useRef, useEffect } from 'react'
import { Globe, ChevronDown, Check } from 'lucide-react'
import { useI18n, LANGUAGES } from '../i18n'

/**
 * LanguageSwitcher — dropdown to switch between ar / fr / en / tz.
 */
export default function LanguageSwitcher({ compact = false }) {
  const { lang, setLang } = useI18n()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const btnRef = useRef(null)
  const current = LANGUAGES.find((l) => l.code === lang)

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onEsc = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        btnRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        ref={btnRef}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="تغيير اللغة"
        className="btn btn-ghost btn-sm !gap-1.5 !px-2.5"
      >
        <Globe size={16} />
        <span className="font-semibold text-xs">{current.code.toUpperCase()}</span>
        <ChevronDown
          size={12}
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="اللغات"
          className="card absolute z-[200] mt-2 py-1.5 animate-fade-up min-w-[180px]"
          style={{ insetInlineEnd: 0 }}
        >
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              role="option"
              aria-selected={l.code === lang}
              onClick={() => {
                setLang(l.code)
                setOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-brand-50 transition-colors ${
                l.code === lang ? 'text-brand-600 font-bold' : 'text-ink-700'
              }`}
            >
              <span className="text-base" aria-hidden="true">{l.flag}</span>
              <span className="flex-1 text-start">{l.label}</span>
              {l.code === lang && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
