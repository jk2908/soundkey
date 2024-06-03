import { StateVariant } from '#/lib/types'
import { cn } from '#/utils/cn'

type Props = {
  children: React.ReactNode
  type: StateVariant
  className?: string
}

export function Alert({ children, type = 'info', className }: Props) {
  return (
    <div
      className={cn('flex items-center gap-4 rounded-md bg-white p-4 text-gr33n-100', className)}>
      <span
        className={cn(
          'inline-block h-[16px] w-[16px] shrink-0 rounded-[50%] motion-safe:animate-blink',
          `bg-${type}`
        )}
        aria-hidden="true"
      />

      {children}
    </div>
  )
}
