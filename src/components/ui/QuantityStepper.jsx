/**
 * QuantityStepper — increment/decrement with min/max bounds.
 */
export default function QuantityStepper({
  value,
  min = 1,
  max = 99,
  onChange,
  size = 'md',
  className = '',
}) {
  const dim = size === 'sm' ? 32 : 38
  const btnCls = size === 'sm' ? 'text-base' : 'text-lg'

  const dec = () => onChange(Math.max(min, value - 1))
  const inc = () => onChange(Math.min(max, value + 1))

  return (
    <div
      className={`inline-flex items-center border border-brand-200 rounded-lg overflow-hidden ${className}`}
      role="group"
      aria-label="الكمية"
    >
      <button
        type="button"
        onClick={dec}
        disabled={value <= min}
        aria-label="إنقاص"
        className={`text-ink-700 hover:bg-brand-50 disabled:opacity-40 disabled:cursor-not-allowed ${btnCls}`}
        style={{ width: dim, height: dim, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        −
      </button>
      <span
        className="text-center font-bold text-ink-900 bg-white"
        style={{ width: dim + 6, height: dim, lineHeight: `${dim}px` }}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={inc}
        disabled={value >= max}
        aria-label="زيادة"
        className={`text-ink-700 hover:bg-brand-50 disabled:opacity-40 disabled:cursor-not-allowed ${btnCls}`}
        style={{ width: dim, height: dim, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        +
      </button>
    </div>
  )
}
