'use client'

import { useFormStatus } from 'react-dom'

import { Button, type Props as ButtonProps } from '#/components/global/button'

export type Props = {
  children: React.ReactNode | (({ isPending }: { isPending: boolean }) => React.ReactNode)
} & Omit<ButtonProps, 'as' | 'children'>

export function SubmitButton({ children, ...rest }: Props) {
  const { pending: isPending } = useFormStatus()

  return (
    <Button className="flex items-center gap-4" type="submit" aria-disabled={isPending} {...rest}>
      {typeof children === 'function' ? children({ isPending }) : children}
    </Button>
  )
}
