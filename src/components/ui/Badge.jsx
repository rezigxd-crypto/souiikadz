/**
 * Badge — small pill for status / category / tags.
 * Variants: brand | gold | danger | info | success
 */
export default function Badge({ variant = 'brand', icon: Icon, className = '', children }) {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {Icon && <Icon size={12} aria-hidden="true" />}
      {children}
    </span>
  )
}
