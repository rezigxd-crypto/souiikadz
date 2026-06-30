/**
 * AuthPage — Simple email/password form. No OAuth, no redirects.
 * Login → /dashboard. Signup → /dashboard. That's it.
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Tractor, UtensilsCrossed, Phone, Check, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toast'
import { useI18n } from '../i18n'
import { Input, Select } from '../components/ui/Input'
import Button from '../components/ui/Button'
import Logo from '../components/Logo'
import Seo from '../components/Seo'
import { wilayaOptions } from '../data/wilayas'

const ROLES = [
  { id: 'consumer',   labelKey: 'auth.roleConsumer',   icon: User },
  { id: 'farmer',     labelKey: 'auth.roleFarmer',     icon: Tractor },
  { id: 'restaurant', labelKey: 'auth.roleRestaurant', icon: UtensilsCrossed },
]

function YesNoQuestion({ label, value, onChange, t }) {
  return (
    <div>
      <div className="text-sm font-semibold text-ink-700 mb-1.5">{label}</div>
      <div className="flex gap-2">
        <button type="button" onClick={() => onChange(true)}
          className={`flex-1 py-2 rounded-lg border-2 text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${value === true ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-brand-100 text-ink-500 hover:border-brand-200'}`}>
          <Check size={14} /> {t('auth.yes')}
        </button>
        <button type="button" onClick={() => onChange(false)}
          className={`flex-1 py-2 rounded-lg border-2 text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${value === false ? 'border-red-400 bg-red-50 text-red-700' : 'border-brand-100 text-ink-500 hover:border-brand-200'}`}>
          <X size={14} /> {t('auth.no')}
        </button>
      </div>
    </div>
  )
}

export default function AuthPage() {
  const { t, lang } = useI18n()
  const { signIn, signUp } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'consumer',
    phone: '', wilayaCode: '', hasFarmerCard: false, hasCommercialRegistry: false,
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((er) => ({ ...er, [k]: undefined }))
  }

  const validate = () => {
    const e = {}
    if (mode === 'register' && !form.name.trim()) e.name = t('auth.fillFields')
    if (!form.email.trim()) e.email = t('auth.fillFields')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t('auth.invalidEmail')
    if (!form.password) e.password = t('auth.fillFields')
    else if (form.password.length < 6) e.password = t('auth.shortPassword')
    if (mode === 'register') {
      if (!form.phone.trim()) e.phone = t('auth.phoneRequired')
      if (!form.wilayaCode) e.wilayaCode = t('auth.fillFields')
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      if (mode === 'login') {
        await signIn(form.email, form.password)
        addToast(t('auth.welcomeBack'), 'success')
      } else {
        await signUp(form)
        addToast(t('auth.accountCreated'), 'success')
      }
      // ALWAYS go to dashboard — no exceptions, no checks
      navigate('/dashboard', { replace: true })
    } catch (err) {
      addToast(err.message || 'Error', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-20">
      <Seo titleKey="auth.login" descKey="home.heroDesc" path="/auth" />
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <Link to="/" className="inline-flex hover:no-underline"><Logo size={56} withText={false} /></Link>
          <h1 className="text-2xl font-extrabold text-ink-900 mt-3">{t('auth.welcomeTo')} {t('common.brandName')}</h1>
          <p className="text-ink-500 text-sm mt-1">{t('auth.subTitle')}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-7">
          <div className="grid grid-cols-2 gap-1 bg-brand-50 rounded-xl p-1 mb-6">
            {[{ id: 'login', label: t('auth.login') }, { id: 'register', label: t('auth.register') }].map(tab => (
              <button key={tab.id} onClick={() => { setMode(tab.id); setErrors({}) }}
                className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === tab.id ? 'bg-white text-brand-600 shadow-sm' : 'text-ink-400 hover:text-ink-700'}`}>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3.5">
            {mode === 'register' && (
              <Input label={t('auth.fullName')} name="name" value={form.name} onChange={set('name')} icon={User} error={errors.name} autoComplete="off" />
            )}
            <Input label={t('auth.email')} type="email" name="email" value={form.email} onChange={set('email')} icon={User} error={errors.email} autoComplete="off" dir="ltr" />
            <Input label={t('auth.password')} type="password" name="password" value={form.password} onChange={set('password')} icon={Lock} error={errors.password} autoComplete="off" dir="ltr" />

            {mode === 'register' && (
              <div>
                <label className="label">{t('auth.role')}</label>
                <div className="grid grid-cols-3 gap-2">
                  {ROLES.map(r => {
                    const active = form.role === r.id
                    return (
                      <button key={r.id} type="button" onClick={() => setForm(f => ({ ...f, role: r.id }))}
                        className={`p-2.5 rounded-lg border-2 transition-all text-center ${active ? 'border-brand-500 bg-brand-50' : 'border-brand-100 hover:border-brand-200'}`}>
                        <r.icon size={22} className={active ? 'text-brand-600' : 'text-ink-400'} />
                        <div className={`text-xs font-semibold mt-1 ${active ? 'text-brand-600' : 'text-ink-500'}`}>{t(r.labelKey)}</div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {mode === 'register' && (
              <Input label={`${t('auth.phone')} *`} name="phone" value={form.phone} onChange={set('phone')} icon={Phone} error={errors.phone} dir="ltr" autoComplete="off" />
            )}
            {mode === 'register' && (
              <Select label={`${t('wilaya.label')} *`} value={form.wilayaCode}
                onChange={e => setForm(f => ({ ...f, wilayaCode: parseInt(e.target.value) }))}
                options={[{ value: '', label: t('wilaya.select') }, ...wilayaOptions(lang)]} error={errors.wilayaCode} />
            )}
            {mode === 'register' && form.role === 'farmer' && (
              <div className="card p-3.5 bg-brand-50/40">
                <div className="text-xs font-bold text-brand-700 mb-1">{t('auth.businessInfo')}</div>
                <div className="text-[11px] text-ink-400 mb-3">{t('auth.businessInfoDesc')}</div>
                <div className="flex flex-col gap-2.5">
                  <YesNoQuestion label={t('auth.hasFarmerCard')} value={form.hasFarmerCard} onChange={v => setForm(f => ({ ...f, hasFarmerCard: v }))} t={t} />
                  <YesNoQuestion label={t('auth.hasCommercialReg')} value={form.hasCommercialRegistry} onChange={v => setForm(f => ({ ...f, hasCommercialRegistry: v }))} t={t} />
                </div>
              </div>
            )}

            <Button onClick={handleSubmit} disabled={loading} block size="lg" className="mt-1">
              {loading ? t('auth.processing') : (mode === 'login' ? t('auth.login') : t('auth.register'))}
            </Button>
          </div>
        </motion.div>

        <div className="text-center mt-4 text-xs text-ink-400">
          {mode === 'login' ? t('auth.noAccount') : t('auth.haveAccount')}{' '}
          <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErrors({}) }}
            className="text-brand-600 font-bold hover:underline">
            {mode === 'login' ? t('auth.register') : t('auth.login')}
          </button>
        </div>
      </div>
    </div>
  )
}
