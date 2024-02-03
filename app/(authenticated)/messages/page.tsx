import Link from 'next/link'
import { getMessagesByUser } from '@/actions/message'

import { auth } from '@/lib/auth'

import { Heading } from '@/components/global/heading'
import { KeylineBox } from '@/components/global/keyline-box'

export default async function Page() {
  const user = await auth()

  if (!user) return

  const messages = await getMessagesByUser(user.userId)

  return (
    <KeylineBox>
      <Heading level={1} styleAsLevel={4}>
        Messages
      </Heading>
      <ul>
        {messages.map(({ threadId, messageId, body }) => (
          <li key={messageId}>
            {body} <Link href={`/messages/${threadId}`}>View</Link>
          </li>
        ))}
      </ul>
    </KeylineBox>
  )
}
