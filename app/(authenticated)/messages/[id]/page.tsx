import { getMessage, getMessagesByThread, getThread } from '@/actions/message'

import { auth } from '@/lib/auth'

export async function generateMetadata({ params }: { params: { threadId: string } }) {
  const [message] = await getMessagesByThread(params.threadId)

  if (!message) return

  const title = message.content.match('^.*?[.!?](?=s[A-Z]|s?$)(?!.*))')

  return { title }
}

export default async function Page({ params }: { params: { messageId: string } }) {
  const user = await auth()

  if (!user) return

  const message = await getMessage(params.messageId)

  return <ul>{message?.content}</ul>
}
