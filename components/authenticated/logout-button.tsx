'use client'

import { logout } from '@/lib/actions'

import { Icon } from '@/components/global/icon'
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
            {pending && <LoadingSpinner />}
            {children ? (
              children
            ) : (
              <>
                <Icon name="logout" size={20} title="Logout" />
                <span className="sr-only">Logout</span>
              </>
            )}
          </>
        )}
      </SubmitButton>
    </form>
  )
}
