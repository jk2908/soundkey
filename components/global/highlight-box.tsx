import { cn } from '#/utils/cn'

export function HighlightBox({
  children,
  ref,
  className,
  ...rest
}: {
  children: React.ReactNode
  ref?: React.Ref<HTMLDivElement>
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border border-highlight/30 bg-highlight/10 p-6',
        className
      )}
      {...rest}>
      {children}
    </div>
  )
}
