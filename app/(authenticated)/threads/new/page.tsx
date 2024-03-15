import { redirect } from 'next/navigation'
import { getUserWithEmail } from '@/actions/user/db'

import { auth } from '@/lib/auth'
import { isValidEmail } from '@/utils/is-valid-email'

import { SendMessageForm } from '@/components/authenticated/send-message-form'

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const user = await auth()

  if (!user) return redirect('/login')

  const params = searchParams.q && isValidEmail(searchParams.q) ? searchParams.q : undefined
  const toUser = params ? await getUserWithEmail(params) : undefined

  return (
    <div className="flex h-full flex-col">
      <SendMessageForm
        userId={user.userId}
        to={toUser?.email}
      />
    </div>
  )
}
