import { Suspense } from 'react'
import { getMessagesWithThread } from '@/actions/message/db'

import { auth } from '@/lib/auth'
import { cn } from '@/utils/cn'

import { Avatar } from '@/components/global/avatar'
import { SpeechBubble } from '@/components/global/speech-bubble'
import { SpeechBubbleSkeletonLoader } from '@/components/global/speech-bubble-skeleton-loader'

export async function generateMetadata({ params }: { params: { id: string } }) {
  const [message] = await getMessagesWithThread(params.id)

  if (!message) return

  const title = message.body.match('^.*?[.!?](?=s[A-Z]|s?$)(?!.*)')

  return { title }
}

export default async function Page({ params }: { params: { id: string } }) {
  const user = await auth()
  const messages = await getMessagesWithThread(params.id)

  if (!user) return

  return (
    <ul className="flex flex-col gap-8">
      {messages.map(message => {
        const fromMe = message.senderId === user.userId

        return (
          <li key={message.messageId} className={cn('w-1/2', fromMe ? 'self-end' : 'self-start')}>
            <Suspense
              fallback={<SpeechBubbleSkeletonLoader avatar={<Avatar userId={user.userId} />} />}>
              <SpeechBubble
                avatar={<Avatar userId={user.userId} />}
                className={cn(fromMe ? 'fg-app-fg-inverted bg-app-bg-inverted' : 'bg-keyline/80')}>
                {message.body}
              </SpeechBubble>
            </Suspense>
          </li>
        )
      })}
    </ul>
  )
}
