import { cn } from '#/utils/cn'

export function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn('rounded-full bg-neutral-100 px-4 py-2 text-sm text-neutral-600', className)}>
      {children}
    </span>
  )
}
