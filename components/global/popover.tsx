'use client'

import { createContext, use, useCallback, useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion, type MotionProps } from 'framer-motion'

import { useClickOutside } from '@/hooks/use-click-outside'
import { useFocusTrap } from '@/hooks/use-focus-trap'
import { cn } from '@/utils/cn'

import { Portal } from '@/components/global/portal'

const positions = ['top', 'bottom', 'left', 'right'] as const
type Position = (typeof positions)[number]

export type Props = {
  id: string
  children: React.ReactNode
  isOpen: boolean
  content: React.ReactNode
  position?: Position
  offset?: number
  onClickOutside?: () => void
  className?: string
} & React.HTMLAttributes<HTMLDivElement>

export const PopoverContext = createContext<{
  id: string
  isOpen: boolean
  handleToggle: (prev: boolean) => void
  toggleRef: React.MutableRefObject<HTMLButtonElement | null>
  contentRef: React.MutableRefObject<HTMLDivElement | null>
  position?: Position
}>({
  id: '',
  isOpen: false,
  handleToggle: () => null,
  toggleRef: { current: null },
  contentRef: { current: null },
  position: 'top',
})

export type RootProps = {
  children: React.ReactNode
  onBeforeOpen?: () => Promise<void>
  onAfterClose?: () => Promise<void>
  duration?: number
}

export function Root({ children, onBeforeOpen, onAfterClose, duration }: RootProps) {
  const [isOpen, setOpen] = useState(false)
  const id = useId()

  const handleToggle = useCallback(
    async (prev: boolean) => {
      const newState = !prev

      if (newState) {
        if (onBeforeOpen) await onBeforeOpen()

        if (duration) {
          setTimeout(() => setOpen(false), duration)
        }
      } else {
        if (onAfterClose) await onAfterClose()
      }

      setOpen(newState)
    },
    [isOpen, onBeforeOpen, onAfterClose]
  )

  const onClickOutside = useCallback(() => {
    if (isOpen) handleToggle(isOpen)
  }, [isOpen, handleToggle])

  const toggleRef = useRef<HTMLButtonElement>(null)
  const contentRef = useClickOutside<HTMLDivElement>(onClickOutside)

  useFocusTrap(isOpen, contentRef.current)

  return (
    <PopoverContext.Provider value={{ id, isOpen, handleToggle, toggleRef, contentRef }}>
      {children}
    </PopoverContext.Provider>
  )
}

export type ToggleProps = {
  children: React.ReactNode | (({ isOpen }: { isOpen: boolean }) => React.ReactNode)
} & React.HTMLAttributes<HTMLButtonElement>

export function Toggle({ children, ...rest }: ToggleProps) {
  const { id, isOpen, handleToggle, toggleRef } = use(PopoverContext)

  function handleClick(e: React.SyntheticEvent) {
    e.stopPropagation()
    handleToggle(isOpen)
  }

  return (
    <button
      id={`${id}-t`}
      ref={toggleRef}
      aria-haspopup="true"
      aria-expanded={isOpen}
      aria-controls={`${id}-c`}
      onClick={handleClick}
      {...rest}>
      {typeof children === 'function' ? children({ isOpen }) : children}
    </button>
  )
}

export type ContentProps = {
  children: React.ReactNode
  offset?: number
  position?: Position
} & React.HTMLAttributes<HTMLDivElement> &
  MotionProps

export function Content({
  children,
  offset = 4,
  position = 'top',
  className,
  ...rest
}: ContentProps) {
  const { isOpen, toggleRef, contentRef } = use(PopoverContext)
  const [style, setStyle] = useState({})
  const id = useId()

  const handleCalc = useCallback(() => {
    const toggleNode = toggleRef.current
    const contentNode = contentRef.current

    if (!toggleNode || !contentNode) return

    const {
      x: toggleX,
      y: toggleY,
      width: toggleWidth,
      height: toggleHeight,
    } = toggleNode.getBoundingClientRect()
    const { width: contentWidth, height: contentHeight } = contentNode.getBoundingClientRect()

    const newStyle: React.CSSProperties = {}

    switch (position) {
      case 'top':
        newStyle.top = `${toggleY - contentHeight - offset}px`
        newStyle.left = `${toggleX + toggleWidth / 2 - contentWidth / 2}px`
        break
      case 'bottom':
        newStyle.top = `${toggleY + toggleHeight + offset}px`
        newStyle.left = `${toggleX + toggleWidth / 2 - contentWidth / 2}px`
        break
      case 'left':
        newStyle.top = `${toggleY + toggleHeight / 2 - contentHeight / 2}px`
        newStyle.left = `${toggleX - contentWidth - offset}px`
        break
      case 'right':
        newStyle.top = `${toggleY + toggleHeight / 2 - contentHeight / 2}px`
        newStyle.left = `${toggleX + toggleWidth + offset}px`
        break
    }

    setStyle(newStyle)
  }, [position, offset, toggleRef, contentRef])

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
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key={id}
            ref={contentRef}
            id={`${id}-c`}
            aria-labelledby={`${id}-t`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              'fixed whitespace-nowrap rounded-[3px] bg-app-bg-inverted/95 bg-gr33n-100 px-1 py-0.5 text-xs text-app-fg-inverted',
              className
            )}
            style={style}
            {...rest}>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  )
}
