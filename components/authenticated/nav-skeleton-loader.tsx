export function NavSkeletonLoader() {
  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length: 5 }).map((_, idx) => (
        <div
          key={idx}
          className="h-[48px] w-full animate-pulse rounded-e-full bg-keyline/30"
          style={{ animationDelay: `${idx * 150}ms` }}
        />
      ))}
    </div>
  )
}
