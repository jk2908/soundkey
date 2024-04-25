'use client'

import React, {
  Children,
  createContext,
  forwardRef,
  use,
  useCallback,
  useImperativeHandle,
} from 'react'
import { flushSync } from 'react-dom'

import { useClickOutside } from '@/hooks/use-click-outside'
import { useFocusScope } from '@/hooks/use-focus-scope'
import { useKey } from '@/hooks/use-key'
import { useScrollLock } from '@/hooks/use-scroll-lock'
import { cn } from '@/utils/cn'
import { generateId } from '@/utils/generate-id'
import { toSmartEscape } from '@/utils/to-smart-escape'

import { Button, type Props as ButtonProps } from '@/components/global/button'
import { Icon } from '@/components/global/icon'
import type { Props as OverlayProps } from '@/components/global/overlay'
import { Overlay as OverlayPrimitive } from '@/components/global/overlay'
import { Portal } from '@/components/global/portal'

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
  size?: Size
  className?: string
}

export const Content = forwardRef<
  HTMLDivElement,
  ContentProps & React.HTMLAttributes<HTMLDivElement>
>(({ children, size = 'sm', className, ...rest }, ref) => {
  const { isOpen, isDismissible, close } = use(ModalContext)

  const localRef = useClickOutside<HTMLDivElement>(() => isOpen && isDismissible && close())
  useImperativeHandle(ref, () => localRef.current!)
  useFocusScope(localRef, {
    when: isOpen,
  })

  const styleMap: Record<Size, string> = {
    sm: '300px',
    md: '400px',
    lg: '500px',
  }

  return (
    <div
      ref={localRef}
      className={cn(
        'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-app-bg-inverted p-6 text-app-fg-inverted shadow-lg',
        className
      )}
      style={{
        width: `min(${styleMap[size]}, calc(100vw - (var(--wrapper-px) * 2)))`,
      }}
      {...rest}>
      {children}
    </div>
  )
})

Content.displayName = 'ModalContent'

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
  const wrapped = Children.map(children, child => <li key={generateId()}>{child}</li>)

  return (
    <ul className={cn('mt-5 flex justify-center gap-2', className)} {...rest}>
      {wrapped}
    </ul>
  )
}

export function Overlay({ children, ...props }: OverlayProps) {
  return <OverlayPrimitive {...props}>{children}</OverlayPrimitive>
}
