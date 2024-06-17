import { cn } from '#/utils/cn'

export type Props = {
  children?: React.ReactNode
  ref?: React.Ref<HTMLDivElement>
  className?: string
}

export function Overlay({ children, ref, className }: Props) {
  return (
    <div
      ref={ref}
      className={cn('fixed inset-0 bg-neutral-950/30 backdrop-blur-sm', className)}
      aria-hidden="true">
      {children}
    </div>
  )
}
