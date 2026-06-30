import { motion } from 'framer-motion'
import {
  Leaf, Users, Lightbulb, Scale, Telescope, Target,
  Sprout, Globe, TrendingDown, Heart,
} from 'lucide-react'
import { useI18n } from '../i18n'
import { useInView } from '../hooks'
import { TEAM, TEAM_ROLES } from '../data'
import Logo from '../components/Logo'
import Seo from '../components/Seo'

const VALUE_ICONS = [Sprout, Heart, Lightbulb, Scale]
const VISION_ICONS = [Telescope, Target]

export default function AboutPage() {
  const { t, lang } = useI18n()
  const [valRef, valInView] = useInView()
  const [teamRef, teamInView] = useInView()
  const [impactRef, impactInView] = useInView()

  const values = [
    { icon: Sprout,    title: t('about.valuesTitle'),  desc: t('home.step4Desc') },
    { icon: Heart,     title: t('footer.forSellers'),  desc: t('home.heroDesc') },
    { icon: Lightbulb, title: t('home.ctaLearnMore'), desc: t('home.heroDesc') },
    { icon: Scale,     title: t('home.quality'),       desc: t('home.heroDesc') },
  ]

  const vision = [
    { icon: Telescope, title: t('about.visionTitle'),  text: t('about.visionText') },
    { icon: Target,    title: t('about.missionTitle'), text: t('about.missionText') },
  ]

  const impact = [
    { v: '12.4 طن',  l: t('about.foodSaved') },
    { v: '18.6 طن',  l: t('about.co2Reduced') },
    { v: '4,200+',   l: t('about.familiesHelped') },
  ]

  return (
    <div className="min-h-screen pt-16">
      <Seo titleKey="about.heroTitle" descKey="about.heroDesc" path="/about" />

      {/* Hero */}
      <div className="bg-gradient-brand text-white text-center py-20 px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}
        />
        <div className="relative max-w-2xl mx-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex w-16 h-16 rounded-2xl bg-white/15 items-center justify-center mb-3.5"
          >
            <Leaf size={32} />
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-extrabold mb-3.5"
          >
            {t('about.heroTitle')}
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base text-white/85 leading-relaxed"
          >
            {t('about.heroDesc')}
          </motion.p>
        </div>
      </div>

      <div className="container-page py-16">
        {/* Vision & Mission */}
        <div className="grid gap-6 mb-16" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {vision.map((item, i) => {
            const Icon = VISION_ICONS[i]
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-7"
              >
                <div className="inline-flex w-12 h-12 rounded-xl bg-brand-50 items-center justify-center text-brand-600 mb-3.5">
                  <Icon size={26} />
                </div>
                <h2 className="text-xl font-extrabold text-ink-900 mb-3">{item.title}</h2>
                <p className="text-ink-500 leading-relaxed text-sm">{item.text}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Values */}
        <h2 className="section-title text-center mb-9">{t('about.valuesTitle')}</h2>
        <div ref={valRef} className="grid gap-5 mb-16" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))' }}>
          {values.map((v, i) => {
            const Icon = VALUE_ICONS[i]
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 22 }}
                animate={valInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="card p-6"
              >
                <div className="inline-flex w-11 h-11 rounded-xl bg-gradient-brand items-center justify-center text-white mb-3">
                  <Icon size={22} />
                </div>
                <h3 className="text-base font-bold text-ink-900 mb-2">{v.title}</h3>
                <p className="text-[13px] text-ink-500 leading-relaxed">{v.desc}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Team */}
        <h2 className="section-title text-center mb-9">{t('about.teamTitle')}</h2>
        <div ref={teamRef} className="grid gap-4.5 mb-16" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))' }}>
          {TEAM.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 18 }}
              animate={teamInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="card p-6 text-center"
            >
              <div
                className="w-14 h-14 rounded-2xl mx-auto mb-2.5 flex items-center justify-center font-bold text-white text-lg"
                style={{ background: `linear-gradient(135deg, ${m.color}, ${m.color}cc)` }}
                aria-hidden="true"
              >
                {m.initials}
              </div>
              <div className="font-bold text-ink-900 mb-1.5">{m.name}</div>
              <div className="text-xs text-ink-500">{TEAM_ROLES[lang]?.[m.roleKey] || TEAM_ROLES.ar[m.roleKey]}</div>
            </motion.div>
          ))}
        </div>

        {/* Impact */}
        <div ref={impactRef} className="card bg-gradient-meadow p-12 text-center">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-white items-center justify-center text-brand-600 mb-3.5">
            <Globe size={28} />
          </div>
          <h2 className="text-2xl font-extrabold text-ink-900 mb-3.5">{t('about.impactTitle')}</h2>
          <p className="text-ink-500 text-sm leading-relaxed max-w-xl mx-auto mb-7.5">
            {t('about.impactDesc')}
          </p>
          <div className="flex justify-center gap-10 flex-wrap">
            {impact.map((s, i) => (
              <motion.div
                key={s.l}
                initial={{ opacity: 0, y: 18 }}
                animate={impactInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <div className="text-3xl font-extrabold text-brand-600">{s.v}</div>
                <div className="text-xs text-ink-500 mt-1">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
