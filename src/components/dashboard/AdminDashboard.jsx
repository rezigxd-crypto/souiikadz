/**
 * AdminDashboard — localStorage. No Supabase.
 * Shows all users, pending transactions, commission earned.
 * "Mark as Done" button finalizes transactions.
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, Package, Truck, Wallet, LogOut, Check, User, Phone, TrendingUp } from 'lucide-react'
import { useI18n } from '../../i18n'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../ui/Toast'
import { Badge, Button, Input } from '../ui'
import { getProducts, getTransactions, completeTransaction, getTotalCommission } from '../../lib/store'
import { formatPrice } from '../../lib/pricing'
import { wilayaName } from '../../data/wilayas'
import Seo from '../Seo'
import Logo from '../Logo'

export default function AdminDashboard() {
  const { t, lang } = useI18n()
  const { user, signOut, listAllUsers, updateProfile } = useAuth()
  const { addToast } = useToast()
  const [section, setSection] = useState('overview')
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({ displayName: user?.displayName || '', phone: user?.phone || '' })

  const loadData = () => {
    setUsers(listAllUsers())
    setProducts(getProducts())
    setTransactions(getTransactions())
  }

  useEffect(() => { loadData() }, [])

  const handleSignOut = async () => { await signOut() }
  const handleMarkDone = (txnId) => {
    completeTransaction(txnId)
    loadData()
    addToast('Transaction completed', 'success')
  }
  const handleSaveProfile = async () => {
    await updateProfile({ displayName: profileForm.displayName, phone: profileForm.phone })
    loadData()
    setEditingProfile(false)
    addToast('Profile updated', 'success')
  }

  const pendingTxns = transactions.filter((t) => t.status === 'pending')
  const completedTxns = transactions.filter((t) => t.status === 'completed')
  const totalCommission = getTotalCommission()

  const menu = [
    { id: 'overview',     label: t('dash.overview'),     icon: TrendingUp },
    { id: 'users',        label: t('dash.adminUsers'),   icon: Users },
    { id: 'transactions', label: 'Transactions',          icon: Truck },
    { id: 'profile',      label: 'Edit Profile',          icon: User },
  ]

  return (
    <>
      <Seo titleKey="nav.dashboard" path="/dashboard" />
      <aside className="w-56 flex-shrink-0 bg-white border-l border-brand-100 p-3.5 hidden md:flex flex-col gap-1">
        <div className="flex items-center gap-2.5 px-1.5 mb-6">
          <Logo size={44} withText={false} />
          <div>
            <div className="text-xs font-bold text-ink-900">{user?.displayName}</div>
            <div className="text-[11px] text-brand-600">{t('role.admin')}</div>
          </div>
        </div>
        {menu.map((m) => (
          <button key={m.id} onClick={() => setSection(m.id)}
            className={`w-full text-start p-2.5 rounded-lg text-sm font-medium flex items-center gap-2.5 transition-all border-r-[3px] ${section === m.id ? 'bg-brand-50 text-brand-600 font-bold border-brand-500' : 'text-ink-500 border-transparent hover:bg-brand-50'}`}>
            <m.icon size={16} /> {m.label}
          </button>
        ))}
        <button onClick={handleSignOut} className="mt-auto p-2.5 rounded-lg text-sm font-medium flex items-center gap-2.5 text-red-600 hover:bg-red-50">
          <LogOut size={16} /> Sign out
        </button>
      </aside>

      <div className="md:hidden fixed top-16 inset-x-0 z-40 bg-white border-b border-brand-100 px-4 py-2 flex gap-1.5 overflow-x-auto no-scrollbar">
        {menu.map((m) => (
          <button key={m.id} onClick={() => setSection(m.id)} className={`pill whitespace-nowrap ${section === m.id ? 'pill-active' : ''}`}>
            <m.icon size={14} /> {m.label}
          </button>
        ))}
      </div>

      <main className="flex-1 p-6 md:p-8 overflow-y-auto md:pt-8 pt-20">
        <div className="md:hidden flex justify-end mb-4">
          <button onClick={handleSignOut} className="btn btn-ghost btn-sm text-red-600"><LogOut size={14} /> Sign out</button>
        </div>

        {section === 'overview' && (
          <>
            <h1 className="text-xl font-extrabold text-ink-900 mb-6">{t('dash.overview')}</h1>
            <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))' }}>
              {[
                { label: t('dash.totalUsers'), value: users.length, icon: Users },
                { label: t('dash.adminProducts'), value: products.length, icon: Package },
                { label: 'Pending', value: pendingTxns.length, icon: Truck },
                { label: t('admin.totalCommission'), value: formatPrice(totalCommission, lang), icon: Wallet },
              ].map((s, i) => (
                <div key={i} className="card p-5">
                  <div className="inline-flex w-10 h-10 rounded-xl bg-brand-50 items-center justify-center text-brand-600 mb-2"><s.icon size={20} /></div>
                  <div className="text-xl font-extrabold text-ink-900 mb-1">{s.value}</div>
                  <div className="text-xs text-ink-500">{s.label}</div>
                </div>
              ))}
            </div>
            {pendingTxns.length > 0 && (
              <>
                <h2 className="text-base font-bold text-ink-900 mb-3.5">Pending Transactions</h2>
                <TransactionTable txns={pendingTxns} onMarkDone={handleMarkDone} lang={lang} t={t} />
              </>
            )}
          </>
        )}

        {section === 'users' && (
          <>
            <h1 className="text-xl font-extrabold text-ink-900 mb-5.5">{t('dash.adminUsers')}</h1>
            <div className="card overflow-hidden overflow-x-auto">
              <table className="w-full text-xs min-w-[700px]">
                <thead className="bg-brand-50">
                  <tr>
                    <th className="p-3 text-start font-bold text-brand-600">{t('auth.fullName')}</th>
                    <th className="p-3 text-start font-bold text-brand-600">{t('auth.email')}</th>
                    <th className="p-3 text-start font-bold text-brand-600">{t('dash.status')}</th>
                    <th className="p-3 text-start font-bold text-brand-600">{t('admin.phone')}</th>
                    <th className="p-3 text-start font-bold text-brand-600">{t('admin.wilaya')}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.uid} className="border-t border-brand-50">
                      <td className="p-3 font-bold text-ink-900">{u.displayName || '—'}</td>
                      <td className="p-3 text-ink-500" dir="ltr">{u.email}</td>
                      <td className="p-3"><Badge variant={u.role === 'admin' ? 'info' : u.role === 'farmer' ? 'brand' : 'gold'}>{t(`role.${u.role}`)}</Badge></td>
                      <td className="p-3 text-ink-500" dir="ltr">{u.phone || '—'}</td>
                      <td className="p-3 text-ink-500">{u.wilayaCode ? wilayaName(u.wilayaCode, lang) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {section === 'transactions' && (
          <>
            <h1 className="text-xl font-extrabold text-ink-900 mb-5.5">All Transactions</h1>
            <TransactionTable txns={transactions} onMarkDone={handleMarkDone} lang={lang} t={t} />
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

function TransactionTable({ txns, onMarkDone, lang, t }) {
  if (!txns || txns.length === 0) {
    return <div className="card text-center py-12 text-ink-400"><Truck size={32} className="mx-auto mb-3 opacity-50" /><p className="text-sm">No transactions</p></div>
  }
  return (
    <div className="card overflow-hidden overflow-x-auto">
      <table className="w-full text-xs min-w-[700px]">
        <thead className="bg-brand-50">
          <tr>
            <th className="p-3 text-start font-bold text-brand-600">ID</th>
            <th className="p-3 text-start font-bold text-brand-600">Product</th>
            <th className="p-3 text-start font-bold text-brand-600">Client</th>
            <th className="p-3 text-start font-bold text-brand-600">Total</th>
            <th className="p-3 text-start font-bold text-brand-600">Commission</th>
            <th className="p-3 text-start font-bold text-brand-600">Farmer Gets</th>
            <th className="p-3 text-start font-bold text-brand-600">Status</th>
            <th className="p-3 text-start font-bold text-brand-600">Action</th>
          </tr>
        </thead>
        <tbody>
          {txns.map((txn) => (
            <tr key={txn.id} className="border-t border-brand-50">
              <td className="p-3 font-bold text-brand-600">{txn.id}</td>
              <td className="p-3 text-ink-900">{txn.productName}</td>
              <td className="p-3 text-ink-500">{txn.clientName}</td>
              <td className="p-3 font-bold text-ink-900">{formatPrice(txn.total, lang)}</td>
              <td className="p-3 text-brand-600 font-semibold">{formatPrice(txn.commission, lang)}</td>
              <td className="p-3 text-ink-700">{formatPrice(txn.farmerPayout, lang)}</td>
              <td className="p-3"><Badge variant={txn.status === 'completed' ? 'success' : 'gold'}>{txn.status}</Badge></td>
              <td className="p-3">
                {txn.status === 'pending' && (
                  <button onClick={() => onMarkDone(txn.id)} className="btn btn-primary btn-sm"><Check size={12} /> Mark Done</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
