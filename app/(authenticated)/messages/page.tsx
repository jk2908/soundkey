import Link from 'next/link'
import { getMessagesByUser } from '@/actions/message'

import { auth } from '@/lib/auth'

import { Heading } from '@/components/global/heading'
import { KeylineBox } from '@/components/global/keyline-box'
import { redirect } from 'next/navigation'

export default async function Page() {
  const user = await auth()

  if (!user) throw redirect('/login')

  const messages = await getMessagesByUser(user.userId)

  return (
    <>
      <Heading level={1} className="sr-only">
        Messages
      </Heading>
      <ul>
        {messages
          ? messages.map(({ threadId, messageId, body }) => (
              <li key={messageId}>
                {body} <Link href={`/messages/${threadId}`}>View</Link>
              </li>
            ))
          : 'Inbox empty'}
      </ul>
    </>
  )
}
