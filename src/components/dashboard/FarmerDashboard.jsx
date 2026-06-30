/**
 * FarmerDashboard — localStorage. No Supabase, no Cloudinary, no Chat.
 * Post products, view earnings, edit profile.
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LayoutDashboard, Package, Truck, Plus, Edit, Trash2, Wallet, Boxes, Star, BadgeCheck, LogOut, User, Phone, X } from 'lucide-react'
import { useI18n } from '../../i18n'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../ui/Toast'
import { Badge, Button, Input, Textarea, Select, Modal } from '../ui'
import { getFarmerProducts, createProduct, deleteProduct, getFarmerTransactions, getFarmerEarnings } from '../../lib/store'
import { suggestDynamicPrice, formatPrice, SUBSCRIPTION_PLANS } from '../../lib/pricing'
import { pt } from '../../data'
import { wilayaName, wilayaOptions } from '../../data/wilayas'
import { CATEGORIES } from '../../data'
import Logo from '../Logo'
import Seo from '../Seo'

export default function FarmerDashboard() {
  const { t, lang } = useI18n()
  const { user, signOut, updateProfile, subscribeToPlan } = useAuth()
  const { addToast } = useToast()
  const [section, setSection] = useState('overview')
  const [products, setProducts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({ displayName: user?.displayName || '', phone: user?.phone || '' })

  const loadData = () => {
    if (!user) return
    setProducts(getFarmerProducts(user.uid))
    setTransactions(getFarmerTransactions(user.uid))
  }

  useEffect(() => { loadData() }, [user?.uid])

  const isSubscribed = !!user?.subscription
  const currentPlan = SUBSCRIPTION_PLANS.find((p) => p.id === user?.subscription)
  const earnings = user ? getFarmerEarnings(user.uid) : 0

  const handleSignOut = async () => { await signOut() }
  const handleSaveProfile = async () => {
    await updateProfile({ displayName: profileForm.displayName, phone: profileForm.phone })
    setEditingProfile(false)
    addToast('Profile updated', 'success')
  }

  const menu = [
    { id: 'overview',     label: t('dash.overview'),           icon: LayoutDashboard },
    { id: 'products',     label: t('dash.farmerProducts'),     icon: Package },
    { id: 'transactions', label: 'Transactions',               icon: Truck },
    { id: 'profile',      label: 'Edit Profile',               icon: User },
  ]

  const dashStats = [
    { label: t('dash.totalSales'), value: formatPrice(earnings, lang), icon: Wallet, change: '+12%' },
    { label: 'Transactions', value: transactions.length, icon: Truck, change: '+5%' },
    { label: t('dash.listedProducts'), value: products.length, icon: Boxes, change: '0%' },
    { label: t('dash.storeRating'), value: '4.8 ★', icon: Star, change: '+0.2' },
  ]

  return (
    <>
      <Seo titleKey="nav.dashboard" path="/dashboard" />
      <aside className="w-56 flex-shrink-0 bg-white border-l border-brand-100 p-3.5 hidden md:flex flex-col gap-1">
        <div className="flex items-center gap-2.5 px-1.5 mb-6">
          <Logo size={44} withText={false} />
          <div>
            <div className="text-xs font-bold text-ink-900">{user?.displayName}</div>
            <div className="text-[11px] text-brand-600 flex items-center gap-1"><BadgeCheck size={11} /> {t('dash.verifiedSeller')}</div>
          </div>
        </div>
        {menu.map((m) => (
          <button key={m.id} onClick={() => setSection(m.id)}
            className={`w-full text-start p-2.5 rounded-lg text-sm font-medium flex items-center gap-2.5 transition-all border-r-[3px] ${section === m.id ? 'bg-brand-50 text-brand-600 font-bold border-brand-500' : 'text-ink-500 border-transparent hover:bg-brand-50'}`}>
            <m.icon size={16} /> {m.label}
          </button>
        ))}
        <div className="mt-auto pt-5">
          <Button onClick={() => setShowAdd(true)} block><Plus size={15} /> {t('dash.addProduct')}</Button>
          <button onClick={handleSignOut} className="mt-2 w-full p-2.5 rounded-lg text-sm font-medium flex items-center gap-2.5 text-red-600 hover:bg-red-50"><LogOut size={16} /> Sign out</button>
        </div>
      </aside>

      <div className="md:hidden fixed top-16 inset-x-0 z-40 bg-white border-b border-brand-100 px-4 py-2 flex gap-1.5 overflow-x-auto no-scrollbar">
        {menu.map((m) => (<button key={m.id} onClick={() => setSection(m.id)} className={`pill whitespace-nowrap ${section === m.id ? 'pill-active' : ''}`}><m.icon size={14} /> {m.label}</button>))}
        <button onClick={() => setShowAdd(true)} className="pill pill-active whitespace-nowrap"><Plus size={14} /> {t('dash.addProduct')}</button>
      </div>

      <main className="flex-1 p-6 md:p-8 overflow-y-auto md:pt-8 pt-20">
        <div className="md:hidden flex justify-end mb-4"><button onClick={handleSignOut} className="btn btn-ghost btn-sm text-red-600"><LogOut size={14} /> Sign out</button></div>

        {section === 'overview' && (
          <>
            <h1 className="text-xl font-extrabold text-ink-900 mb-6">{t('dash.overview')}</h1>
            <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))' }}>
              {dashStats.map((s, i) => (
                <div key={i} className="card p-5">
                  <div className="inline-flex w-10 h-10 rounded-xl bg-brand-50 items-center justify-center text-brand-600 mb-2"><s.icon size={20} /></div>
                  <div className="text-xl font-extrabold text-ink-900 mb-1">{s.value}</div>
                  <div className="text-xs text-ink-500 mb-1">{s.label}</div>
                  <div className={`text-xs font-semibold ${s.change.startsWith('+') ? 'text-brand-600' : 'text-ink-400'}`}>{s.change} {t('dash.thisMonth')}</div>
                </div>
              ))}
            </div>
            <div className={`card p-4 mb-6 flex items-center gap-3 ${isSubscribed ? 'bg-brand-50/60 border-brand-200' : 'bg-amber-50/60 border-amber-200'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${isSubscribed ? 'bg-gradient-brand' : 'bg-amber-400'}`}>{isSubscribed ? <BadgeCheck size={20} /> : <Plus size={20} />}</div>
              <div className="flex-1"><div className="font-bold text-ink-900 text-sm">{isSubscribed ? t('dash.dynamicEnabled') : t('dash.dynamicDisabled')}</div></div>
              {!isSubscribed && <Link to="/subscription" className="btn btn-gold btn-sm hover:no-underline">{t('sub.viewPlans')}</Link>}
            </div>
          </>
        )}

        {section === 'products' && (
          <>
            <div className="flex justify-between items-center mb-5.5">
              <h1 className="text-xl font-extrabold text-ink-900 m-0">{t('dash.farmerProducts')}</h1>
              <Button onClick={() => setShowAdd(true)}><Plus size={15} /> {t('dash.addProduct')}</Button>
            </div>
            <div className="flex flex-col gap-2.5">
              {products.map((p) => {
                const name = pt(p, lang, 'name')
                return (
                  <div key={p.id} className="card p-3.5 flex items-center gap-3.5">
                    <img src={p.image} alt={name} width={58} height={58} loading="lazy" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0"><div className="font-bold text-ink-900 truncate">{name}</div><div className="text-xs text-ink-500">{p.stock} {t('detail.available')}</div></div>
                    <div className="text-end flex-shrink-0"><div className="text-base font-extrabold text-brand-600">{p.discount} {t('common.currency')}</div></div>
                    <button onClick={() => { deleteProduct(p.id); loadData(); addToast(t('dash.deleteProduct'), 'info') }} className="btn btn-danger btn-sm !p-2"><Trash2 size={14} /></button>
                  </div>
                )
              })}
              {products.length === 0 && <div className="card text-center py-15 text-ink-500"><p>{t('dash.noProducts')}</p></div>}
            </div>
          </>
        )}

        {section === 'transactions' && (
          <>
            <h1 className="text-xl font-extrabold text-ink-900 mb-5.5">Transactions</h1>
            {transactions.length === 0 ? <div className="card text-center py-15 text-ink-400"><Truck size={32} className="mx-auto mb-3 opacity-50" /><p>No transactions yet</p></div> : (
              <div className="card overflow-hidden overflow-x-auto">
                <table className="w-full text-xs min-w-[600px]">
                  <thead className="bg-brand-50"><tr><th className="p-3 text-start font-bold text-brand-600">ID</th><th className="p-3 text-start font-bold text-brand-600">Product</th><th className="p-3 text-start font-bold text-brand-600">Client</th><th className="p-3 text-start font-bold text-brand-600">Total</th><th className="p-3 text-start font-bold text-brand-600">Your Share</th><th className="p-3 text-start font-bold text-brand-600">Status</th></tr></thead>
                  <tbody>{transactions.map((txn) => (<tr key={txn.id} className="border-t border-brand-50"><td className="p-3 font-bold text-brand-600">{txn.id}</td><td className="p-3 text-ink-900">{txn.productName}</td><td className="p-3 text-ink-500">{txn.clientName}</td><td className="p-3 font-bold text-ink-900">{formatPrice(txn.total, lang)}</td><td className="p-3 text-brand-600 font-semibold">{formatPrice(txn.farmerPayout, lang)}</td><td className="p-3"><Badge variant={txn.status === 'completed' ? 'success' : 'gold'}>{txn.status}</Badge></td></tr>))}</tbody>
                </table>
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

      <AddProductModal open={showAdd} onClose={() => setShowAdd(false)} onAdd={(p) => { createProduct({ ...p, farmerId: user.uid, farmerEmail: user.email }); loadData(); setShowAdd(false); setSection('products'); addToast(t('dash.productAdded'), 'success') }} defaultWilaya={user?.wilayaCode} lang={lang} t={t} />
    </>
  )
}

function AddProductModal({ open, onClose, onAdd, defaultWilaya, lang, t }) {
  const [form, setForm] = useState({ name: '', price: '', discount: '', category: 'خضروات', unit: 'كغ', stock: '', expiry: '', wilayaCode: defaultWilaya || 16, deliveryAvailable: true, isDate: false, description: '', image: '' })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const submit = () => {
    if (!form.name || !form.price || !form.discount) return
    const localized = { name: form.name, description: form.description || 'منتج طازج', seller: 'مزرعة الخضراء', location: wilayaName(form.wilayaCode, lang), category: form.category, unit: form.unit || 'كغ', badge: 'جديد' }
    onAdd({ price: +form.price, discount: +form.discount, image: form.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&h=380&fit=crop', stock: +form.stock || 20, expiry: +form.expiry || 48, distance: (Math.random() * 5 + 0.5).toFixed(1), deliveryAvailable: form.deliveryAvailable, wilayaCode: form.wilayaCode, isDate: form.isDate, t: { [lang]: localized, ar: localized } })
    setForm({ name: '', price: '', discount: '', category: 'خضروات', unit: 'كغ', stock: '', expiry: '', wilayaCode: defaultWilaya || 16, deliveryAvailable: true, isDate: false, description: '', image: '' })
  }
  return (
    <Modal open={open} onClose={onClose} title={t('dash.addNewProduct')} maxWidth={520}>
      <div className="flex flex-col gap-3.5">
        <Input label={t('dash.productName')} value={form.name} onChange={set('name')} />
        <Input label="Image URL" value={form.image} onChange={set('image')} placeholder="https://..." dir="ltr" />
        <div className="grid grid-cols-2 gap-3"><Input label={t('dash.originalPrice')} type="number" value={form.price} onChange={set('price')} placeholder="150" /><Input label={t('dash.discountedPrice')} type="number" value={form.discount} onChange={set('discount')} placeholder="90" /></div>
        <div className="grid grid-cols-2 gap-3"><Select label={t('dash.category')} value={form.category} onChange={set('category')} options={CATEGORIES.filter((c) => c.ar !== 'الكل').map((c) => ({ value: c.ar, label: c.ar }))} /><Select label={t('wilaya.label')} value={form.wilayaCode} onChange={(e) => setForm(f => ({ ...f, wilayaCode: parseInt(e.target.value) }))} options={wilayaOptions(lang)} /></div>
        <div className="grid grid-cols-2 gap-3"><Input label={t('dash.availableQty')} type="number" value={form.stock} onChange={set('stock')} placeholder="50" /><Input label={t('dash.expiry')} type="number" value={form.expiry} onChange={set('expiry')} placeholder="72" /></div>
        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-brand-100 hover:bg-brand-50/50"><input type="checkbox" checked={form.deliveryAvailable} onChange={(e) => setForm(f => ({ ...f, deliveryAvailable: e.target.checked }))} className="w-5 h-5 accent-brand-500" /><div className="flex-1"><div className="text-sm font-semibold text-ink-900">{t('delivery.option')}</div><div className="text-[11px] text-ink-400">{t('delivery.available')}</div></div></label>
        <Textarea label={t('dash.description')} value={form.description} onChange={set('description')} rows={3} />
        <Button onClick={submit} block size="lg">{t('dash.saveProduct')}</Button>
      </div>
    </Modal>
  )
}
