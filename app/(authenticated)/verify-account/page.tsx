import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'

export default async function Page() {
  const user = await auth()

  if (!user) {
    throw redirect('/login')
  }

  const { emailVerified } = user

  if (emailVerified) {
    throw redirect('/dashboard')
  }

  return <></>
}
