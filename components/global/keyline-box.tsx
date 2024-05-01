import { cn } from '#/utils/cn'

export function KeylineBox({
  children,
  fill,
  className,
}: {
  children: React.ReactNode
  fill?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        'xs:rounded-2xl xs:border xs:border-keyline xs:p-8',
        fill && 'bg-keyline/25',
        className
      )}>
      {children}
    </div>
  )
}
