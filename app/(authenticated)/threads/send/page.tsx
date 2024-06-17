import { redirect } from 'next/navigation'
import { resolveMessageRecipient } from '#/api/message/utils'

import { auth } from '#/lib/auth'
import { BodyHeading } from '#/components/global/body-heading'

import { SendMessageForm } from '#/components/authenticated/message/send-message-form'

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
    <>
      <BodyHeading level={1} className="sr-only">
        Create a new thread
      </BodyHeading>

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
    </>
  )
}
