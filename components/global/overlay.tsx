import { cn } from '#/utils/cn'

export type Props = {
  children?: React.ReactNode
  className?: string
}

export function Overlay({
  children,
  className,
}: Props) {
  return (
    <div
      className={cn('fixed inset-0 bg-neutral-950/30 backdrop-blur-sm', className)}
      aria-hidden="true">
      {children}
    </div>
  )
}
