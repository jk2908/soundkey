'use client'

import type { IntentVariant, StateVariant } from '@/lib/types'
import { cn } from '@/utils/cn'

export type Props = {
  children: React.ReactNode
  variant?: IntentVariant | StateVariant
  className?: string
  type?: 'button' | 'submit' | 'reset'
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

export function Button({
  children,
  variant = 'primary',
  className,
  type = 'button',
  ...rest
}: Props) {
  const styleMap: Record<IntentVariant | StateVariant, string> = {
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
    <button
      type={type}
      className={cn('rounded-full px-8 py-2 tracking-wide flex items-center gap-4', styleMap[variant], className)}
      {...rest}>
      {children}
    </button>
  )
}
