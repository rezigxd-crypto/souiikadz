import { Suspense, lazy } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { HelmetProvider } from 'react-helmet-async'
import { I18nProvider } from './i18n'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './components/ui/Toast'
import { CartProvider } from './context/CartContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import { Footer } from './components/UI'
import ScrollTop from './components/ui/ScrollTop'
import AlgeriaMapBackground from './components/AlgeriaMapBackground'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import { useI18n } from './i18n'
import { Leaf } from 'lucide-react'

const HomePage          = lazy(() => import('./pages/HomePage'))
const MarketPage        = lazy(() => import('./pages/MarketPage'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'))
const DashboardPage     = lazy(() => import('./pages/DashboardPage'))
const AuthPage          = lazy(() => import('./pages/AuthPage'))
const CartPage          = lazy(() => import('./pages/CartPage'))
const AboutPage         = lazy(() => import('./pages/AboutPage'))
const SubscriptionPage  = lazy(() => import('./pages/SubscriptionPage'))

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -4 }}
    transition={{ duration: 0.25 }}
  >
    {children}
  </motion.div>
)

function PageLoader() {
  const { t } = useI18n()
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-brand-600">
        <Leaf size={32} className="animate-pulse" />
        <span className="text-sm">{t('common.loading')}</span>
      </div>
    </div>
  )
}

function AuthRoute({ children }) {
  const { user } = useAuth()
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

function NotFoundPage() {
  const { t } = useI18n()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-20 text-center container-page">
      <div className="text-brand-600"><Leaf size={64} /></div>
      <h1 className="text-2xl font-extrabold text-ink-900">{t('notfound.title')}</h1>
      <a href="/" className="btn btn-primary btn-lg">{t('notfound.back')}</a>
    </div>
  )
}

function AppShell() {
  const location = useLocation()
  const hideNav  = location.pathname.startsWith('/auth')
  const hideFoot = location.pathname.startsWith('/auth') || location.pathname.startsWith('/dashboard')

  return (
    <>
      <AlgeriaMapBackground intensity="full" />
      {!hideNav && <Navbar />}
      <main id="main" className="relative z-10">
        <Suspense fallback={<PageLoader />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/"            element={<PageWrapper><HomePage /></PageWrapper>} />
              <Route path="/market"      element={<PageWrapper><MarketPage /></PageWrapper>} />
              <Route path="/product/:id" element={<PageWrapper><ProductDetailPage /></PageWrapper>} />
              <Route path="/cart"        element={<PageWrapper><CartPage /></PageWrapper>} />
              <Route path="/about"       element={<PageWrapper><AboutPage /></PageWrapper>} />
              <Route path="/auth" element={<AuthRoute><PageWrapper><AuthPage /></PageWrapper></AuthRoute>} />
              <Route path="/dashboard" element={
                <ProtectedRoute><PageWrapper><DashboardPage /></PageWrapper></ProtectedRoute>
              } />
              <Route path="/subscription" element={
                <ProtectedRoute role="farmer"><PageWrapper><SubscriptionPage /></PageWrapper></ProtectedRoute>
              } />
              <Route path="*" element={<PageWrapper><NotFoundPage /></PageWrapper>} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
      {!hideFoot && <Footer />}
      <ScrollTop />
    </>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <I18nProvider>
          <ThemeProvider>
            <ToastProvider>
              <AuthProvider>
                <CartProvider>
                  <AppShell />
                </CartProvider>
              </AuthProvider>
            </ToastProvider>
          </ThemeProvider>
        </I18nProvider>
      </HelmetProvider>
    </ErrorBoundary>
  )
}
