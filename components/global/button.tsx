import React, { forwardRef, HTMLAttributes } from 'react'

import type { IntentVariant, StateVariant } from '@/lib/types'
import { cn } from '@/utils/cn'

type OwnProps<E extends React.ElementType = React.ElementType> = {
  children: React.ReactNode
  as?: E
  variant?: IntentVariant | StateVariant
  className?: string
  iconOnly?: boolean
}

export type Props<E extends React.ElementType> = OwnProps<E> &
  Omit<React.ComponentProps<E>, keyof OwnProps>

const DEFAULT_ELEMENT = 'button'

export function Button<E extends React.ElementType = typeof DEFAULT_ELEMENT>({
  children,
  as,
  variant = 'primary',
  className,
  iconOnly,
  ...rest
}: Props<E>) {
  const Cmp = as ?? DEFAULT_ELEMENT

  const styleMap: { [key in StateVariant | IntentVariant]: string } = {
    primary: 'bg-app-bg-inverted text-app-fg-inverted',
    secondary: 'bg-neutral-200 hover:bg-neutral-300 text-neutral-900',
    tertiary: 'bg-transparent hover:bg-neutral-100 text-neutral-900',
    danger: 'bg-danger-500 hover:bg-danger-600 text-white',
    success: 'bg-success-500 hover:bg-success-600 text-white',
    warning: 'bg-warning-500 hover:bg-warning-600 text-white',
    info: 'bg-info-500 hover:bg-info-600 text-white',
    error: 'bg-error-500 hover:bg-error-600 text-white',
  }

  return (
    <Cmp
      className={cn(
        'flex items-center gap-3 rounded-full px-8 py-2 tracking-wide',
        styleMap[variant],
        iconOnly && 'p-2',
        className
      )}
      {...rest}>
      {children}
    </Cmp>
  )
}