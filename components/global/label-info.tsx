import { cn } from '#/utils/cn'

export function LabelInfo({
  children,
  className,
  ...rest
}: {
  children: React.ReactNode
  className?: string
} & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn('mt-1 block text-pretty text-xs leading-[1.3] text-highlight', className)}
      {...rest}>
      {children}
    </span>
  )
}
