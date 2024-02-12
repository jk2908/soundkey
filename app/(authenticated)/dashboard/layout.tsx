import { redirect } from 'next/navigation'

import { auth, is$User } from '@/lib/auth'

export default async function Layout({
  user,
  admin,
}: {
  user: React.ReactNode
  admin: React.ReactNode
}) {
  const u = await auth()

  if (!u) throw redirect('/login')

  const $User = is$User(u.role)

  return <>{$User ? admin : user}</>
}
