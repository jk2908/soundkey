'use client'

import { logout } from '@/lib/actions'

import { SubmitButton } from '@/components/global/submit-button'
import { LoadingSpinner } from '@/components/global/loading-spinner'

export function LogoutButton() {
  return (
    <form action={logout}>
      <SubmitButton>
        {({ pending }) => (
          <>
            {pending && <LoadingSpinner />}
            Logout
          </>
        )}
      </SubmitButton>
    </form>
  )
}
