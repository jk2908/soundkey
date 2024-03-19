import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getMessages } from '@/actions/message/db'
import { getThread } from '@/actions/thread/db'

import { auth } from '@/lib/auth'
import { cn } from '@/utils/cn'

import { SendMessageForm } from '@/components/authenticated/send-message-form'
import { Avatar } from '@/components/global/avatar'
import { Icon } from '@/components/global/icon'
import { SpeechBubble } from '@/components/global/speech-bubble'
import { SpeechBubbleSkeletonLoader } from '@/components/global/speech-bubble-skeleton-loader'
import { YSpace } from '@/components/global/y-space'

export async function generateMetadata({ params }: { params: { id: string } }) {
  const [message] = await getMessages(params.id)

  if (!message) return

  const title = message.body.match('^.*?[.!?](?=s[A-Z]|s?$)(?!.*)')

  return { title }
}

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { [key: string]: string | undefined }
}) {
  const user = await auth()
  const thread = await getThread(params.id)
  const messages = await getMessages(params.id)

  if (!user) redirect('/login')

  if (!thread || !messages)
    return (
      <div className="flex items-center gap-4">
        <Icon name="inbox" size={20} />
        <p className="font-mono">
          Error locating thread.{' '}
          <Link href="/dashboard" className="body-link">
            Return to dashboard
          </Link>
          .
        </p>
      </div>
    )

  const recipientIds = thread.userIds
    .split(',')
    .filter(userId => userId !== user.userId)
    .map(userId => ({ userId, label: userId }))

  return (
    <YSpace>
      <ul className="flex flex-col gap-8">
        {messages.map(message => {
          const fromMe = message.senderId === user.userId
          const placement = fromMe ? 'right' : 'left'

          return (
            <li
              key={message.messageId}
              className={cn('w-4/5 xs:w-3/4 sm:w-1/2', fromMe ? 'self-end' : 'self-start')}>
              <Suspense
                fallback={
                  <SpeechBubbleSkeletonLoader
                    placement={placement}
                    avatar={<Avatar userId={user.userId} />}
                  />
                }>
                <SpeechBubble
                  avatar={<Avatar userId={user.userId} />}
                  placement={placement}
                  className={cn(
                    fromMe ? 'fg-app-fg-inverted bg-app-bg-inverted' : 'bg-keyline/80 text-app-fg'
                  )}>
                  {message.body}
                </SpeechBubble>
              </Suspense>
            </li>
          )
        })}
      </ul>

      <SendMessageForm
        senderId={user.userId}
        threadId={params.id}
        resolvedRecipients={recipientIds}
      />
    </YSpace>
  )
}
