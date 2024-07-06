'use client'

import { createContext, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { mergeRefs } from 'react-merge-refs'

import { useClickOutside } from '#/hooks/use-click-outside'
import { useFocusScope } from '#/hooks/use-focus-scope'
import { useKey } from '#/hooks/use-key'
import { useSelectContext } from '#/hooks/use-select-context'
import { cn } from '#/utils/cn'
import { toSmartEscape } from '#/utils/to-smart-escape'

import { AnimateHeight, type Props as AnimateHeightProps } from '#/components/global/animate-height'

export type SelectProvider = {
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  close: <T extends React.UIEvent | MouseEvent | KeyboardEvent>(e: T) => void
  toggleRef: React.MutableRefObject<HTMLButtonElement | null>
  shouldPersist?: boolean
}

export const SelectContext = createContext<SelectProvider | undefined>(undefined)

export function Root({
  children,
  isDefaultOpen = false,
  shouldPersist,
  ref,
  className,
  ...rest
}: {
  children: React.ReactNode
  isDefaultOpen?: boolean
  shouldPersist?: boolean
  ref?: React.Ref<HTMLDivElement>
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  const [isOpen, setOpen] = useState(shouldPersist ?? isDefaultOpen)
  const localRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  function close<T extends React.UIEvent | KeyboardEvent | MouseEvent>(e: T) {
    if (e instanceof KeyboardEvent || e.type === 'keydown') {
      e.preventDefault()

      flushSync(() => {
        setOpen(false)
      })

      toggleRef.current?.focus()
      return
    }

    setOpen(false)
  }

  useClickOutside(localRef, close, {
    when: isOpen && !shouldPersist,
  })

  useKey(
    'Escape',
    (e: KeyboardEvent) => {
      toSmartEscape(e, () => close(e))
    },
    {
      when: isOpen && !shouldPersist,
    }
  )

  useFocusScope(localRef, {
    when: isOpen,
    roving: true,
    toExcludeFromTabIndex: [toggleRef],
    onTabPress: close,
    loop: false,
  })

  return (
    <SelectContext.Provider
      value={{
        isOpen,
        setOpen,
        close,
        toggleRef,
        shouldPersist,
      }}>
      <div
        ref={mergeRefs([localRef, ref])}
        aria-haspopup="listbox"
        className={cn(className)}
        {...rest}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

export function Options({
  children,
  shouldAnimate = true,
  className,
  ...rest
}: {
  children: React.ReactNode
  shouldAnimate?: boolean
} & Omit<AnimateHeightProps, 'isDisabled'>) {
  const { isOpen } = useSelectContext()

  return (
    <AnimateHeight className={cn('w-full', className)} isDisabled={!shouldAnimate} {...rest}>
      {isOpen ? children : null}
    </AnimateHeight>
  )
}

export function Toggle({
  children,
  ref,
  className,
}: {
  children: (({ isOpen }: { isOpen: boolean }) => React.ReactNode) | React.ReactNode
  ref?: React.Ref<HTMLButtonElement>
  className?: string
}) {
  const { isOpen, setOpen, toggleRef, shouldPersist } = useSelectContext()

  if (shouldPersist) return null

  return (
    <button
      ref={mergeRefs([toggleRef, ref])}
      type="button"
      aria-expanded={isOpen}
      tabIndex={0}
      onClick={() => setOpen(prev => !prev)}
      className={cn('w-full select-none', className)}>
      {typeof children === 'function' ? children({ isOpen }) : children}
    </button>
  )
}
