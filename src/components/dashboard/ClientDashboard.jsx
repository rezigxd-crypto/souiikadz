/**
 * ClientDashboard — localStorage. No Supabase, no Chat.
 * View orders, edit profile, link to marketplace.
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LayoutDashboard, Truck, Heart, LogOut, User, Phone, Wallet } from 'lucide-react'
import { useI18n } from '../../i18n'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../ui/Toast'
import { useWishlist } from '../../hooks'
import { Badge, Button, Input } from '../ui'
import { getClientTransactions } from '../../lib/store'
import { formatPrice } from '../../lib/pricing'
import { PRODUCTS, pt } from '../../data'
import Logo from '../Logo'
import Seo from '../Seo'

export default function ClientDashboard() {
  const { t, lang } = useI18n()
  const { user, signOut, updateProfile } = useAuth()
  const { addToast } = useToast()
  const { wishlist } = useWishlist()
  const [section, setSection] = useState('overview')
  const [transactions, setTransactions] = useState([])
  const [profileForm, setProfileForm] = useState({ displayName: user?.displayName || '', phone: user?.phone || '' })

  useEffect(() => {
    if (user) setTransactions(getClientTransactions(user.uid))
  }, [user?.uid])

  const handleSignOut = async () => { await signOut() }
  const handleSaveProfile = async () => {
    await updateProfile({ displayName: profileForm.displayName, phone: profileForm.phone })
    addToast('Profile updated', 'success')
    setSection('overview')
  }

  const totalSpent = transactions.reduce((sum, t) => sum + t.total, 0)
  const wishlistedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id))

  const menu = [
    { id: 'overview',     label: t('dash.overview'),         icon: LayoutDashboard },
    { id: 'transactions', label: t('dash.clientOrders'),     icon: Truck },
    { id: 'wishlist',     label: t('dash.clientWishlist'),   icon: Heart },
    { id: 'profile',      label: 'Edit Profile',              icon: User },
  ]

  const stats = [
    { label: t('dash.activeOrders'), value: transactions.length, icon: Truck },
    { label: t('dash.clientWishlist'), value: wishlist.length, icon: Heart },
    { label: t('dash.totalSales'), value: formatPrice(totalSpent, lang), icon: Wallet },
  ]

  return (
    <>
      <Seo titleKey="nav.dashboard" path="/dashboard" />
      <aside className="w-56 flex-shrink-0 bg-white border-l border-brand-100 p-3.5 hidden md:flex flex-col gap-1">
        <div className="flex items-center gap-2.5 px-1.5 mb-6">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-base" style={{ background: 'linear-gradient(135deg, #1a6b3a, #c9a227)' }}>{(user?.displayName || user?.email || 'C')[0].toUpperCase()}</div>
          <div><div className="text-xs font-bold text-ink-900">{user?.displayName}</div><div className="text-[11px] text-brand-600">{t('role.consumer')}</div></div>
        </div>
        {menu.map((m) => (<button key={m.id} onClick={() => setSection(m.id)} className={`w-full text-start p-2.5 rounded-lg text-sm font-medium flex items-center gap-2.5 transition-all border-r-[3px] ${section === m.id ? 'bg-brand-50 text-brand-600 font-bold border-brand-500' : 'text-ink-500 border-transparent hover:bg-brand-50'}`}><m.icon size={16} /> {m.label}</button>))}
        <button onClick={handleSignOut} className="mt-auto p-2.5 rounded-lg text-sm font-medium flex items-center gap-2.5 text-red-600 hover:bg-red-50"><LogOut size={16} /> Sign out</button>
      </aside>

      <div className="md:hidden fixed top-16 inset-x-0 z-40 bg-white border-b border-brand-100 px-4 py-2 flex gap-1.5 overflow-x-auto no-scrollbar">
        {menu.map((m) => (<button key={m.id} onClick={() => setSection(m.id)} className={`pill whitespace-nowrap ${section === m.id ? 'pill-active' : ''}`}><m.icon size={14} /> {m.label}</button>))}
      </div>

      <main className="flex-1 p-6 md:p-8 overflow-y-auto md:pt-8 pt-20">
        <div className="md:hidden flex justify-end mb-4"><button onClick={handleSignOut} className="btn btn-ghost btn-sm text-red-600"><LogOut size={14} /> Sign out</button></div>

        {section === 'overview' && (
          <>
            <h1 className="text-xl font-extrabold text-ink-900 mb-6">{t('common.brandName')}, {user?.displayName}!</h1>
            <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))' }}>
              {stats.map((s, i) => (<div key={i} className="card p-5"><div className="inline-flex w-10 h-10 rounded-xl bg-brand-50 items-center justify-center text-brand-600 mb-2"><s.icon size={20} /></div><div className="text-xl font-extrabold text-ink-900 mb-1">{s.value}</div><div className="text-xs text-ink-500">{s.label}</div></div>))}
            </div>
            <h2 className="text-base font-bold text-ink-900 mb-3.5">{t('dash.recentOrders')}</h2>
            {transactions.length > 0 ? <OrdersTable txns={transactions.slice(0, 5)} lang={lang} t={t} /> : <div className="card text-center py-12 text-ink-400"><Truck size={32} className="mx-auto mb-3 opacity-50" /><p>No orders yet</p><Link to="/market" className="btn btn-primary btn-sm mt-3 hover:no-underline">{t('cart.browseMarket')}</Link></div>}
          </>
        )}

        {section === 'transactions' && (
          <>
            <h1 className="text-xl font-extrabold text-ink-900 mb-5.5">{t('dash.clientOrders')}</h1>
            <OrdersTable txns={transactions} lang={lang} t={t} />
          </>
        )}

        {section === 'wishlist' && (
          <>
            <h1 className="text-xl font-extrabold text-ink-900 mb-5.5">{t('dash.clientWishlist')}</h1>
            {wishlistedProducts.length === 0 ? (
              <div className="card text-center py-15 text-ink-500"><Heart size={28} className="mx-auto mb-3" /><p className="mb-4">{t('cart.emptyDesc')}</p><Link to="/market" className="btn btn-primary hover:no-underline">{t('cart.browseMarket')}</Link></div>
            ) : (
              <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
                {wishlistedProducts.map((p) => { const name = pt(p, lang, 'name'); return (<Link key={p.id} to={`/product/${p.id}`} className="card overflow-hidden hover:no-underline hover:border-brand-300"><img src={p.image} alt={name} className="w-full h-32 object-cover" /><div className="p-3"><div className="font-bold text-sm text-ink-900 truncate">{name}</div><div className="text-base font-extrabold text-brand-600 mt-1">{p.discount} {t('common.currency')}</div></div></Link>) })}
              </div>
            )}
          </>
        )}

        {section === 'profile' && (
          <>
            <h1 className="text-xl font-extrabold text-ink-900 mb-6">Edit Profile</h1>
            <div className="card p-6 max-w-md">
              <div className="flex flex-col gap-3.5">
                <Input label={t('auth.fullName')} value={profileForm.displayName} onChange={(e) => setProfileForm(f => ({ ...f, displayName: e.target.value }))} icon={User} />
                <Input label={t('auth.phone')} value={profileForm.phone} onChange={(e) => setProfileForm(f => ({ ...f, phone: e.target.value }))} icon={Phone} dir="ltr" />
                <Button onClick={handleSaveProfile} block size="lg">Save</Button>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  )
}

function OrdersTable({ txns, lang, t }) {
  if (!txns || txns.length === 0) return <div className="card text-center py-12 text-ink-400"><Truck size={32} className="mx-auto mb-3 opacity-50" /><p className="text-sm">No orders</p></div>
  return (
    <div className="card overflow-hidden overflow-x-auto">
      <table className="w-full text-xs min-w-[600px]">
        <thead className="bg-brand-50"><tr><th className="p-3 text-start font-bold text-brand-600">ID</th><th className="p-3 text-start font-bold text-brand-600">Product</th><th className="p-3 text-start font-bold text-brand-600">Qty</th><th className="p-3 text-start font-bold text-brand-600">Total</th><th className="p-3 text-start font-bold text-brand-600">Status</th></tr></thead>
        <tbody>{txns.map((txn) => (<tr key={txn.id} className="border-t border-brand-50"><td className="p-3 font-bold text-brand-600">{txn.id}</td><td className="p-3 text-ink-900">{txn.productName}</td><td className="p-3 text-ink-500">{txn.quantity}</td><td className="p-3 font-bold text-ink-900">{formatPrice(txn.total, lang)}</td><td className="p-3"><Badge variant={txn.status === 'completed' ? 'success' : 'gold'}>{txn.status}</Badge></td></tr>))}</tbody>
      </table>
    </div>
  )
}
