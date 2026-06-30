import { useState, useEffect, useRef } from 'react'

// ─── Scroll position ──────────────────────────────────────────────────────────
export function useScrollY() {
  const [y, setY] = useState(0)
  useEffect(() => {
    const handle = () => setY(window.scrollY)
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [])
  return y
}

// ─── IntersectionObserver ─────────────────────────────────────────────────────
export function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

// ─── Countdown timer ──────────────────────────────────────────────────────────
export function useCountdown(hours) {
  const [timeLeft, setTimeLeft] = useState(Math.floor(hours * 3600))
  useEffect(() => {
    if (timeLeft <= 0) return
    const t = setInterval(() => setTimeLeft((p) => Math.max(0, p - 1)), 1000)
    return () => clearInterval(t)
  }, [])
  const h = Math.floor(timeLeft / 3600)
  const m = Math.floor((timeLeft % 3600) / 60)
  const s = timeLeft % 60
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}

// ─── Wishlist ─────────────────────────────────────────────────────────────────
export function useWishlist() {
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('suwaika-wishlist') || '[]')
    } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('suwaika-wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const toggle = (id) =>
    setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]))

  const isWished = (id) => wishlist.includes(id)

  return { wishlist, toggle, isWished }
}

// ─── Count up animation ───────────────────────────────────────────────────────
export function useCountUp(target, duration = 2000, trigger = true) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!trigger) return
    const num = parseInt(String(target).replace(/[^0-9]/g, ''))
    if (!num) return
    let start = 0
    const step = num / (duration / 16)
    const t = setInterval(() => {
      start = Math.min(start + step, num)
      setValue(Math.floor(start))
      if (start >= num) clearInterval(t)
    }, 16)
    return () => clearInterval(t)
  }, [trigger, target, duration])
  return value
}

// ─── Local storage ────────────────────────────────────────────────────────────
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initial
    } catch { return initial }
  })
  const set = (v) => {
    setValue(v)
    localStorage.setItem(key, JSON.stringify(v))
  }
  return [value, set]
}
