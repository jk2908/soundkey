import { cn } from '@/utils/cn'

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <span className="flex flex-col gap-2">
      {Array.from({ length: lines }).map((_, idx) => (
        <span
          key={idx}
          className={cn('h-1.5 animate-pulse rounded-full bg-keyline/70', className)}
          style={{
            width: idx === 0 ? '100%' : `${idx * 10 + 50}%`,
            animationDelay: `${idx * 150}ms`,
          }}
        />
      ))}
    </span>
  )
}
