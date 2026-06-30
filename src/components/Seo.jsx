import { Helmet } from 'react-helmet-async'
import { useI18n } from '../i18n'

/**
 * Seo — per-page meta tags.
 */
export default function Seo({ titleKey, descKey, path = '/' }) {
  const { t, lang } = useI18n()
  const title = t(titleKey)
  const desc  = t(descKey)
  const url   = `https://suwaika.dz${path}`

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={desc} />
    </Helmet>
  )
}
