'use client'

import { AnimatePresence } from 'framer-motion'

import { cn } from '#/utils/cn'

export function MessageList({
  children,
  className,
  ...rest
}: {
  children: React.ReactNode
  className?: string
} & React.HTMLProps<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col gap-8', className)} {...rest}>
      <AnimatePresence>{children}</AnimatePresence>
    </div>
  )
}
