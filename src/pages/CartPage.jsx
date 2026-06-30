import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ShoppingCart, Leaf, Smartphone, CreditCard, Banknote, Info } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toast'
import { useI18n } from '../i18n'
import { pt } from '../data'
import { QuantityStepper } from '../components/ui'
import { calculateCommission, formatPrice, PAYMENT_METHODS } from '../lib/pricing'
import { createTransaction } from '../lib/store'
import Seo from '../components/Seo'

const PAYMENT_ICONS = { Smartphone, CreditCard, Banknote }

export default function CartPage() {
  const { cart, removeFromCart, updateQty, clearCart, cartTotal, cartSaved } = useCart()
  const { user } = useAuth()
  const { addToast } = useToast()
  const { t, lang } = useI18n()
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState('baridimob')
  const [checkingOut, setCheckingOut] = useState(false)

  const commission = calculateCommission(cartTotal)
  const farmerEarnings = cartTotal - commission
  const totalDue = cartTotal

  const checkout = async () => {
    if (!user) {
      addToast(t('chat.loginToChat'), 'warn')
      navigate('/auth')
      return
    }
    setCheckingOut(true)
    try {
      for (const item of cart) {
        createTransaction({
          clientId: user.uid,
          clientName: user.displayName || user.email,
          farmerId: item.farmerId || 'farmer-001',
          farmerName: pt(item, lang, 'seller') || 'Farmer',
          productId: item.id,
          productName: pt(item, lang, 'name'),
          quantity: item.qty,
          unitPrice: item.discount,
          total: item.discount * item.qty,
          paymentMethod,
        })
      }
      clearCart()
      addToast(t('cart.orderConfirmed'), 'success')
      navigate('/dashboard')
    } catch (err) {
      addToast(err.message || 'Checkout failed', 'error')
    } finally {
      setCheckingOut(false)
    }
  }

  const rows = [
    { label: t('cart.subtotal'), value: `${cartTotal + cartSaved} ${t('common.currency')}` },
    { label: t('cart.discount'), value: `-${cartSaved} ${t('common.currency')}`, green: true },
    { label: t('cart.delivery'), value: t('cart.free') },
  ]

  return (
    <div className="min-h-screen pt-20">
      <Seo titleKey="cart.title" descKey="cart.empty" path="/cart" />
      <div className="container-page max-w-3xl py-8">
        <h1 className="text-2xl font-extrabold text-ink-900 mb-6">{t('cart.title')}</h1>
        {cart.length === 0 ? (
          <div className="card text-center py-20">
            <div className="inline-flex w-20 h-20 rounded-2xl bg-brand-50 items-center justify-center text-brand-500 mb-5"><ShoppingCart size={40} /></div>
            <h2 className="text-xl font-bold text-ink-700 mb-3">{t('cart.empty')}</h2>
            <p className="text-ink-500 mb-6">{t('cart.emptyDesc')}</p>
            <Link to="/market" className="btn btn-primary btn-lg hover:no-underline">{t('cart.browseMarket')}</Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3 mb-6">
              {cart.map((item) => {
                const name = pt(item, lang, 'name')
                const seller = pt(item, lang, 'seller')
                return (
                  <div key={item.id} className="card p-4 flex items-center gap-3.5 flex-wrap">
                    <img src={item.image} alt={name} width={68} height={68} loading="lazy" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-[140px]">
                      <div className="font-bold text-ink-900 mb-1">{name}</div>
                      <div className="text-xs text-ink-500">{seller}</div>
                    </div>
                    <QuantityStepper value={item.qty} min={1} max={item.stock || 99} onChange={(q) => updateQty(item.id, q)} size="sm" />
                    <div className="text-end flex-shrink-0 min-w-[80px]">
                      <div className="font-extrabold text-brand-600 text-base">{item.discount * item.qty} {t('common.currency')}</div>
                      <div className="text-[11px] text-ink-400">{item.discount} × {item.qty}</div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="btn btn-danger btn-sm !p-2"><Trash2 size={15} /></button>
                  </div>
                )
              })}
            </div>

            <div className="card p-5 mb-4">
              <h3 className="text-sm font-bold text-ink-900 mb-3">{t('pay.title')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = PAYMENT_ICONS[method.iconKey] || Smartphone
                  const active = paymentMethod === method.id
                  return (
                    <button key={method.id} onClick={() => setPaymentMethod(method.id)}
                      className={`p-3 rounded-xl border-2 text-start transition-all ${active ? 'border-brand-500 bg-brand-50' : 'border-brand-100 hover:border-brand-200'}`}>
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white mb-2" style={{ background: method.color, color: method.textColor }}>
                        <Icon size={18} />
                      </div>
                      <div className="text-xs font-bold text-ink-900">{t(method.nameKey)}</div>
                      <div className="text-[10px] text-ink-400 mt-0.5 leading-tight">{t(method.descKey)}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-base font-bold text-ink-900 mb-4.5">{t('cart.title')}</h2>
              {rows.map((r) => (
                <div key={r.label} className="flex justify-between mb-2.5 text-sm">
                  <span className="text-ink-500">{r.label}</span>
                  <span className={`font-semibold ${r.green ? 'text-brand-600' : 'text-ink-900'}`}>{r.value}</span>
                </div>
              ))}
              <div className="border-t border-brand-100 pt-3 mt-1">
                <div className="flex justify-between mb-2 text-xs text-ink-400">
                  <span className="flex items-center gap-1.5"><Info size={12} />{t('commission.label')}</span>
                  <span className="font-semibold">{commission} {t('common.currency')}</span>
                </div>
                <div className="flex justify-between mb-2 text-xs text-ink-400">
                  <span>{t('commission.farmerNet')}</span>
                  <span className="font-semibold text-brand-600">{farmerEarnings} {t('common.currency')}</span>
                </div>
              </div>
              <div className="border-t border-brand-100 pt-3.5 mt-1 flex justify-between items-center">
                <span className="font-bold text-base text-ink-900">{t('commission.totalDue')}</span>
                <span className="font-extrabold text-2xl text-brand-600">{totalDue} {t('common.currency')}</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-brand-50 border border-brand-200 rounded-lg px-3.5 py-2.5 mt-3.5 text-xs text-brand-600 font-semibold">
                <Leaf size={14} />{t('cart.saved')} {cartSaved} {t('cart.savedDesc')}
              </div>
              <button onClick={checkout} disabled={checkingOut} className="btn btn-primary btn-block btn-lg mt-4">
                {checkingOut ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{t('common.loading')}</>) : t('cart.checkout')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
