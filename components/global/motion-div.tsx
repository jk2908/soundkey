'use client'

import { motion, type MotionProps } from 'framer-motion'

import { cn } from '@/utils/cn'

export function MotionDiv({
  children,
  className,
  ...rest
}: { children: React.ReactNode; className?: string } & React.HTMLProps<HTMLDivElement> &
  MotionProps) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(className)}
      {...rest}>
      {children}
    </motion.div>
  )
}
