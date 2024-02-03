import { getMessage, getMessagesByThread, } from '@/actions/message'
import { getUsers } from '@/actions/user'

import { auth } from '@/lib/auth'

export async function generateMetadata({ params }: { params: { threadId: string } }) {
  const [message] = await getMessagesByThread(params.threadId)

  if (!message) return

  const title = message.body.match('^.*?[.!?](?=s[A-Z]|s?$)(?!.*))')

  return { title }
}

export default async function Page({ params }: { params: { messageId: string } }) {
  const user = await auth()

  if (!user) return

  const message = await getMessage(params.messageId)

  return <ul>{message?.body}</ul>
}
