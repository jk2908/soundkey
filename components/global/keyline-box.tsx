import { cn } from '#/utils/cn'

export function KeylineBox({
  children,
  ref,
  fill,
  className,
}: {
  children: React.ReactNode
  ref?: React.Ref<HTMLDivElement>
  fill?: boolean
  className?: string
}) {
  return (
    <div
      ref={ref}
      className={cn(
        'border-keyline xs:rounded-2xl xs:border xs:p-8',
        fill && 'bg-keyline/25',
        className
      )}>
      {children}
    </div>
  )
}
