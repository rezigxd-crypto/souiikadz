import { MapPin, Eye, ShoppingCart, Clock, Heart, Truck, Ban } from 'lucide-react'
import { Link } from 'react-router-dom'
import { memo } from 'react'
import { useCart } from '../context/CartContext'
import { useI18n } from '../i18n'
import { useCountdown } from '../hooks'
import { StarRating } from './ui'
import { pt } from '../data'

const BADGE_VARIANT = {
  'ينتهي قريباً':   'danger',
  'الأكثر مبيعاً':  'gold',
  'جديد':           'brand',
  'عرض محدود':      'info',
  'الأفضل تقييماً': 'info',
  // English / French / Tamazight variants map back to the same colors
  'Expire bientôt':  'danger',
  'Expiring soon':   'danger',
  'Ad ifak dɣa':     'danger',
  'Best-seller':     'gold',
  'Best seller':     'gold',
  'D aɣurar yifen':  'gold',
  'Mieux noté':      'info',
  'Top rated':       'info',
  'Yettwazmel yifen':'info',
  'Nouveau':         'brand',
  'New':             'brand',
  'Amaynut':         'brand',
  'Offre limitée':   'info',
  'Limited offer':   'info',
  'Tafedniwt s talast':'info',
}

function ProductCardInner({ product, onWishToggle, isWished }) {
  const { addAndToast } = useCart()
  const { t, lang } = useI18n()
  const timer = useCountdown(product.expiry)
  const disc = Math.round((1 - product.discount / product.price) * 100)
  const urgent = product.expiry <= 24

  // Localized strings
  const name        = pt(product, lang, 'name')
  const description = pt(product, lang, 'description')
  const seller      = pt(product, lang, 'seller')
  const location    = pt(product, lang, 'location')
  const category    = pt(product, lang, 'category')
  const unit        = pt(product, lang, 'unit')
  const badge       = pt(product, lang, 'badge')

  const deliveryAvailable = product.deliveryAvailable ?? false
  const wilayaCode = product.wilayaCode ?? null

  const handleBuy = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addAndToast({ ...product, t: product.t }) // cart stores the whole product (with translations)
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className="card card-hover block hover:no-underline overflow-hidden relative"
    >
      {/* Badge */}
      {badge && (
        <span
          className={`badge badge-${BADGE_VARIANT[badge] || 'brand'} absolute top-3 z-10`}
          style={{ insetInlineEnd: '0.75rem' }}
        >
          {badge}
        </span>
      )}

      {/* Wishlist */}
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onWishToggle?.(product.id) }}
        aria-label={t('product.wishlist')}
        aria-pressed={isWished}
        className="absolute top-3 z-10 w-9 h-9 rounded-full glass flex items-center justify-center hover:scale-110 transition-transform"
        style={{ insetInlineStart: '0.75rem' }}
      >
        <Heart
          size={16}
          fill={isWished ? '#c0392b' : 'none'}
          color={isWished ? '#c0392b' : '#1a2a1a'}
        />
      </button>

      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={product.image}
          alt={name}
          loading="lazy"
          width={500}
          height={380}
          className="card-img w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.35) 0%, transparent 55%)' }}
        />
        {urgent && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 badge badge-danger glass animate-pulse">
            <Clock size={12} /> {timer}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3.5">
        <div className="text-[11px] text-brand-600 font-semibold mb-1">{category}</div>
        <h3 className="text-sm font-bold text-ink-900 mb-1.5 leading-snug line-clamp-2" style={{ minHeight: '2.6rem' }}>
          {name}
        </h3>

        <div className="flex items-center gap-1 mb-1.5 text-ink-500">
          <MapPin size={12} className="flex-shrink-0 text-brand-500" />
          <span className="text-xs">{location} • {product.distance} كم</span>
          {deliveryAvailable ? (
            <span className="badge badge-success ms-auto" title={t('delivery.available')}>
              <Truck size={10} />
            </span>
          ) : (
            <span className="badge badge-danger ms-auto" title={t('delivery.notAvailable')}>
              <Ban size={10} />
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mb-2.5">
          <StarRating value={product.rating} size={12} count={product.reviews} />
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xl font-extrabold text-brand-600 leading-none">
              {product.discount}
              <span className="text-xs font-medium text-ink-400 ms-1">{t('common.currency')}/{unit}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs text-ink-300 line-through">{product.price} {t('common.currency')}</span>
              <span className="badge badge-gold">-{disc}%</span>
            </div>
          </div>
          <div className="text-center text-ink-500">
            <div className="font-bold text-base text-ink-900">{product.stock}</div>
            <div className="text-[11px]">{t('product.remaining')}</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-[1fr_2fr] gap-2">
          <span className="btn btn-outline btn-sm hover:no-underline">
            <Eye size={14} /> {t('product.details')}
          </span>
          <button
            onClick={handleBuy}
            className="btn btn-primary btn-sm"
          >
            <ShoppingCart size={14} /> {t('product.buyNow')}
          </button>
        </div>
      </div>
    </Link>
  )
}

const ProductCard = memo(ProductCardInner)
export default ProductCard
