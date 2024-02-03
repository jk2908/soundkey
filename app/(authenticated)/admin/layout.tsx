import { redirect } from 'next/navigation'

import { auth, isAAAUser } from '@/lib/auth'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await auth()

  if (!user) throw redirect('/login')

  const isAllowedToBeHere = isAAAUser(user?.role)

  if (!isAllowedToBeHere) throw redirect('/dashboard')

  return <>{children}</>
}
