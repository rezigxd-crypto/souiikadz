import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ShoppingCart, Menu, X, User, LogOut,
  Tag, Wheat, Droplet, Bell as BellIcon,
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useScrollY } from '../hooks'
import { useI18n } from '../i18n'
import { useToast } from './ui/Toast'
import Logo from './Logo'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navbar() {
  const { cartCount } = useCart()
  // Destructure loading so we can guard auth-sensitive UI against flicker
  const { user, loading: authLoading, signOut } = useAuth()
  const { addToast } = useToast()
  const { t, lang } = useI18n()
  const scrollY = useScrollY()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const scrolled = scrollY > 30

  const handleSignOut = async () => {
    try {
      await signOut()
      addToast('تم تسجيل الخروج', 'info')
      navigate('/')
    } catch {
      addToast('Sign out failed', 'error')
    }
  }

  const navLinks = [
    { to: '/', label: t('nav.home') },
  ]

  if (!authLoading) {
    if (user?.role === 'farmer') {
      navLinks.push({ to: '/dashboard',    label: t('nav.dashboard') })
      navLinks.push({ to: '/subscription', label: t('sub.dynamicPricing') })
    } else if (user?.role === 'admin') {
      navLinks.push({ to: '/dashboard', label: t('nav.dashboard') })
    } else if (user) {
      navLinks.push({ to: '/market',    label: t('nav.market') })
      navLinks.push({ to: '/dashboard', label: t('nav.dashboard') })
    } else {
      navLinks.push({ to: '/market', label: t('nav.market') })
      navLinks.push({ to: '/about',  label: t('nav.about') })
    }
  }

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-[1000] transition-all duration-300 ${
        scrolled ? 'glass shadow-md' : 'bg-transparent'
      }`}
      style={{ borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent' }}
    >
      <div className="container-page h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="hover:no-underline" aria-label={t('common.brandName')}>
          <Logo size={38} />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all hover:no-underline ${
                isActive(l.to)
                  ? 'bg-brand-50 text-brand-600 border border-brand-200 font-bold'
                  : 'text-ink-500 hover:text-brand-600 border border-transparent'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">

          {/* Language switcher (desktop) */}
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          {/* Cart */}
          <Link
            to="/cart"
            className="btn btn-primary btn-sm hover:no-underline"
            aria-label={t('nav.cart')}
          >
            <ShoppingCart size={16} />
            <span className="hidden sm:inline">{t('nav.cart')}</span>
            {cartCount > 0 && (
              <span className="bg-gold-600 text-white rounded-full w-5 h-5 text-[11px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User / Auth — guarded with loading skeleton to prevent flicker */}
          {authLoading ? (
            <div className="w-9 h-9 rounded-full bg-brand-100 animate-pulse" />
          ) : (
            <Link
              to={user ? '/dashboard' : '/auth'}
              aria-label={t('nav.account')}
              className="btn btn-outline btn-sm !p-2 hover:no-underline"
            >
              {user ? (
                <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-[11px] font-bold flex items-center justify-center">
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </span>
              ) : (
                <User size={17} />
              )}
            </Link>
          )}

          {/* Logout — only when logged in and not loading */}
          {!authLoading && user && (
            <button
              onClick={handleSignOut}
              aria-label="Sign out"
              title="Sign out"
              className="btn btn-ghost btn-sm !p-2 text-red-600 hover:bg-red-50"
            >
              <LogOut size={17} />
            </button>
          )}

          {/* Hamburger (mobile) */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="btn btn-ghost btn-sm !p-2 md:hidden"
            aria-label={t('nav.menu')}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-brand-100 animate-fade-up">
          <div className="container-page py-4 flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-4 py-3 rounded-lg text-sm font-medium hover:no-underline ${
                  isActive(l.to)
                    ? 'bg-brand-50 text-brand-600 font-bold'
                    : 'text-ink-700 hover:bg-brand-50'
                }`}
              >
                {l.label}
              </Link>
            ))}

            {/* Login / Signup (mobile, not logged in) */}
            {!authLoading && !user && (
              <div className="flex gap-2 pt-2 mt-2 border-t border-brand-100">
                <Link
                  to="/auth"
                  onClick={() => setMenuOpen(false)}
                  className="btn btn-outline btn-sm flex-1 hover:no-underline"
                >
                  {t('auth.login')}
                </Link>
                <Link
                  to="/auth"
                  onClick={() => setMenuOpen(false)}
                  className="btn btn-primary btn-sm flex-1 hover:no-underline"
                >
                  {t('auth.register')}
                </Link>
              </div>
            )}

            <div className="pt-2 mt-2 border-t border-brand-100">
              <LanguageSwitcher />
            </div>

            {!authLoading && user && (
              <button
                onClick={() => { handleSignOut(); setMenuOpen(false) }}
                className="mt-2 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 text-start flex items-center gap-2"
              >
                <LogOut size={16} /> تسجيل الخروج
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
