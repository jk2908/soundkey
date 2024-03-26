'use client'

import { use } from 'react'

import { cn } from '@/utils/cn'

import * as Popover from '@/components/global/popover'
import type { ContentProps, RootProps, ToggleProps } from '@/components/global/popover'

const { PopoverContext } = Popover

export function Root({ children, ...rest }: RootProps) {
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
        'overflow-hidden bg-app-bg-inverted/90 p-0 backdrop-blur-md',
        orientation === 'vertical' ? 'rounded-lg' : 'rounded-full',
        className
      )}
      {...rest}>
      <ul
        role="menu"
        aria-orientation={orientation}
        className={cn(
          'group flex',
          orientation === 'vertical' ? 'flex-col py-2' : 'flex-row px-1'
        )}>
        {children}
      </ul>
    </Popover.Content>
  )
}

export function Item({
  onClick,
  children,
  className,
  ...rest
}: { onClick: () => void } & React.HTMLAttributes<HTMLLIElement>) {
  return (
    <li
      onClick={onClick}
      role="menuitem"
      className={cn(
        'font-mono text-sm group-aria-[orientation=horizontal]:px-4 group-aria-[orientation=horizontal]:py-4 group-aria-[orientation=vertical]:px-4 group-aria-[orientation=vertical]:py-2 hover:bg-keyline/10 cursor-default',
        className
      )}
      {...rest}>
      {children}
    </li>
  )
}
