'use client'

import { use } from 'react'

import { cn } from '#/utils/cn'

import * as Popover from '#/components/global/popover'
import type { ContentProps, Props, ToggleProps } from '#/components/global/popover'

const { PopoverContext } = Popover

export function Root({ children, ...rest }: Props) {
  return <Popover.Root {...rest}>{children}</Popover.Root>
}

export function Toggle({ children, ...rest }: {} & ToggleProps) {
  const { isOpen } = use(PopoverContext)

  return (
    <Popover.Toggle {...rest}>
      {typeof children === 'function' ? children({ isOpen }) : children}
    </Popover.Toggle>
  )
}

export function Content({
  children,
  orientation = 'vertical',
  className,
  ...rest
}: { orientation?: 'vertical' | 'horizontal' } & ContentProps) {
  return (
    <Popover.Content
      className={cn(
        'overflow-hidden bg-app-bg-inverted p-0',
        orientation === 'vertical' ? 'rounded-lg' : 'rounded-full',
        className
      )}
      {...rest}>
      <div
        role="menu"
        aria-orientation={orientation}
        className={cn(
          'group flex',
          orientation === 'vertical' ? 'flex-col py-2' : 'flex-row px-1'
        )}>
        {children}
      </div>
    </Popover.Content>
  )
}

export function Item({
  onClick,
  children,
  className,
  ...rest
}: { onClick: () => void } & React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      onClick={onClick}
      role="menuitem"
      className={cn(
        'cursor-default text-start font-mono text-xs text-app-fg-inverted hover:bg-keyline/10 focus-visible:bg-highlight focus-visible:text-white focus-visible:outline-none group-aria-[orientation=horizontal]:px-4 group-aria-[orientation=horizontal]:py-4 group-aria-[orientation=vertical]:px-4 group-aria-[orientation=vertical]:py-2',
        className
      )}
      {...rest}>
      {children}
    </button>
  )
}
