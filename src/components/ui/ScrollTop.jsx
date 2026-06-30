import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

/**
 * ScrollTop — floating button to scroll back to top of page.
 */
export default function ScrollTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setVisible(window.scrollY > 500))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="العودة للأعلى"
      className="btn btn-primary fixed z-[500] !rounded-full !p-0 animate-fade-in"
      style={{ width: 44, height: 44, bottom: '1.5rem', insetInlineStart: '1.5rem' }}
    >
      <ArrowUp size={18} />
    </button>
  )
}
