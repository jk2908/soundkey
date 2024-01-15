import { auth } from '@/lib/auth'

import { Alert } from '@/components/global/alert'

export default async function Page() {
  const user = await auth()

  return (
    <>
      {!user?.emailVerified && (
        <Alert type="warning">
          Your email address has not been verified. Please check your inbox for a verification
          email.
        </Alert>
      )}
    </>
  )
}
