import { redirect } from 'next/navigation'

import { useAuth } from '@/hooks/use-auth'

export default async function Page() {
  const user = await useAuth()

  if (!user) {
    return redirect('/login')
  }

  const { emailVerified } = user

  if (emailVerified) {
    return redirect('/dashboard')
  }

  return <></>
}
