'use client'

import { useFormStatus } from 'react-dom'

import { Button, type Props as ButtonProps } from '@/components/global/button'

export type Props = {
  children: React.ReactNode | (({ pending }: { pending: boolean }) => React.ReactNode)
} & Omit<ButtonProps<'button'>, 'children'>

export function SubmitButton({ children, ...rest }: Props) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" aria-disabled={pending} {...rest}>
      {typeof children === 'function' ? children({ pending }) : children}
    </Button>
  )
}
