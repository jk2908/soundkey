import { redirect } from 'next/navigation'
import { getProfile } from '@/actions/profile/handlers'

import { auth, is$User } from '@/lib/auth'
import { getTimeMessage } from '@/utils/get-time-message'

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
  const { username } = await getProfile(u.userId)
  const greeting = getTimeMessage(Date.now())

  return (
    <>
      <h1 className="sr-only">Dashboard</h1>
      <h2 className="font-medium">{greeting} {username}</h2>

      {$User ? admin : user}
    </>
  )
}
