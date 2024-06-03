'use client'

import React, {
  Children,
  createContext,
  use,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react'
import { flushSync } from 'react-dom'

import { useClickOutside } from '#/hooks/use-click-outside'
import { useFocusScope } from '#/hooks/use-focus-scope'
import { useKey } from '#/hooks/use-key'
import { useScrollLock } from '#/hooks/use-scroll-lock'
import { cn } from '#/utils/cn'
import { toSmartEscape } from '#/utils/to-smart-escape'

import { Button, type Props as ButtonProps } from '#/components/global/button'
import { Icon } from '#/components/global/icon'
import type { Props as OverlayProps } from '#/components/global/overlay'
import { Overlay as OverlayPrimitive } from '#/components/global/overlay'
import { Portal } from '#/components/global/portal'

type ModalProvider = {
  isOpen: boolean
  close: () => void
  isDismissible?: boolean
}

export type Props = {
  children: React.ReactNode | (({ close }: { close: () => void }) => React.ReactNode)
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  onBeforeClose?: () => unknown
  onAfterClose?: () => unknown
} & Omit<ModalProvider, 'close'>

const ModalContext = createContext<ModalProvider>({
  isOpen: false,
  close: () => {},
})

export const Root = ({
  children,
  isOpen,
  setOpen,
  onBeforeClose,
  onAfterClose,
  isDismissible = true,
}: Props) => {
  const close = useCallback(() => {
    onBeforeClose?.()

    flushSync(() => {
      setOpen(false)
    })

    onAfterClose?.()
  }, [onBeforeClose, onAfterClose, setOpen])

  useScrollLock(isOpen)
  useKey(
    'Escape',
    (e: KeyboardEvent) => {
      toSmartEscape(e, close)
    },
    {
      when: isOpen,
    }
  )

  if (!isOpen) return null

  return (
    <ModalContext.Provider value={{ isOpen, close, isDismissible }}>
      <Portal>{typeof children === 'function' ? children({ close }) : children}</Portal>
    </ModalContext.Provider>
  )
}

type Size = 'sm' | 'md' | 'lg'

type ContentProps = {
  children: React.ReactNode
  ref?: React.Ref<HTMLDivElement>
  size?: Size
  className?: string
}

export function Content({ children, ref, size = 'md', className, ...rest }: ContentProps) {
  const { isOpen, isDismissible, close } = use(ModalContext)
  const localRef = useRef<HTMLDivElement>(null)

  useClickOutside(localRef, () => isOpen && isDismissible && close())
  useFocusScope(localRef, {
    when: isOpen,
  })
  useImperativeHandle(ref, () => localRef.current!)

  const styleMap: Record<Size, string> = {
    sm: '300px',
    md: '400px',
    lg: '500px',
  }

  return (
    <div
      ref={localRef}
      className={cn(
        'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-app-bg-inverted px-6 py-10 text-app-fg-inverted shadow-lg',
        className
      )}
      style={{
        width: `min(${styleMap[size]}, calc(100vw - (var(--wrapper-px) * 2)))`,
      }}
      {...rest}>
      {children}
    </div>
  )
}

export function Heading({
  children,
  level = 2,
  ...rest
}: {
  children: React.ReactNode
  level?: 1 | 2 | 3 | 4 | 5 | 6
} & React.HTMLAttributes<HTMLHeadingElement>) {
  const Cmp = `h${level}` as const

  return (
    <Cmp className="font-medium tracking-wide" {...rest}>
      {children}
    </Cmp>
  )
}

export function Close({ variant = 'tertiary', className, ...rest }: Omit<ButtonProps, 'children'>) {
  const { close } = use(ModalContext)

  return (
    <>
      <Button
        onClick={close}
        variant={variant}
        className={cn('absolute right-1 top-1 text-app-fg-inverted', className)}
        aria-label="Close modal"
        iconOnly
        {...rest}>
        <Icon name="x" size={20} />
      </Button>
      <div className="h-4" aria-hidden="true" />
    </>
  )
}

export function Actions({ children, className, ...rest }: React.HTMLAttributes<HTMLUListElement>) {
  const wrapped = Children.map(children, (child, idx) => <li key={idx}>{child}</li>)

  return (
    <ul className={cn('mt-5 flex justify-center gap-2', className)} {...rest}>
      {wrapped}
    </ul>
  )
}

export function Overlay(props: OverlayProps) {
  return <OverlayPrimitive {...props} />
}
