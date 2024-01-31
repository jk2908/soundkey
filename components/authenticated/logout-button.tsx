'use client'

import { logout } from '@/actions/auth'

import { LoadingSpinner } from '@/components/global/loading-spinner'
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
            {pending && <LoadingSpinner size={16} />}
            {children}
          </>
        )}
      </SubmitButton>
    </form>
  )
}
