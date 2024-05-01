import { redirect } from 'next/navigation'

import { auth, is$User } from '#/lib/auth'
import { getTimedMessage } from '#/utils/get-timed-message'

import { YSpace } from '#/components/global/y-space'

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
  const greeting = getTimedMessage(Date.now(), u.username)

  return (
    <YSpace className="flex grow flex-col">
      <div>
        <h1 className="sr-only">Dashboard</h1>
        <h2 className="font-medium">{greeting}</h2>
      </div>

      {$User ? admin : user}
    </YSpace>
  )
}
