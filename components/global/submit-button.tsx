'use client'

import { useFormStatus } from 'react-dom'

import { Button, type Props } from '@/components/global/button'

export function SubmitButton({
  children,
  ...rest
}: Omit<Props, 'children' | 'type'> & {
  children: React.ReactNode | (({ pending }: { pending: boolean }) => React.ReactNode)
}) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" aria-disabled={pending} {...rest}>
      {typeof children === 'function' ? children({ pending }) : children}
    </Button>
  )
}
