import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Store, ChevronLeft, Leaf, Tractor, Users, Star,
  Search, ShoppingCart, Sprout, ShieldCheck,
} from 'lucide-react'
import { useI18n } from '../i18n'
import { useInView, useCountUp, useWishlist } from '../hooks'
import { STATS } from '../data'
import { getProducts } from '../lib/store'
import { useAuth } from '../context/AuthContext'
import ProductCard from '../components/ProductCard'
import BrandShowcase from '../components/BrandShowcase'
import Seo from '../components/Seo'

const STEPS_ICONS = [Tractor, Search, ShoppingCart, Sprout]
const STATS_ICONS = { Leaf, Tractor, Users, Star }

function CountUp({ target }) {
  const [ref, inView] = useInView()
  const num = parseInt(String(target).replace(/[^0-9]/g, ''))
  const value = useCountUp(num, 2000, inView)
  const suffix = String(target).replace(/[0-9,]/g, '')
  return <span ref={ref}>{value.toLocaleString('ar-DZ')}{suffix}</span>
}

function StatsSection() {
  const { t } = useI18n()
  const [ref, inView] = useInView()
  return (
    <section ref={ref} className="py-20 container-page">
      <div className="text-center mb-13">
        <h2 className="section-title">{t('home.statsTitle')}</h2>
        <p className="section-sub">{t('home.statsSub')}</p>
      </div>
      <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))' }}>
        {STATS.map((s, i) => {
          const Icon = STATS_ICONS[s.iconKey] || Leaf
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="card text-center p-7"
            >
              <div className="inline-flex w-14 h-14 rounded-2xl bg-brand-50 items-center justify-center text-brand-600 mb-3">
                <Icon size={28} />
              </div>
              <div className="text-3xl font-extrabold text-brand-600 mb-1.5">
                <CountUp target={s.value} />
              </div>
              <div className="text-sm text-ink-500 leading-relaxed">{t(s.labelKey)}</div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

function HowItWorks() {
  const { t } = useI18n()
  const [ref, inView] = useInView()
  const steps = [
    { icon: Tractor, title: t('home.step1Title'), desc: t('home.step1Desc') },
    { icon: Search,  title: t('home.step2Title'), desc: t('home.step2Desc') },
    { icon: ShoppingCart, title: t('home.step3Title'), desc: t('home.step3Desc') },
    { icon: Sprout,  title: t('home.step4Title'), desc: t('home.step4Desc') },
  ]
  return (
    <section ref={ref} className="py-20 bg-brand-50/40">
      <div className="container-page">
        <div className="text-center mb-13">
          <h2 className="section-title">{t('home.howTitle')}</h2>
          <p className="section-sub">{t('home.howSub')}</p>
        </div>
        <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {steps.map((s, i) => {
            const Icon = STEPS_ICONS[i]
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.14, duration: 0.5 }}
                className="card text-center p-7"
              >
                <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-brand items-center justify-center text-white mb-3">
                  <Icon size={26} />
                </div>
                <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-600 font-extrabold text-sm flex items-center justify-center mx-auto mb-3">
                  {i + 1}
                </div>
                <h3 className="text-base font-bold text-ink-900 mb-2">{s.title}</h3>
                <p className="text-[13px] text-ink-500 leading-relaxed">{s.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  const { t } = useI18n()
  const { user } = useAuth()
  const [ref, inView] = useInView()
  return (
    <section ref={ref} className="py-20 bg-gradient-brand text-white">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="container-page max-w-2xl text-center"
      >
        <div className="inline-flex w-16 h-16 rounded-2xl bg-white/15 items-center justify-center mb-4">
          <Leaf size={32} />
        </div>
        <h2 className="text-4xl font-extrabold mb-3.5">{t('home.ctaTitle')}</h2>
        <p className="text-base text-white/85 leading-relaxed mb-8">{t('home.ctaDesc')}</p>
        <div className="flex gap-3.5 justify-center flex-wrap">
          {user ? (
            <Link to="/dashboard" className="btn btn-lg bg-white text-brand-600 hover:no-underline hover:bg-brand-50">
              {user?.role === 'farmer' ? 'بيع منتجاتك الآن' : user?.role === 'admin' ? 'لوحة الإدارة' : t('home.ctaStart')}
            </Link>
          ) : (
            <Link to="/auth" className="btn btn-lg bg-white text-brand-600 hover:no-underline hover:bg-brand-50">
              {t('home.ctaStart')}
            </Link>
          )}
          <Link to="/about" className="btn btn-lg border-2 border-white/50 text-white hover:no-underline hover:bg-white/10">
            {t('home.ctaLearnMore')}
          </Link>
        </div>
      </motion.div>
    </section>
  )
}

export default function HomePage() {
  const { t } = useI18n()
  const { user } = useAuth()
  const { toggle, isWished } = useWishlist()
  const [ref, inView] = useInView(0.05)
  const [loaded, setLoaded] = useState(false)
  const [products, setProducts] = useState([])
  useEffect(() => {
    const id = setTimeout(() => setLoaded(true), 60)
    return () => clearTimeout(id)
  }, [])

  // Fetch latest products from localStorage
  useEffect(() => {
    const data = getProducts()
    setProducts(data.slice(0, 4))
  }, [])

  const benefits = [
    { icon: ShieldCheck, label: t('home.secure') },
    { icon: Store,       label: t('home.fastDelivery') },
    { icon: Star,        label: t('home.quality') },
  ]

  return (
    <div>
      <Seo titleKey="home.heroTitle" descKey="home.heroDesc" path="/" />

      {/* Hero */}
      <section className="min-h-screen relative flex items-center overflow-hidden pt-20">
        {/* Decorative rotating rings */}
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="absolute rounded-full border border-brand-200 animate-spin-slow pointer-events-none"
            style={{
              width: `${200 + i * 90}px`,
              height: `${200 + i * 90}px`,
              top: `${8 + i * 12}%`,
              insetInlineEnd: `${-5 + i * 9}%`,
              opacity: 0.3,
              animationDuration: `${20 + i * 6}s`,
            }}
          />
        ))}

        <div className="container-page w-full py-12">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-12 items-center">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9 }}
            >
              <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 rounded-full ps-3 pe-4 py-1.5 mb-6">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                <span className="text-xs text-brand-600 font-semibold">{t('home.badge')}</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-ink-900 mb-4.5">
                {t('home.heroTitle').split('،').map((part, i) =>
                  i === 1
                    ? <span key={i} className="text-gradient">،{part}</span>
                    : <span key={i}>{part}</span>
                )}
              </h1>

              <p className="text-base text-ink-500 leading-relaxed mb-7 max-w-md">
                {t('home.heroDesc')}
              </p>

              <div className="flex gap-3.5 flex-wrap">
                {/* Role-aware hero buttons */}
                {user?.role === 'farmer' ? (
                  <Link to="/dashboard" className="btn btn-primary btn-lg hover:no-underline">
                    <Store size={18} /> بيع منتجاتك
                  </Link>
                ) : user?.role === 'admin' ? (
                  <Link to="/dashboard" className="btn btn-primary btn-lg hover:no-underline">
                    <Store size={18} /> لوحة الإدارة
                  </Link>
                ) : user ? (
                  <Link to="/market" className="btn btn-primary btn-lg hover:no-underline">
                    <Store size={18} /> {t('home.browseMarket')}
                  </Link>
                ) : (
                  <>
                    <Link to="/market" className="btn btn-primary btn-lg hover:no-underline">
                      <Store size={18} /> {t('home.browseMarket')}
                    </Link>
                    <Link to="/auth" className="btn btn-outline btn-lg hover:no-underline">
                      {t('home.joinFree')}
                    </Link>
                  </>
                )}
              </div>

              <div className="flex gap-5 mt-8 flex-wrap">
                {benefits.map((b) => (
                  <span key={b.label} className="inline-flex items-center gap-1.5 text-xs text-ink-500">
                    <b.icon size={14} className="text-brand-500" /> {b.label}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Hero image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.1, delay: 0.2 }}
              className="relative hidden md:block"
            >
              <div className="rounded-3xl overflow-hidden shadow-hero">
                <img
                  src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=700&h=500&fit=crop"
                  alt={t('home.heroTitle')}
                  width={700}
                  height={500}
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.45) 100%)' }} />
              </div>
              {/* Floating cards */}
              <div className="card absolute -bottom-4 -right-4 ps-4 pe-5 py-3 animate-fade-up">
                <div className="text-[11px] text-ink-400 mb-1">{t('home.savedToday')}</div>
                <div className="text-2xl font-extrabold text-brand-600">1,240 <span className="text-sm font-medium">كغ</span></div>
                <div className="text-[11px] text-ink-500">{t('home.fromFoodWaste')}</div>
              </div>
              <div className="card absolute -top-4 -left-4 ps-4 pe-5 py-3 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                <div className="text-[11px] text-ink-400 mb-1">{t('home.farmersSuppliers')}</div>
                <div className="text-2xl font-extrabold text-gold-600">3,200+</div>
                <div className="text-[11px] text-ink-500">{t('home.acrossAlgeria')}</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="animate-bounce-y absolute bottom-7 left-1/2 -translate-x-1/2 opacity-60">
          <div className="w-6 h-10 border-2 border-brand-300 rounded-xl flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-brand-500 rounded" />
          </div>
        </div>
      </section>

      <StatsSection />

      {/* Featured products */}
      <section ref={ref} className="py-20 bg-white">
        <div className="container-page">
          <div className="flex justify-between items-end mb-9 flex-wrap gap-4">
            <div>
              <h2 className="section-title">{t('home.featuredTitle')}</h2>
              <p className="section-sub">{t('home.featuredSub')}</p>
            </div>
            <Link to="/market" className="btn btn-outline hover:no-underline">
              {t('home.viewAll')} <ChevronLeft size={14} />
            </Link>
          </div>
          <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
            {products.slice(0, 4).map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 22 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <ProductCard product={p} isWished={isWished(p.id)} onWishToggle={toggle} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />
      <BrandShowcase />
      <CTASection />
    </div>
  )
}
