'use client'

import React from 'react'
import { motion, MotionProps } from 'framer-motion'

import { cn } from '@/utils/cn'

export function MessageWrapper({
  children,
  className,
  ...rest
}: {
  children: React.ReactNode
  className?: string
} & React.HTMLProps<HTMLDivElement> &
  MotionProps) {
  return (
    <motion.div
      layout
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(className)}
      {...rest}>
      {children}
    </motion.div>
  )
}
