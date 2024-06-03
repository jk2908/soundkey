import { forwardRef } from 'react'

import { cn } from '#/utils/cn'

type Props = {
  children: React.ReactNode
  onClick?: (value: string) => void
  className?: string
  as?: React.ElementType
}

export const Chip = forwardRef<HTMLElement | HTMLButtonElement, Props>(
  ({ children, onClick, className, as = onClick ? 'button' : 'div', ...rest }, ref) => {
    const Cmp = as

    return (
      <Cmp
        ref={ref}
        onClick={onClick}
        type={onClick ? 'button' : undefined}
        className={cn(
          'flex h-full items-center gap-2 rounded-full bg-keyline/30 px-4 py-2 font-mono text-xs',
          className
        )}
        {...rest}>
        {children}
      </Cmp>
    )
  }
)

Chip.displayName = 'Chip'
