import { redirect } from 'next/navigation'
import { resolveMessageRecipient } from '@/actions/message/db'

import { auth } from '@/lib/auth'

import { SendMessageForm } from '@/components/authenticated/message/send-message-form'

export const metadata = {
  title: 'New thread',
}

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const user = await auth()

  if (!user) return redirect('/login')

  const toUser = searchParams.q ? await resolveMessageRecipient(searchParams.q) : null

  return (
    <div className="flex h-full flex-col">
      <SendMessageForm
        senderId={user.userId}
        resolvedRecipients={
          toUser
            ? [
                {
                  userId: toUser.userId,
                  label: toUser.username,
                },
              ]
            : []
        }
      />
    </div>
  )
}
