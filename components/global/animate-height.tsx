'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'

import { cn } from '#/utils/cn'

export function AnimateHeight({
  children,
  duration = 0.1,
  isDisabled,
  className,
  ...rest
}: {
  children: React.ReactNode
  duration?: number
  isDisabled?: boolean
} & HTMLMotionProps<'div'>) {
  const ref = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | 'auto'>('auto')

  useEffect(() => {
    if (!ref.current || isDisabled) return

    let ob: ResizeObserver | null = new ResizeObserver(([entry]) => {
      setHeight(entry.contentRect.height)
    })

    ob.observe(ref.current)

    return () => {
      ob?.disconnect()
      ob = null
    }
  }, [isDisabled])

  return (
    <motion.div
      className={cn(className)}
      style={{ height }}
      animate={{ height }}
      transition={{ duration }}
      {...rest}>
      <div ref={ref}>{children}</div>
    </motion.div>
  )
}
