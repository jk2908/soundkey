'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { createPortal } from 'react-dom'

import { useClickOutside } from '@/hooks/use-click-outside'
import { cn } from '@/utils/cn'

export type Props = {
  children: React.ReactNode
  isOpen: boolean
  setOpen:
    | React.Dispatch<React.SetStateAction<boolean>>
    | React.Dispatch<boolean>
    | ((action: unknown) => boolean)
  className?: string
  onClose?: () => void
}

export const Dialog = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { children, isOpen, setOpen, className, onClose } = props

  function handleClose() {
    setOpen(false)
    onClose?.()
  }

  const localRef = useClickOutside<HTMLDivElement>(() => isOpen && handleClose())
  useImperativeHandle(ref, () => localRef.current!)

  if (!isOpen) return null

  return createPortal(
    <AnimatePresence>
      <motion.div
        ref={localRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={cn(
          'fixed left-1/2 top-1/2 w-[min(550px,(100vw-(var(--wrapper-px)_*_2)))] -translate-x-1/2 -translate-y-1/2',
          className
        )}>
        {children}
      </motion.div>
    </AnimatePresence>,
    document.getElementById('portal')!
  )
})

Dialog.displayName = 'Dialog'
