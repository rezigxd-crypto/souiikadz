import { Link } from 'react-router-dom'
import {
  Wheat, Milk, Droplet, Beef,
  Sparkles, Plus, ArrowRight,
} from 'lucide-react'
import { useI18n } from '../i18n'
import { useInView } from '../hooks'
import { motion } from 'framer-motion'
import { BRANDS, BRAND_NAMES } from '../data'

// Map iconKey strings from data to Lucide icon components
const ICONS = { Wheat, Milk, Droplet, Beef }

export default function BrandShowcase() {
  const { t, lang, dir } = useI18n()
  const [ref, inView] = useInView()

  // Build the marquee track: real brands + empty slots, duplicated for seamless loop.
  // Duplicating the list once is enough to create a continuous scroll (when the
  // second copy reaches where the first started, the animation loops).
  const track = [...BRANDS, ...BRANDS]

  // Localized helper to read a brand's name + tagline
  const brandText = (brandKey) => {
    const entry = BRAND_NAMES[lang]?.[brandKey] || BRAND_NAMES.ar[brandKey]
    return entry || { name: '', tagline: '' }
  }

  return (
    <section ref={ref} className="py-20 bg-gradient-meadow overflow-hidden">
      <div className="container-page text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 rounded-full ps-3 pe-4 py-1.5 mb-4">
            <Sparkles size={14} className="text-gold-600" />
            <span className="text-xs text-brand-600 font-semibold">{t('brands.sponsored')}</span>
          </div>
          <h2 className="section-title">{t('brands.title')}</h2>
          <p className="section-sub max-w-2xl mx-auto">{t('brands.subtitle')}</p>
        </motion.div>
      </div>

      {/* ─── Marquee ──────────────────────────────────────────────────────────
        - Two edge-fade masks (left + right) so cards gently appear/disappear
        - Track is `display: flex` + `width: max-content` so it sizes to content
        - Animation is CSS-only (transform: translateX), GPU-accelerated, no JS
        - Direction reverses automatically for RTL vs LTR languages
        - Pauses on hover so users can read each card
        - Respects prefers-reduced-motion (stops the animation)
      ────────────────────────────────────────────────────────────────────── */}
      <div
        className="relative"
        style={{
          // Edge fades mask both ends
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)',
          maskImage:
            'linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)',
        }}
      >
        <div
          className="brand-marquee-track flex gap-5 w-max"
          style={{
            animationName: 'brandMarquee',
            animationDuration: '40s',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            // RTL: scroll right-to-left visually still = content moves left
            // LTR: same — content always moves left so reading order is natural
            // We just flip the keyframe direction via the `dir` attribute.
            direction: 'ltr', // force LTR on the track so the keyframe math is consistent
          }}
        >
          {track.map((brand, i) => {
            if (brand.empty) {
              return <EmptyBrandCard key={`empty-${i}`} t={t} />
            }
            const Icon = ICONS[brand.iconKey] || Wheat
            const { name, tagline } = brandText(brand.brandKey)
            return (
              <BrandCard
                key={`${brand.brandKey}-${i}`}
                Icon={Icon}
                name={name}
                tagline={tagline}
                color={brand.color}
                t={t}
              />
            )
          })}
        </div>
      </div>

      {/* Collab CTA */}
      <div className="container-page mt-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card max-w-3xl mx-auto p-8 text-center"
          style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0faf0 100%)' }}
        >
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-brand items-center justify-center text-white mb-4">
            <Sparkles size={26} />
          </div>
          <h3 className="text-xl font-extrabold text-ink-900 mb-2">{t('brands.collabWithUs')}</h3>
          <p className="text-sm text-ink-500 leading-relaxed max-w-xl mx-auto mb-5">
            {t('brands.collabDesc')}
          </p>
          <Link
            to="/about"
            className="btn btn-primary btn-lg hover:no-underline inline-flex"
          >
            {t('brands.contactUs')}
            <ArrowRight size={16} className="rtl:flip" />
          </Link>
        </motion.div>
      </div>

      <style>{`
        @keyframes brandMarquee {
          0%   { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .brand-marquee-track:hover {
          animation-play-state: paused;
        }
        /* Pause for users who prefer reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .brand-marquee-track {
            animation: none !important;
            transform: none !important;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
          }
          .brand-marquee-track > * {
            scroll-snap-align: start;
          }
        }
        /* Mirror arrows for RTL */
        [dir="rtl"] .rtl\\:flip {
          transform: scaleX(-1);
        }
      `}</style>
    </section>
  )
}

// ─── Real brand card ──────────────────────────────────────────────────────────
function BrandCard({ Icon, name, tagline, color, t }) {
  return (
    <div
      className="card flex-shrink-0 w-72 p-5 flex items-center gap-4"
      style={{ borderColor: `${color}40` }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white flex-shrink-0"
        style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
        aria-hidden="true"
      >
        <Icon size={26} />
      </div>
      <div className="flex-1 min-w-0 text-left" style={{ direction: 'ltr' }}>
        <div className="font-extrabold text-ink-900 text-base leading-tight truncate">
          {name}
        </div>
        <div className="text-[11px] text-ink-500 leading-snug mt-0.5 line-clamp-2">
          {tagline}
        </div>
      </div>
      <span className="badge badge-brand flex-shrink-0">{t('brands.sponsored')}</span>
    </div>
  )
}

// ─── Empty invitation slot ────────────────────────────────────────────────────
function EmptyBrandCard({ t }) {
  return (
    <div
      className="card flex-shrink-0 w-72 p-5 flex items-center gap-4 border-dashed"
      style={{
        background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 10px, #f0faf0 10px, #f0faf0 20px)',
        borderColor: '#bbe1bb',
        borderStyle: 'dashed',
      }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-brand-500 flex-shrink-0 bg-brand-50 border-2 border-dashed border-brand-300"
        aria-hidden="true"
      >
        <Plus size={26} />
      </div>
      <div className="flex-1 min-w-0 text-left" style={{ direction: 'ltr' }}>
        <div className="font-extrabold text-brand-600 text-base leading-tight">
          {t('brands.yourBrandHere')}
        </div>
        <div className="text-[11px] text-ink-400 leading-snug mt-0.5">
          {t('brands.emptySlot')}
        </div>
      </div>
    </div>
  )
}
