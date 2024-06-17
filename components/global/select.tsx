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

import { AnimateHeight } from './animate-height'

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
  shouldAnimate = true,
  ref,
  className,
  ...rest
}: {
  children: React.ReactNode
  isDefaultOpen?: boolean
  shouldPersist?: boolean
  shouldAnimate?: boolean
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
    onTabFocusOut: close,
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
        <AnimateHeight className="w-full" isDisabled={!shouldAnimate}>{children}</AnimateHeight>
      </div>
    </SelectContext.Provider>
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
      className={cn('select-none w-full', className)}>
      {typeof children === 'function' ? children({ isOpen }) : children}
    </button>
  )
}
