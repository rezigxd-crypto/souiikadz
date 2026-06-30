/**
 * Brand logo for Suwaika Dezad — a stylized tree.
 * Pure SVG, scales cleanly, used in Navbar, Auth, Footer, About.
 */
export default function Logo({ size = 40, withText = true, subtitle = true, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 ${className}`}
      style={{ direction: 'rtl' }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="logo-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1a6b3a" />
            <stop offset="100%" stopColor="#2d9b5a" />
          </linearGradient>
          <linearGradient id="logo-leaf" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#dcf0dc" />
          </linearGradient>
          <linearGradient id="logo-trunk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c9a227" />
            <stop offset="100%" stopColor="#8a6f1a" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#logo-bg)" />
        <rect x="29" y="38" width="6" height="18" rx="2" fill="url(#logo-trunk)" />
        <circle cx="32" cy="22" r="13" fill="url(#logo-leaf)" />
        <circle cx="22" cy="30" r="9" fill="url(#logo-leaf)" opacity="0.85" />
        <circle cx="42" cy="30" r="9" fill="url(#logo-leaf)" opacity="0.85" />
        <path
          d="M32 14 L32 32 M32 22 L24 26 M32 22 L40 26 M32 28 L26 32 M32 28 L38 32"
          stroke="#1a6b3a"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.45"
        />
      </svg>

      {withText && (
        <span className="flex flex-col leading-none">
          <span
            className="font-extrabold text-ink-900"
            style={{ fontSize: '0.95rem', lineHeight: 1.1 }}
          >
            سويقة ديزاد
          </span>
          {subtitle && (
            <span
              className="font-semibold text-brand-600"
              style={{ fontSize: '0.66rem', lineHeight: 1.2 }}
            >
              بورصة الغذاء
            </span>
          )}
        </span>
      )}
    </span>
  )
}
