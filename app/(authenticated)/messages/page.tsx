import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getMessagesByUser } from '@/actions/message/db'

import { auth } from '@/lib/auth'

import { Heading } from '@/components/global/heading'

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
        {messages.length
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
