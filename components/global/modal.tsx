'use client'

import { useEffect, useRef } from 'react'

import { useClickOutside } from '@/hooks/use-click-outside'

type BaseProps = {
  children: React.ReactNode
  isOpen: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  className?: string
  isDismissable?: boolean
  onClose?: () => void
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDialogElement>, HTMLDialogElement>

type DismissableProps = {
  isDismissable?: true
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export type Props = BaseProps & (BaseProps['isDismissable'] extends true ? DismissableProps : {})

export function Modal({ children, isOpen, setOpen, isDismissable = true, onClose }: Props) {
  const wrapperRef = useRef<HTMLDialogElement>(null)
  const innerRef = useClickOutside<HTMLDivElement>(() => {
    isDismissable && setOpen?.(false)
  })

  useEffect(() => {
    const node = wrapperRef.current

    if (!node) return

    if (isOpen) {
      node.showModal()
    } else {
      node.close()
      onClose?.()
    }
  }, [isOpen, onClose])

  return (
    <dialog ref={wrapperRef} className="fixed inset-0">
      <div ref={innerRef}>{children}</div>
    </dialog>
  )
}
