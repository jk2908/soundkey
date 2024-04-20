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
    primary: 'bg-app-bg-inverted hover:bg-app-bg-inverted/75 text-app-fg-inverted',
    secondary: 'bg-keyline/70 hover:bg-keyline text-app-fg',
    tertiary: 'bg-transparent hover:bg-neutral-100 text-neutral-900',
    danger: 'bg-danger hover:bg-danger-dark text-white',
    success: 'bg-success hover:bg-success-dark text-white',
    warning: 'bg-warning hover:bg-warning-dark text-white',
    info: 'bg-info hover:bg-info-dark text-white',
    error: 'bg-error hover:bg-error-dark text-white',
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