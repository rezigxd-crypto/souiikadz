import { useEffect, useRef, useState } from 'react'

/**
 * AlgeriaMapBackground — uses the REAL Algeria map (58 wilayas), rendered
 * as a pre-rasterized PNG/WebP for buttery-smooth parallax scrolling.
 *
 * Performance optimizations (the SVG version was janky because the browser
 * re-rasterized the 58 complex paths on every scroll-triggered transform):
 *
 *   1. Pre-rasterized PNG/WebP image instead of inline SVG
 *      → Browser composites the image in O(1); no path re-rasterization
 *      → ~10× smaller payload (WebP 28KB vs SVG 302KB)
 *   2. will-change: transform on parallax layers → GPU compositing
 *   3. translate3d() instead of translateY() → forces GPU layer
 *   4. rAF-throttled single scroll listener
 *   5. Parallax DISABLED on mobile (≤768px) — janky on mobile GPUs
 *   6. Parallax DISABLED when prefers-reduced-motion is set
 *   7. CSS animations only (sway, floatUp) — never JS-driven
 *   8. Particle count adapts to screen width (mobile: 6, desktop: 12)
 *   9. Trees rendered in a single SVG (one DOM subtree), not 22 separate ones
 *   10. contain: strict on the container → browser skips outside-bounds work
 *
 * Layers (back to front):
 *   1. Gradient sky
 *   2. Top glow (fades on scroll)
 *   3. Distant hills (slowest parallax)
 *   4. Algeria map image (medium parallax, static on mobile)
 *   5. Trees + city dots (slight parallax)
 *   6. Foreground hills (fastest parallax)
 *   7. Floating pollen particles (CSS animation only)
 *   8. Vignette
 *
 * Map attribution: © Simplemaps.com — https://simplemaps.com
 */

const TREES = [
  // Oran / Tlemcen coast
  { x: 165, y: 250, s: 0.95 }, { x: 195, y: 245, s: 1.00 },
  { x: 220, y: 260, s: 0.85 }, { x: 180, y: 280, s: 0.90 },
  // Algiers / Blida / Tipaza
  { x: 270, y: 235, s: 1.05 }, { x: 295, y: 245, s: 0.95 },
  { x: 320, y: 250, s: 0.90 }, { x: 280, y: 270, s: 0.85 },
  // Bejaia / Tizi Ouzou
  { x: 355, y: 235, s: 1.00 }, { x: 380, y: 245, s: 0.95 },
  { x: 365, y: 265, s: 0.90 },
  // Jijel / Skikda / Annaba (greenest corner)
  { x: 420, y: 225, s: 1.10 }, { x: 445, y: 235, s: 1.00 },
  { x: 470, y: 240, s: 0.95 }, { x: 430, y: 260, s: 0.90 },
  { x: 460, y: 255, s: 0.85 },
  // Constantine / Mila inland
  { x: 395, y: 275, s: 0.80 }, { x: 425, y: 285, s: 0.75 },
  // Southern oases (fewer, smaller)
  { x: 310, y: 350, s: 0.55 }, { x: 380, y: 380, s: 0.50 },
  { x: 450, y: 360, s: 0.55 }, { x: 280, y: 420, s: 0.45 },
  { x: 360, y: 450, s: 0.40 },
]

const CITIES = [
  { x: 280, y: 245, r: 3 },  // Algiers
  { x: 195, y: 255, r: 3 },  // Oran
  { x: 395, y: 270, r: 3 },  // Constantine
  { x: 295, y: 250, r: 2 },  // Blida
  { x: 355, y: 250, r: 2 },  // Tizi Ouzou
  { x: 470, y: 240, r: 3 },  // Annaba
  { x: 360, y: 360, r: 2 },  // Biskra
  { x: 320, y: 700, r: 2 },  // Tamanrasset
]

function generateParticles(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: 4 + Math.random() * 8,
    duration: 14 + Math.random() * 18,
    delay: -Math.random() * 30,
    drift: (Math.random() - 0.5) * 50,
    opacity: 0.25 + Math.random() * 0.3,
  }))
}

export default function AlgeriaMapBackground({ intensity = 'full' }) {
  const [scrollY, setScrollY] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const rafRef = useRef(0)

  // Detect screen size + reduced-motion preference
  useEffect(() => {
    const mq       = window.matchMedia('(max-width: 768px)')
    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      setIsMobile(mq.matches)
      setReducedMotion(mqReduce.matches)
    }
    update()
    mq.addEventListener('change', update)
    mqReduce.addEventListener('change', update)
    return () => {
      mq.removeEventListener('change', update)
      mqReduce.removeEventListener('change', update)
    }
  }, [])

  // rAF-throttled scroll listener — only active when parallax is enabled
  const parallaxOn = !isMobile && !reducedMotion
  useEffect(() => {
    if (!parallaxOn) {
      setScrollY(0)
      return
    }
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => setScrollY(window.scrollY))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [parallaxOn])

  // Particle density: fewer on mobile, none if reduced motion
  const particleCount = reducedMotion ? 0 : (isMobile ? 6 : 12)
  const particles = generateParticles(particleCount)

  // Parallax offsets — different speeds for depth (0 when disabled)
  const layer1 = parallaxOn ? scrollY * 0.05 : 0
  const layer2 = parallaxOn ? scrollY * 0.12 : 0
  const layer3 = parallaxOn ? scrollY * 0.22 : 0
  const layer4 = parallaxOn ? scrollY * 0.30 : 0
  const fade   = parallaxOn ? Math.max(0, 1 - scrollY / 800) : 1

  // Hardware-accelerated transform helper
  const tx = (y) => `translate3d(0, ${y}px, 0)`

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      style={{
        background:
          'linear-gradient(180deg, #f0faf0 0%, #dcf0dc 30%, #fefdf7 60%, #f0faf0 100%)',
        contain: 'strict',
      }}
    >
      {/* Top soft glow */}
      <div
        className="absolute inset-x-0 top-0"
        style={{
          height: '50vh',
          background: 'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(45,155,90,0.18), transparent 70%)',
          opacity: fade,
          willChange: 'opacity',
        }}
      />

      {/* Layer 1 — Distant hills (slowest parallax) */}
      <svg
        className="absolute inset-x-0"
        style={{ top: 0, transform: tx(layer1), willChange: 'transform' }}
        width="100%"
        height="100%"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="hill-far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#bbe1bb" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#8ccb8c" stopOpacity="0.25" />
          </linearGradient>
        </defs>
        <path
          d="M0 600 Q 200 540 400 580 T 800 560 T 1200 580 T 1440 570 L 1440 900 L 0 900 Z"
          fill="url(#hill-far)"
        />
      </svg>

      {/* Layer 2 — REAL Algeria map (medium parallax) as pre-rasterized image */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `${tx(layer2 * 0.55)} scale(${isMobile ? 1.35 : 1.05})`,
          opacity: 0.55 + fade * 0.45,
          willChange: 'transform, opacity',
        }}
      >
        <picture>
          {/* Modern browsers get WebP (much smaller) */}
          <source
            type="image/webp"
            srcSet="/dz-600.webp 600w, /dz-1200.webp 1200w"
            sizes={isMobile ? '600px' : '1200px'}
          />
          {/* Fallback PNG for older browsers */}
          <img
            src="/dz-1200.png"
            srcSet="/dz-600.png 600w, /dz-1200.png 1200w"
            sizes={isMobile ? '600px' : '1200px'}
            alt=""
            width={1000}
            height={1000}
            decoding="async"
            loading="eager"
            fetchPriority="low"
            style={{
              width: isMobile ? '140%' : '95%',
              height: 'auto',
              filter: 'saturate(0.85) drop-shadow(0 8px 32px rgba(45,107,58,0.20))',
              opacity: 0.85,
              userSelect: 'none',
              WebkitUserDrag: 'none',
            }}
          />
        </picture>
      </div>

      {/* Layer 3 — Trees + city markers (slight parallax) */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `${tx(layer3 * 0.45)} scale(${isMobile ? 1.35 : 1.05})`,
          opacity: 0.7 + fade * 0.30,
          willChange: 'transform, opacity',
        }}
      >
        <svg
          width={isMobile ? '140%' : '95%'}
          height="auto"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid meet"
          style={{ filter: 'drop-shadow(0 4px 12px rgba(29,107,58,0.18))' }}
        >
          <defs>
            <radialGradient id="tree-grad" cx="50%" cy="40%" r="60%">
              <stop offset="0%"  stopColor="#2d9b5a" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#1a6b3a" stopOpacity="0.55" />
            </radialGradient>
          </defs>

          {/* City dots — single CSS pulse on the parent group, not per-circle */}
          <g className="animate-pulse-slow">
            {CITIES.map((c, i) => (
              <g key={i}>
                <circle cx={c.x} cy={c.y} r={c.r} fill="#1a6b3a" fillOpacity="0.85" />
                <circle cx={c.x} cy={c.y} r={c.r + 4} fill="none" stroke="#1a6b3a" strokeOpacity="0.35" strokeWidth="1" />
              </g>
            ))}
          </g>

          {/* Tree clusters — each sways independently (CSS only) */}
          {TREES.map((t, i) => (
            <g
              key={`tree-${i}`}
              transform={`translate(${t.x} ${t.y}) scale(${t.s})`}
              className="animate-sway"
              style={{
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${8 + (i % 4) * 2}s`,
                transformOrigin: 'center',
                transformBox: 'fill-box',
              }}
            >
              <rect x="-1.4" y="2" width="2.8" height="9" rx="1" fill="#8a6f1a" fillOpacity="0.65" />
              <circle cx="0"  cy="-3" r="8"  fill="url(#tree-grad)" />
              <circle cx="-6" cy="2"  r="6"  fill="url(#tree-grad)" />
              <circle cx="6"  cy="2"  r="6"  fill="url(#tree-grad)" />
            </g>
          ))}
        </svg>
      </div>

      {/* Layer 4 — Foreground hills (fastest parallax) */}
      <svg
        className="absolute inset-x-0 bottom-0"
        style={{ transform: tx(layer4 * 0.25), height: '40vh', willChange: 'transform' }}
        width="100%"
        viewBox="0 0 1440 400"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <linearGradient id="hill-near" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8ccb8c" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#57af57" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path
          d="M0 250 Q 200 200 400 240 T 800 220 T 1200 250 T 1440 230 L 1440 400 L 0 400 Z"
          fill="url(#hill-near)"
        />
      </svg>

      {/* Floating particles (CSS animation only — no JS) */}
      {intensity !== 'minimal' && particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}vw`,
            bottom: '-10vh',
            width: p.size,
            height: p.size,
            background: 'radial-gradient(circle, rgba(45,155,90,0.5), rgba(45,155,90,0.1))',
            opacity: p.opacity,
            animation: `floatUp ${p.duration}s linear ${p.delay}s infinite`,
            ['--drift']: `${p.drift}px`,
            willChange: 'transform, opacity',
          }}
        />
      ))}

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 60%, rgba(255,255,255,0.4) 100%)',
        }}
      />

      <style>{`
        @keyframes floatUp {
          0%   { transform: translate3d(0, 0, 0); opacity: 0; }
          10%  { opacity: 0.5; }
          90%  { opacity: 0.5; }
          100% { transform: translate3d(var(--drift, 0), -130vh, 0); opacity: 0; }
        }
        .animate-pulse-slow { animation: pulseSlow 3s ease-in-out infinite; }
        @keyframes pulseSlow {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
