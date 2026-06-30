import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'
import { useI18n } from '../i18n'
import Logo from './Logo'

export function Footer() {
  const { t } = useI18n()

  const cols = [
    {
      title: t('footer.links'),
      links: [
        { label: t('nav.home'),       to: '/' },
        { label: t('nav.market'),     to: '/market' },
        { label: t('nav.about'),      to: '/about' },
        { label: t('nav.dashboard'),  to: '/dashboard' },
      ],
    },
    {
      title: t('footer.forSellers'),
      links: [
        { label: t('footer.registerAsSeller'), to: '/auth' },
        { label: t('footer.addProduct'),       to: '/dashboard' },
        { label: t('footer.manageOrders'),     to: '/dashboard' },
      ],
    },
    {
      title: t('footer.contact'),
      links: [
        { label: 'info@suwaika.dz',  to: null, icon: Mail },
        { label: '+213 555 123 456', to: null, icon: Phone },
        { label: t('about.impactTitle'), to: null, icon: MapPin },
      ],
    },
  ]

  return (
    <footer className="bg-brand-800 text-brand-100" style={{ direction: 'rtl' }}>
      <div className="container-page pt-14 pb-7">
        <div className="grid gap-10 mb-10" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <Logo size={40} subtitle={false} withText={false} />
              <div>
                <div className="font-extrabold text-white text-base">{t('common.brandName')}</div>
                <div className="text-[11px] text-brand-300">{t('common.brandSub')}</div>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-brand-200 max-w-xs">
              {t('footer.desc')}
            </p>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-bold text-white mb-3.5">{col.title}</h3>
              {col.links.map((l) => (
                <div key={l.label} className="mb-2 flex items-center gap-2">
                  {l.icon && <l.icon size={14} className="text-brand-300" />}
                  {l.to ? (
                    <Link to={l.to} className="text-xs text-brand-200 hover:text-white hover:underline">
                      {l.label}
                    </Link>
                  ) : (
                    <span className="text-xs text-brand-200">{l.label}</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="pt-6 border-t border-brand-700 flex justify-between items-center flex-wrap gap-3">
          <div className="text-xs text-brand-300">{t('footer.rights')}</div>
          <div className="text-xs text-brand-300 flex items-center gap-3">
            <span>{t('footer.madeIn')}</span>
            <span className="text-brand-400/60">·</span>
            <span>
              Map ©{' '}
              <a
                href="https://simplemaps.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white hover:underline"
              >
                Simplemaps
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
