'use client'

import { Children, cloneElement, useCallback, useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { cn } from '@/utils/cn'
import { useClickOutside } from '@/hooks/use-click-outside'

const positions = ['top', 'bottom', 'left', 'right'] as const
type Position = (typeof positions)[number]

export type Props = {
  children: React.ReactNode
  isOpen: boolean
  content: React.ReactNode
  position?: Position
  offset?: number
  onClickOutside?: () => void
  className?: string
}

export function Popover({
  children,
  isOpen,
  content,
  position = 'top',
  offset = 4,
  onClickOutside,
  className,
}: Props) {
  const anchorRef = useRef<HTMLElement>(null)
  const contentRef = useClickOutside<HTMLDivElement>(() => onClickOutside?.())

  const child = Children.only(children) as React.ReactElement
  const anchor = cloneElement(child, { ref: anchorRef })

  const [style, setStyle] = useState({})
  const id = useId()

  const handleCalc = useCallback(() => {
    const anchorNode = anchorRef.current
    const contentNode = contentRef.current

    if (!anchorNode || !contentNode) return

    const {
      x: anchorX,
      y: anchorY,
      width: anchorWidth,
      height: anchorHeight,
    } = anchorNode.getBoundingClientRect()
    const { width: contentWidth, height: contentHeight } = contentNode.getBoundingClientRect()

    const newStyle: React.CSSProperties = {}

    switch (position) {
      case 'top':
        newStyle.top = `${anchorY - contentHeight - offset}px`
        newStyle.left = `${anchorX + anchorWidth / 2 - contentWidth / 2}px`
        break
      case 'bottom':
        newStyle.top = `${anchorY + anchorHeight + offset}px`
        newStyle.left = `${anchorX + anchorWidth / 2 - contentWidth / 2}px`
        break
      case 'left':
        newStyle.top = `${anchorY + anchorHeight / 2 - contentHeight / 2}px`
        newStyle.left = `${anchorX - contentWidth - offset}px`
        break
      case 'right':
        newStyle.top = `${anchorY + anchorHeight / 2 - contentHeight / 2}px`
        newStyle.left = `${anchorX + anchorWidth + offset}px`
        break
    }

    setStyle(newStyle)
  }, [position, offset, contentRef])

  useEffect(() => {
    handleCalc()
  }, [handleCalc, isOpen])

  useEffect(() => {
    window.addEventListener('resize', handleCalc)

    return () => {
      window.removeEventListener('resize', handleCalc)
    }
  }, [handleCalc])

  return (
    <>
      {anchor}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key={id}
            ref={contentRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              'bg-gr33n-100 fixed z-50 whitespace-nowrap rounded-[3px] bg-app-bg-inverted/95 px-1 py-0.5 text-xs text-app-fg-inverted',
              className
            )}
            style={style}>
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
