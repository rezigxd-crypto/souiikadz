import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  MapPin, CheckCircle, Share2, ChevronLeft, Clock, ShoppingCart,
  Heart, Truck, Ban, ShieldCheck, BadgeDollarSign, RefreshCw,
  MessageCircle, TrendingDown, Sparkles, Star,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useToast } from '../components/ui/Toast'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../i18n'
import { useWishlist, useCountdown } from '../hooks'
import { getProduct, getProducts } from '../lib/store'
import { pt } from '../data'
import { wilayaName } from '../data/wilayas'
import { suggestDynamicPrice, formatPrice, suggestedDiscountPercent } from '../lib/pricing'
import ProductCard from '../components/ProductCard'
import { Button, StarRating, QuantityStepper, Badge } from '../components/ui'
import Seo from '../components/Seo'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addAndToast } = useCart()
  const { addToast } = useToast()
  const { user } = useAuth()
  const { t, lang } = useI18n()
  const { toggle, isWished } = useWishlist()
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState('desc')
  const [chatOpen, setChatOpen] = useState(false)
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)

  // Always call useCountdown — pass a safe default until product is loaded
  const timer = useCountdown(product?.expiry ?? 48)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const p = await getProduct(parseInt(id))
        if (cancelled) return
        setProduct(p)
        // Fetch related products (same category)
        const all = await getProducts()
        if (cancelled) return
        const cat = pt(p, lang, 'category')
        setRelated(all.filter((x) => pt(x, lang, 'category') === cat && x.id !== p.id).slice(0, 3))
      } catch (err) {
        if (!cancelled) setProduct(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [id, lang])

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-brand-600 animate-pulse">{t('common.loading')}</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Seo titleKey="detail.notFound" descKey="detail.notFound" path={`/product/${id}`} />
        <div className="text-center">
          <h2 className="text-xl font-bold text-ink-700 mb-3">{t('detail.notFound')}</h2>
          <Button onClick={() => navigate('/market')}>{t('detail.backToMarket')}</Button>
        </div>
      </div>
    )
  }

  const disc = Math.round((1 - product.discount / product.price) * 100)
  const name = pt(product, lang, 'name')
  const description = pt(product, lang, 'description')
  const seller = pt(product, lang, 'seller')
  const location = pt(product, lang, 'location')
  const category = pt(product, lang, 'category')
  const unit = pt(product, lang, 'unit')
  const badge = pt(product, lang, 'badge')

  const smartPrice = suggestDynamicPrice(product)
  const smartDiscount = suggestedDiscountPercent(product)
  const wilaya = wilayaName(product.wilayaCode, lang)
  const wished = isWished(product.id)
  const canChat = user && user.email !== product.farmerEmail

  const handleShare = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: name, url })
      } else {
        await navigator.clipboard.writeText(url)
        addToast(t('detail.shareSuccess'), 'success')
      }
    } catch {
      try {
        await navigator.clipboard.writeText(url)
        addToast(t('detail.shareSuccess'), 'success')
      } catch { addToast('Share failed', 'error') }
    }
  }

  const features = [
    { icon: Truck,           text: t('detail.fastDelivery') },
    { icon: ShieldCheck,     text: t('detail.qualityGuaranteed') },
    { icon: BadgeDollarSign, text: t('detail.bestPrice') },
    { icon: RefreshCw,       text: t('detail.refund') },
  ]

  const tabs = [
    { id: 'desc', label: t('detail.tabDescription') },
  ]

  return (
    <div className="min-h-screen pt-20">
      <Seo titleKey="home.heroTitle" descKey="home.heroDesc" path={`/product/${id}`} />

      <div className="container-page py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-6 text-xs text-ink-500" aria-label="breadcrumb">
          <Link to="/" className="hover:text-brand-600 hover:underline">{t('detail.breadcrumb')}</Link>
          <ChevronLeft size={14} />
          <Link to="/market" className="hover:text-brand-600 hover:underline">{t('detail.market')}</Link>
          <ChevronLeft size={14} />
          <span className="text-ink-900 font-semibold">{name}</span>
        </nav>

        <div className="grid gap-10 mb-12 items-start" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="card overflow-hidden relative">
              <img src={product.image} alt={name} width={500} height={375} className="w-full aspect-[4/3] object-cover" />
              {badge && <span className="badge badge-brand absolute top-4" style={{ insetInlineEnd: '1rem' }}>{badge}</span>}
              {product.expiry <= 48 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass text-ink-900 px-5 py-2 rounded-full flex items-center gap-2 text-sm font-bold">
                  <Clock size={16} /> {timer}
                </div>
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="text-xs text-brand-600 font-semibold mb-2">{category}</div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-ink-900 mb-3">{name}</h1>

            <div className="mb-4">
              <StarRating value={product.rating} size={16} count={product.reviews} />
            </div>

            {/* Price */}
            <div className="card bg-brand-50/60 p-4 mb-4.5">
              <div className="flex items-baseline gap-2.5 mb-1.5 flex-wrap">
                <span className="text-3xl font-extrabold text-brand-600">{product.discount * qty}</span>
                <span className="text-sm text-ink-500">{t('common.currency')} / {unit}</span>
                <Badge variant="gold">{t('detail.savePercent')} {disc}%</Badge>
              </div>
              <div className="text-xs text-ink-400">
                {t('detail.originalPrice')}: <span className="line-through">{product.price * qty} {t('common.currency')}</span>
              </div>
              {smartPrice < product.discount && (
                <div className="mt-3 p-3 bg-gradient-meadow rounded-lg border border-brand-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={14} className="text-gold-600" />
                    <span className="text-xs font-bold text-brand-700">{t('sub.smartPriceNow')}</span>
                  </div>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="text-2xl font-extrabold text-brand-600">{formatPrice(smartPrice, lang)}</span>
                      {smartDiscount > disc && <span className="text-xs text-brand-600 font-semibold ms-2">{t('sub.savePercent')} {smartDiscount}%</span>}
                    </div>
                    <span className="text-[10px] text-ink-500 flex items-center gap-1"><TrendingDown size={11} />{t('chat.smartPriceExplain')}</span>
                  </div>
                </div>
              )}
              {/* Delivery + wilaya info */}
              <div className="mt-2.5 flex items-center gap-2 text-xs flex-wrap">
                {product.deliveryAvailable ? (
                  <span className="badge badge-success"><Truck size={12} /> {t('delivery.available')}</span>
                ) : (
                  <span className="badge badge-danger"><Ban size={12} /> {t('delivery.notAvailable')}</span>
                )}
                {wilaya && <span className="text-ink-400">• {t('wilaya.label')}: {wilaya}</span>}
              </div>
            </div>

            {/* Seller */}
            <div className="card p-3 mb-4.5 flex items-center gap-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: 'linear-gradient(135deg, #1a6b3a, #c9a227)' }} aria-hidden="true">{seller[0]}</div>
              <div className="flex-1">
                <div className="text-sm font-bold text-ink-900">{seller}</div>
                <div className="text-xs text-ink-500 flex items-center gap-1"><MapPin size={11} /> {location} • {product.distance} {t('detail.fromYou')}</div>
              </div>
              <div className="text-xs text-brand-600 font-semibold flex items-center gap-1 flex-shrink-0"><CheckCircle size={13} /> {t('detail.verified')}</div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3 mb-4.5 flex-wrap">
              <span className="text-sm font-semibold text-ink-700">{t('detail.quantity')}</span>
              <QuantityStepper value={qty} min={1} max={product.stock} onChange={setQty} />
              <span className="text-xs text-ink-400">{product.stock} {unit} {t('detail.available')}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 mb-4">
              <Button onClick={() => addAndToast({ ...product }, qty)} size="lg" className="flex-1"><ShoppingCart size={18} /> {t('detail.addToCart')}</Button>
              <Button onClick={() => toggle(product.id)} variant="outline" size="lg" aria-label={t('product.wishlist')} aria-pressed={wished} className="!px-3"><Heart size={20} fill={wished ? '#c0392b' : 'none'} color={wished ? '#c0392b' : '#1a6b3a'} /></Button>
              <Button onClick={handleShare} variant="outline" size="lg" aria-label={t('detail.share')} className="!px-3"><Share2 size={18} /></Button>
            </div>

            {/* Chat with farmer */}
            {canChat && (
              <Button onClick={() => setChatOpen(true)} variant="gold" block size="lg" className="mb-4"><MessageCircle size={18} /> {t('chat.withFarmer')}</Button>
            )}
            {!user && (
              <div className="card p-3 mb-4 text-center bg-brand-50/60 text-xs text-ink-500">
                <Link to="/auth" className="text-brand-600 font-semibold hover:underline">{t('chat.loginToChat')}</Link>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-2 gap-2">
              {features.map((f) => (
                <div key={f.text} className="flex items-center gap-2 text-xs text-ink-500"><f.icon size={14} className="text-brand-500" /> {f.text}</div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tabs — description only (no fake reviews anymore) */}
        <div className="mb-9">
          <div className="flex gap-1 border-b border-brand-100 mb-5.5" role="tablist">
            <button className="px-5 py-2.5 text-sm font-semibold border-b-2 -mb-px text-brand-600 border-brand-500">{t('detail.tabDescription')}</button>
          </div>
          <p className="text-ink-500 leading-relaxed text-sm">{description}</p>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="text-xl font-extrabold text-ink-900 mb-5">{t('detail.relatedProducts')}</h2>
            <div className="grid gap-4.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
              {related.map((p) => <ProductCard key={p.id} product={p} isWished={isWished(p.id)} onWishToggle={toggle} />)}
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
