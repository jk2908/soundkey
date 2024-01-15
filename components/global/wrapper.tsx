import { cn } from '@/utils/cn'

export function Wrapper({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn('mx-auto w-full max-w-240 px-4 sm:px-8', className)}>{children}</div>
}
