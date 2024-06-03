'use client'

import { createContext, use, useCallback, useEffect, useId, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

import { useClickOutside } from '#/hooks/use-click-outside'
import { useFocusScope } from '#/hooks/use-focus-scope'
import { useKey } from '#/hooks/use-key'
import { cn } from '#/utils/cn'

import { Portal } from '#/components/global/portal'

const positions = ['top', 'bottom', 'left', 'right'] as const
type Position = (typeof positions)[number]

export const PopoverContext = createContext<{
  id: string
  isOpen: boolean
  toggle: (prev: boolean) => void
  toggleRef: React.MutableRefObject<HTMLButtonElement | null>
  contentRef: React.MutableRefObject<HTMLDivElement | null>
  position?: Position
}>({
  id: '',
  isOpen: false,
  toggle: () => null,
  toggleRef: { current: null },
  contentRef: { current: null },
  position: 'top',
})

export type Props = {
  children: React.ReactNode
  onBeforeOpen?: () => Promise<void>
  onAfterClose?: () => Promise<void>
  duration?: number
}

export function Root({ children, onBeforeOpen, onAfterClose, duration }: Props) {
  const [isOpen, setOpen] = useState(false)
  const id = useId()

  const toggle = useCallback(
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
    [onBeforeOpen, onAfterClose, duration]
  )

  const onClickOutsideOrEsc = useCallback(() => {
    if (isOpen) toggle(isOpen)
  }, [isOpen, toggle])

  function onClickOutsideOrEscWithFocus() {
    flushSync(() => {
      onClickOutsideOrEsc()
    })

    toggleRef.current?.focus()
  }

  const toggleRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useClickOutside(contentRef, onClickOutsideOrEsc)
  useFocusScope(contentRef, {
    when: isOpen,
    roving: true,
    onTabFocusOut: onClickOutsideOrEscWithFocus,
  })
  useKey('Escape', onClickOutsideOrEscWithFocus)

  return (
    <PopoverContext.Provider value={{ id, isOpen, toggle, toggleRef, contentRef }}>
      {children}
    </PopoverContext.Provider>
  )
}

export type ToggleProps = {
  children: React.ReactNode | (({ isOpen }: { isOpen: boolean }) => React.ReactNode)
} & Omit<React.HTMLAttributes<HTMLButtonElement>, 'children'>

export function Toggle({ children, ...rest }: ToggleProps) {
  const { id, isOpen, toggle, toggleRef } = use(PopoverContext)

  return (
    <button
      id={`${id}-t`}
      ref={toggleRef}
      aria-haspopup="true"
      aria-expanded={isOpen}
      aria-controls={`${id}-c`}
      onClick={(e: React.SyntheticEvent) => {
        e.stopPropagation()
        toggle(isOpen)
      }}
      {...rest}>
      {typeof children === 'function' ? children({ isOpen }) : children}
    </button>
  )
}

export type ContentProps = {
  children: React.ReactNode
  offset?: number
  position?: Position
} & React.HTMLAttributes<HTMLDivElement>

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

  const doCalc = useCallback(() => {
    if (!toggleRef.current || !contentRef.current) return

    const { x: tX, y: tY, width: tW, height: tH } = toggleRef.current.getBoundingClientRect()
    const { width: cW, height: cH } = contentRef.current.getBoundingClientRect()

    const newStyle: React.CSSProperties = {}

    switch (position) {
      case 'top':
        newStyle.top = `${tY - cH - offset}px`
        newStyle.left = `${tX + tW / 2 - cW / 2}px`
        break
      case 'bottom':
        newStyle.top = `${tY + tH + offset}px`
        newStyle.left = `${tX + tW / 2 - cW / 2}px`
        break
      case 'left':
        newStyle.top = `${tY + tH / 2 - cH / 2}px`
        newStyle.left = `${tX - cW - offset}px`
        break
      case 'right':
        newStyle.top = `${tY + tH / 2 - cH / 2}px`
        newStyle.left = `${tX + tW + offset}px`
        break
    }

    setStyle(newStyle)
  }, [position, offset, toggleRef, contentRef])

  useEffect(() => {
    doCalc()
  }, [doCalc, isOpen])

  useEffect(() => {
    addEventListener('resize', doCalc)

    return () => {
      removeEventListener('resize', doCalc)
    }
  }, [doCalc])

  return (
    <Portal>
      {isOpen && (
        <div
          ref={contentRef}
          id={`${id}-c`}
          aria-labelledby={`${id}-t`}
          className={cn(
            'fixed whitespace-nowrap rounded-[3px] bg-app-bg-inverted/95 bg-gr33n-100 px-1 py-0.5 text-xs text-app-fg-inverted',
            className
          )}
          style={style}
          {...rest}>
          {children}
        </div>
      )}
    </Portal>
  )
}
