'use client'

import { logout } from '@/api/user/actions'

import { Spinner } from '@/components/global/spinner'
import { SubmitButton } from '@/components/global/submit-button'
import type { Props } from '@/components/global/submit-button'

export function LogoutButton({
  children,
  ...rest
}: { children?: React.ReactNode } & Omit<Props, 'children'>) {
  return (
    <form action={logout}>
      <SubmitButton {...rest}>
        {({ pending }) => (
          <>
            {children}
            {pending && <Spinner size={16} />}
          </>
        )}
      </SubmitButton>
    </form>
  )
}
