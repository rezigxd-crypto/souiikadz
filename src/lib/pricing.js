/**
 * Dynamic pricing engine + commission + payment methods for Suwaika Dezad.
 *
 * Algorithm:
 *   - At posting time (0% elapsed): suggested = current listed price
 *   - At expiry time (100% elapsed): suggested = floor (50% of current)
 *   - In between: linear interpolation
 */

export function suggestDynamicPrice(product, now = Date.now()) {
  const currentPrice = product.discount
  const totalHours = product.expiry
  const postedAt = product.postedAt || now
  const elapsedHours = Math.max(0, (now - postedAt) / 3_600_000)
  const remainingHours = Math.max(0, totalHours - elapsedHours)
  const ratio = totalHours > 0 ? remainingHours / totalHours : 0
  const floor = Math.round(currentPrice * 0.5)
  const suggested = Math.round(floor + (currentPrice - floor) * ratio)
  return Math.max(floor, Math.min(currentPrice, suggested))
}

export function getHoursElapsed(product, now = Date.now()) {
  const postedAt = product.postedAt || now
  return Math.max(0, Math.floor((now - postedAt) / 3_600_000))
}

export function getNegotiationSuggestions(product, now = Date.now()) {
  const current = product.discount
  const smart = suggestDynamicPrice(product, now)
  const bold = Math.round(Math.min(current * 0.85, smart - 2))
  const safe = Math.round(current * 0.95)
  return {
    current, smart,
    bold: Math.max(bold, Math.round(current * 0.4)),
    safe,
  }
}

export function formatPrice(amount, lang = 'ar') {
  const currency = { ar: 'دج', fr: 'DA', en: 'DZD', tz: 'DA' }[lang] || 'DA'
  return `${amount} ${currency}`
}

export function suggestedDiscountPercent(product, now = Date.now()) {
  const suggested = suggestDynamicPrice(product, now)
  const original = product.price
  if (original <= 0) return 0
  return Math.round((1 - suggested / original) * 100)
}

// ─── Platform commission (5% per sale) ─────────────────────────────────────
export const COMMISSION_RATE = 0.05
export function calculateCommission(subtotal) {
  return Math.round(subtotal * COMMISSION_RATE)
}
export function calculateFarmerEarnings(subtotal) {
  return subtotal - calculateCommission(subtotal)
}

// ─── Algerian payment methods ───────────────────────────────────────────────
// BaridiMob is the official mobile payment app of Algérie Poste.
// Edahabia is the national payment card.
// Source: https://baridimob.poste.dz / https://epaiement.poste.dz
export const PAYMENT_METHODS = [
  { id: 'baridimob', nameKey: 'pay.baridimob', descKey: 'pay.baridimobDesc', iconKey: 'Smartphone', color: '#FFCC00', textColor: '#0d2a0d' },
  { id: 'edahabia',  nameKey: 'pay.edahabia',  descKey: 'pay.edahabiaDesc',  iconKey: 'CreditCard', color: '#1a6b3a', textColor: '#ffffff' },
  { id: 'cod',       nameKey: 'pay.cod',       descKey: 'pay.codDesc',       iconKey: 'Banknote',   color: '#c9a227', textColor: '#1a1a00' },
]

// ─── Subscription plans (dynamic pricing — farmers only) ────────────────────
export const SUBSCRIPTION_PLANS = [
  {
    id: 'monthly', durationKey: 'sub.monthly', price: 1500, pricePerKey: 'sub.perMonth',
    periodMonths: 1, save: 0, featured: false,
    features: ['sub.featureDynamic', 'sub.featureChat', 'sub.featureAnalytics', 'sub.featureBadge'],
  },
  {
    id: 'seasonal', durationKey: 'sub.seasonal', price: 4000, pricePerKey: 'sub.per3Months',
    periodMonths: 3, save: 11, featured: true,
    features: ['sub.featureDynamic', 'sub.featureChat', 'sub.featureAnalytics', 'sub.featureBadge', 'sub.featurePriority'],
  },
  {
    id: 'annual', durationKey: 'sub.annual', price: 12000, pricePerKey: 'sub.perYear',
    periodMonths: 12, save: 33, featured: false,
    features: ['sub.featureDynamic', 'sub.featureChat', 'sub.featureAnalytics', 'sub.featureBadge', 'sub.featurePriority', 'sub.featureSupport'],
  },
]
