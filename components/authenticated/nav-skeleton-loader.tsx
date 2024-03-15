export function NavSkeletonLoader() {
  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-[48px] w-full animate-pulse rounded-e-full bg-keyline/30"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  )
}
