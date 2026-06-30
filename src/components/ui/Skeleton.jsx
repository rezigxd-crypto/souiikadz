/**
 * Skeleton — shimmer placeholder.
 */
export function Skeleton({ width = '100%', height = 20, radius = 8, className = '' }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius: radius }}
      aria-hidden="true"
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <Skeleton width="100%" height={180} radius={0} />
      <div className="p-4 flex flex-col gap-2.5">
        <Skeleton height={12} width="50%" />
        <Skeleton height={18} width="75%" />
        <Skeleton height={12} width="40%" />
        <Skeleton height={28} />
      </div>
    </div>
  )
}
