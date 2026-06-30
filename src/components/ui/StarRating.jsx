import { Star } from 'lucide-react'

/**
 * StarRating — accessible star rating display (read-only) or input.
 */
export default function StarRating({ value = 0, size = 14, count, onChange, className = '' }) {
  const interactive = !!onChange
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <span className="inline-flex" role={interactive ? 'radiogroup' : 'img'} aria-label={`${value} من 5`}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={size}
            fill={i < Math.floor(value) ? '#c9a227' : 'none'}
            color={i < Math.floor(value) ? '#c9a227' : '#bbe1bb'}
            strokeWidth={1.5}
            className={interactive ? 'cursor-pointer' : ''}
            onClick={() => onChange?.(i + 1)}
            aria-hidden="true"
          />
        ))}
      </span>
      {count !== undefined && (
        <span className="text-xs text-ink-400">({count})</span>
      )}
    </span>
  )
}
