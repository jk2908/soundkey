import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getMessages, resolveMessageRecipients } from '@/actions/message/db'
import { getThread } from '@/actions/thread/db'
import { AnimatePresence, motion } from 'framer-motion'

import { auth } from '@/lib/auth'
import { cn } from '@/utils/cn'

import { MessageActionsMenu } from '@/components/authenticated/message-actions-menu'
import { SendMessageForm } from '@/components/authenticated/send-message-form'
import type { Props as AvatarProps } from '@/components/global/avatar'
import { Avatar } from '@/components/global/avatar'
import { Icon } from '@/components/global/icon'
import { SpeechBubble } from '@/components/global/speech-bubble'
import { SpeechBubbleSkeletonLoader } from '@/components/global/speech-bubble-skeleton-loader'
import { YSpace } from '@/components/global/y-space'
import { MessageList } from '@/components/authenticated/message-list'
import { MessageWrapper } from '@/components/authenticated/message-wrapper'

export async function generateMetadata({ params }: { params: { id: string } }) {
  const [message] = await getMessages(params.id)

  if (!message) return

  const recipients = await resolveMessageRecipients(message.recipientIds.split(','))

  return { title: `With ${recipients.map(r => r.username).join(', ')}` }
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
      <div className="flex items-start gap-4">
        <Icon name="inbox" size={20} />
        <p className="font-mono">
          The thread is gone.{' '}
          <Link href="/dashboard" className="body-link">
            Return to dashboard
          </Link>{' '}
          or{' '}
          <Link href="/threads/new" className="body-link">
            start a new thread
          </Link>
          .
        </p>
      </div>
    )

  const recipientIds = thread.userIds.split(',').map(userId => ({ userId, label: userId }))

  const avatarProps = {
    userId: user.userId,
    username: user.username,
    size: 28,
  } satisfies AvatarProps

  return (
    <YSpace className="flex grow flex-col">
      <MessageList>
        {messages.map(message => {
          const fromMe = message.senderId === user.userId
          const placement = fromMe ? 'right' : 'left'

          return (
            <MessageWrapper
              key={message.messageId}
              className={cn(
                'flex w-4/5 flex-col gap-2 xs:w-3/4 sm:w-1/2',
                fromMe ? 'self-end' : 'self-start'
              )}>
              <MessageActionsMenu messageId={message.messageId} />

              <Suspense
                fallback={
                  <SpeechBubbleSkeletonLoader
                    placement={placement}
                    avatar={<Avatar {...avatarProps} />}
                  />
                }>
                <SpeechBubble
                  avatar={<Avatar {...avatarProps} />}
                  placement={placement}
                  className={cn(
                    fromMe ? 'fg-app-fg-inverted bg-app-bg-inverted' : 'bg-keyline/80 text-app-fg'
                  )}>
                  {message.body}
                </SpeechBubble>
              </Suspense>
            </MessageWrapper>
          )
        })}
      </MessageList>

      <SendMessageForm
        senderId={user.userId}
        threadId={params.id}
        resolvedRecipients={recipientIds}
        className="grow"
      />
    </YSpace>
  )
}
