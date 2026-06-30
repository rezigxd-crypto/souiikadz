/**
 * SubscriptionPage — dynamic-pricing plans for farmers.
 *
 * Route: /subscription
 * Shows 3 plans (monthly / seasonal / annual). The seasonal plan is featured.
 * - If logged-out → login CTA
 * - If not a farmer → "farmers only" notice
 * - If already subscribed → current-plan banner at top
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Calendar, Crown, Award, CheckCircle2, Sparkles, Lock, ArrowLeft,
  CreditCard, TrendingUp, Info,
} from 'lucide-react'
import { useI18n } from '../i18n'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toast'
import { Button, Badge } from '../components/ui'
import Seo from '../components/Seo'
import { SUBSCRIPTION_PLANS, formatPrice } from '../lib/pricing'

const PLAN_ICON = { monthly: Calendar, seasonal: Crown, annual: Award }

export default function SubscriptionPage() {
  const { t, lang } = useI18n()
  const { user, subscribeToPlan } = useAuth()
  const { addToast } = useToast()
  const [busy, setBusy] = useState(null)

  const currentPlanId = user?.subscription || null
  const currentPlan = SUBSCRIPTION_PLANS.find((p) => p.id === currentPlanId) || null
  const isFarmer = user?.role === 'farmer'

  const handleSubscribe = async (planId) => {
    if (!user) return
    setBusy(planId)
    try {
      await subscribeToPlan(planId)
      addToast(t('sub.subscribed'), 'success')
    } catch (e) {
      addToast(e?.message || t('sub.subscribed'), 'error')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="min-h-screen pt-16 bg-brand-50/40" style={{ direction: 'rtl' }}>
      <Seo titleKey="nav.subscription" descKey="sub.subtitle" path="/subscription" />

      <div className="container-page py-10 md:py-14">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <span className="inline-flex items-center gap-1.5 badge badge-gold mb-3">
            <Sparkles size={12} /> {t('sub.dynamicPricing')}
          </span>
          <h1 className="section-title mb-2">{t('sub.title')}</h1>
          <p className="section-sub">{t('sub.subtitle')}</p>
        </motion.div>

        {/* Current-plan banner */}
        {user && currentPlan && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-4 mb-6 flex items-center gap-3.5 border-brand-200 bg-brand-50/60 max-w-3xl mx-auto"
          >
            <span className="inline-flex w-11 h-11 rounded-xl bg-gradient-brand items-center justify-center text-white flex-shrink-0">
              <CheckCircle2 size={20} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-brand-700">{t('sub.currentPlan')}</div>
              <div className="text-xs text-ink-500">
                {t(currentPlan.durationKey)} · {formatPrice(currentPlan.price, lang)} · {t('dash.subscriptionActive')}
              </div>
            </div>
            <Badge variant="success" icon={CheckCircle2}>{t('sub.alreadySubscribed')}</Badge>
          </motion.div>
        )}

        {/* Farmers-only notice (non-farmer logged-in users) */}
        {user && !isFarmer && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-4 mb-8 flex items-center gap-3.5 border-gold-400/60 bg-cream-100/60 max-w-3xl mx-auto"
          >
            <span className="inline-flex w-11 h-11 rounded-xl bg-gradient-gold items-center justify-center text-white flex-shrink-0">
              <Info size={20} />
            </span>
            <p className="text-sm text-ink-700 flex-1">{t('sub.farmerOnly')}</p>
          </motion.div>
        )}

        {/* Logged-out CTA */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-8 text-center mb-10 max-w-xl mx-auto"
          >
            <span className="inline-flex w-14 h-14 rounded-2xl bg-brand-50 items-center justify-center text-brand-600 mx-auto mb-3">
              <Lock size={26} />
            </span>
            <h2 className="text-lg font-extrabold text-ink-900 mb-2">{t('dash.loginRequired')}</h2>
            <p className="text-sm text-ink-500 mb-5">{t('sub.loginToSubscribe')}</p>
            <Link to="/auth">
              <Button size="lg">
                {t('common.login')} <ArrowLeft size={16} style={{ transform: 'scaleX(-1)' }} />
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Plan cards */}
        <div className="grid gap-5 md:gap-6 max-w-5xl mx-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {SUBSCRIPTION_PLANS.map((plan, i) => {
            const Icon = PLAN_ICON[plan.id] || Calendar
            const isCurrent = currentPlanId === plan.id
            const featured = plan.featured
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                className={`card p-6 flex flex-col relative ${featured ? 'border-2 border-brand-500 md:-mt-2' : ''}`}
              >
                {featured && (
                  <span className="badge badge-brand absolute -top-3 left-1/2 -translate-x-1/2 !px-3 !py-1 shadow-sm">
                    <Sparkles size={12} /> {t('sub.popular')}
                  </span>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <span className={`inline-flex w-12 h-12 rounded-2xl items-center justify-center text-white ${featured ? 'bg-gradient-brand' : 'bg-brand-100 text-brand-600'}`}>
                    <Icon size={22} />
                  </span>
                  <div>
                    <div className="text-base font-extrabold text-ink-900">{t(plan.durationKey)}</div>
                    {plan.save > 0 && (
                      <span className="badge badge-gold !text-[10px] !py-0.5">
                        {t('sub.savePercent')} {plan.save}%
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-brand-600">
                      {plan.price.toLocaleString()}
                    </span>
                    <span className="text-sm font-medium text-ink-400">{t('common.currency')}</span>
                  </div>
                  <div className="text-xs text-ink-500 mt-0.5">{t(plan.pricePerKey)}</div>
                </div>

                <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-ink-700">
                      <CheckCircle2 size={16} className="text-brand-500 flex-shrink-0 mt-0.5" />
                      <span>{t(f)}</span>
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <Button variant="outline" block disabled>
                    <CheckCircle2 size={15} /> {t('sub.alreadySubscribed')}
                  </Button>
                ) : (
                  <Button
                    variant={featured ? 'primary' : 'outline'}
                    block
                    disabled={!isFarmer || busy === plan.id}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {busy === plan.id
                      ? t('auth.processing')
                      : <><CreditCard size={15} /> {t('sub.subscribe')}</>}
                  </Button>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Reassurance row */}
        <div className="max-w-3xl mx-auto mt-10 grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          <div className="card p-4 flex items-center gap-2.5">
            <TrendingUp size={18} className="text-brand-600 flex-shrink-0" />
            <span className="text-xs text-ink-600">{t('sub.subtitle')}</span>
          </div>
          <div className="card p-4 flex items-center gap-2.5">
            <Sparkles size={18} className="text-gold-600 flex-shrink-0" />
            <span className="text-xs text-ink-600">{t('dash.smartPriceNow')}</span>
          </div>
          <div className="card p-4 flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-brand-600 flex-shrink-0" />
            <span className="text-xs text-ink-600">{t('dash.verifiedSeller')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
