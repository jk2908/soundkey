import { cn } from '@/utils/cn'

export function YSpace({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('space-y-4 md:space-y-8', className)}>{children}</div>
}
