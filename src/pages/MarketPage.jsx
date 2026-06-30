import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, SearchX, Truck, RotateCcw } from 'lucide-react'
import { useI18n } from '../i18n'
import { useWishlist, useInView } from '../hooks'
import { CATEGORIES, CATEGORY_VALUES, pt } from '../data'
import { wilayaOptions } from '../data/wilayas'
import { getProducts } from '../lib/store'
import ProductCard from '../components/ProductCard'
import { ProductCardSkeleton } from '../components/ui/Skeleton'
import Seo from '../components/Seo'

export default function MarketPage() {
  const { t, lang } = useI18n()
  const { toggle, isWished } = useWishlist()
  const [cat, setCat] = useState('الكل')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('default')
  const [filterOpen, setFilterOpen] = useState(false)
  const [maxPrice, setMaxPrice] = useState(900)
  const [wilayaFilter, setWilayaFilter] = useState('')
  const [deliveryOnly, setDeliveryOnly] = useState(false)
  const [freshness, setFreshness] = useState('any')
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [headerRef, headerInView] = useInView(0.05)

  // Fetch products from Supabase on mount + when filters change
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const data = await getProducts({
          category: cat,
          sort,
          maxPrice,
          wilayaCode: wilayaFilter ? parseInt(wilayaFilter) : null,
          deliveryOnly,
        })
        if (!cancelled) setProducts(data || [])
      } catch (err) {
        console.error('Failed to load products:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [cat, sort, maxPrice, wilayaFilter, deliveryOnly])

  // Client-side freshness + search filter (these can't easily be done in SQL)
  const filtered = useMemo(() => products
    .filter((p) => {
      if (freshness === 'any') return true
      const postedAt = p.posted_at ? new Date(p.posted_at).getTime() : Date.now()
      const hoursElapsed = (Date.now() - postedAt) / 3_600_000
      if (freshness === 'fresh') return hoursElapsed < 24
      if (freshness === 'recent') return hoursElapsed < 72
      if (freshness === 'old') return hoursElapsed >= 72
      return true
    })
    .filter((p) => {
      if (!search) return true
      const q = search.toLowerCase()
      const variants = p.t ? Object.values(p.t).flatMap((v) => [v.name, v.seller, v.location]) : []
      return variants.some((v) => v.toLowerCase().includes(q))
    }), [products, freshness, search])

  const catLabel = (ar) => {
    const found = CATEGORIES.find((c) => c.ar === ar)
    return found ? t(found.key) : ar
  }

  const resetFilters = () => {
    setCat('الكل'); setSearch(''); setSort('default'); setMaxPrice(900)
    setWilayaFilter(''); setDeliveryOnly(false); setFreshness('any')
  }

  return (
    <div className="min-h-screen pt-20">
      <Seo titleKey="market.title" descKey="market.subtitle" path="/market" />

      <div ref={headerRef} className="bg-gradient-to-b from-brand-50 to-transparent pt-10 pb-7">
        <div className="container-page">
          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={headerInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4 }} className="text-4xl font-extrabold text-ink-900 mb-1.5">{t('market.title')}</motion.h1>
          <p className="text-ink-500 mb-5.5">{t('market.subtitle')}</p>

          <div className="flex gap-2.5 max-w-xl">
            <div className="flex-1 relative">
              <Search size={18} className="absolute top-1/2 -translate-y-1/2 text-brand-500 pointer-events-none" style={{ insetInlineStart: '0.9rem' }} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('market.searchPlaceholder')} className="input" style={{ paddingInlineStart: '2.75rem' }} aria-label={t('common.search')} />
            </div>
            <button onClick={() => setFilterOpen((o) => !o)} aria-expanded={filterOpen} className={`btn ${filterOpen ? 'btn-primary' : 'btn-outline'}`}>
              <SlidersHorizontal size={16} /> <span className="hidden sm:inline">{t('common.filter')}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container-page py-5.5">
        {filterOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card p-5 mb-5.5 grid md:grid-cols-2 grid-cols-1 gap-4">
            <div>
              <label className="label">{t('market.sortBy')}</label>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="select">
                <option value="default">{t('market.sortDefault')}</option>
                <option value="price_asc">{t('market.sortPriceAsc')}</option>
                <option value="price_desc">{t('market.sortPriceDesc')}</option>
                <option value="rating">{t('market.sortRating')}</option>
                <option value="expiry">{t('market.sortExpiry')}</option>
              </select>
            </div>
            <div>
              <label className="label">{t('market.maxPrice')}: <span className="text-gold-600">{maxPrice} {t('common.currency')}</span></label>
              <input type="range" min={20} max={900} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} />
            </div>
            <div>
              <label className="label">{t('wilaya.filterLabel')}</label>
              <select value={wilayaFilter} onChange={(e) => setWilayaFilter(e.target.value)} className="select">
                <option value="">{t('wilaya.all')}</option>
                {wilayaOptions(lang).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">{t('freshness.label')}</label>
              <select value={freshness} onChange={(e) => setFreshness(e.target.value)} className="select">
                <option value="any">{t('freshness.any')}</option>
                <option value="fresh">{t('freshness.fresh')}</option>
                <option value="recent">{t('freshness.recent')}</option>
                <option value="old">{t('freshness.old')}</option>
              </select>
            </div>
            <div className="md:col-span-2 flex items-center justify-between flex-wrap gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={deliveryOnly} onChange={(e) => setDeliveryOnly(e.target.checked)} className="w-4 h-4 accent-brand-500" />
                <span className="text-sm text-ink-700 font-medium flex items-center gap-1.5">
                  <Truck size={14} className="text-brand-600" />
                  {t('delivery.filterLabel')}
                </span>
              </label>
              <button onClick={resetFilters} className="btn btn-ghost btn-sm">
                <RotateCcw size={14} /> {t('filter.reset')}
              </button>
            </div>
          </motion.div>
        )}

        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-1" role="tablist">
          {CATEGORY_VALUES.map((c) => (
            <button key={c} onClick={() => setCat(c)} role="tab" aria-selected={cat === c} className={`pill ${cat === c ? 'pill-active' : ''}`}>{catLabel(c)}</button>
          ))}
        </div>

        <div className="mb-4 text-xs text-ink-500">{filtered.length} {t('market.productsCount')}</div>

        {loading ? (
          <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
            {[...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card text-center py-20">
            <div className="inline-flex w-16 h-16 rounded-2xl bg-brand-50 items-center justify-center text-brand-500 mb-4"><SearchX size={32} /></div>
            <h3 className="text-lg font-bold text-ink-700 mb-2">{t('market.noResults')}</h3>
            <p className="text-ink-500">{t('market.tryDifferent')}</p>
          </div>
        ) : (
          <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
            {filtered.map((p) => <ProductCard key={p.id} product={p} isWished={isWished(p.id)} onWishToggle={toggle} />)}
          </div>
        )}
      </div>
    </div>
  )
}
