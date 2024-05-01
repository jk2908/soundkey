import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getMessages } from '#/api/message/utils'
import { getThread, resolveThreadUsers } from '#/api/thread/utils'

import { auth } from '#/lib/auth'
import { cn } from '#/utils/cn'

import * as EditableMessage from '#/components/authenticated/message/editable-message'
import { MessageActionsMenu } from '#/components/authenticated/message/message-actions-menu'
import { MessageList } from '#/components/authenticated/message/message-list'
import { SendMessageForm } from '#/components/authenticated/message/send-message-form'
import { Avatar, type Props as AvatarProps } from '#/components/global/avatar'
import { Icon } from '#/components/global/icon'
import { MotionDiv } from '#/components/global/motion-div'
import { SpeechBubble } from '#/components/global/speech-bubble'
import { SpeechBubbleSkeletonLoader } from '#/components/global/speech-bubble-skeleton-loader'
import { YSpace } from '#/components/global/y-space'

export async function generateMetadata({ params }: { params: { id: string } }) {
  const user = await auth()
  const users = await resolveThreadUsers(params.id)

  if (users.length === 1 && users[0].userId === user?.userId) {
    return { title: 'With yourself' }
  }

  return { title: `With ${users.map(u => u.username).join(', ')}` }
}

export default async function Page({ params }: { params: { id: string } }) {
  const user = await auth()
  const thread = await getThread(params.id)
  const messages = await getMessages(params.id)

  if (!user) redirect('/login')

  if (!thread || !messages)
    return (
      <div className="flex items-start gap-4">
        <Icon name="inbox" size={20} />
        <p>
          The thread is gone.{' '}
          <Link href="/dashboard" className="body-link">
            Return to dashboard
          </Link>{' '}
          or{' '}
          <Link href="/threads/new" className="body-link">
            start a new one.
          </Link>
          .
        </p>
      </div>
    )

  const recipientIds = thread.userIds.split(',').map(userId => ({ userId, label: userId }))

  const avatarProps = {
    userId: user.userId,
    username: user.username,
    size: 24,
  } satisfies AvatarProps

  return (
    <YSpace className="flex grow flex-col">
      <MessageList>
        {messages.map(message => {
          const fromMe = message.senderId === user.userId
          const placement = fromMe ? 'right' : 'left'

          return (
            <Suspense
              key={message.messageId}
              fallback={
                <SpeechBubbleSkeletonLoader
                  placement={placement}
                  className={cn(
                    fromMe ? 'fg-app-fg-inverted bg-app-bg-inverted' : 'bg-keyline/80 text-app-fg'
                  )}
                  avatar={<Avatar {...avatarProps} />}
                />
              }>
              <MotionDiv
                layout
                className={cn(
                  'flex w-4/5 flex-col gap-2 xs:w-3/4 sm:w-1/2',
                  fromMe ? 'self-end' : 'self-start'
                )}>
                <EditableMessage.Root messageId={message.messageId}>
                  {fromMe && <MessageActionsMenu messageId={message.messageId} />}

                  <SpeechBubble
                    avatar={<Avatar {...avatarProps} />}
                    placement={placement}
                    className={cn(
                      'flex flex-col gap-2',
                      fromMe ? 'fg-app-fg-inverted bg-app-bg-inverted' : 'bg-keyline/80 text-app-fg'
                    )}>
                    <EditableMessage.Text className="sk-focus" style={{ outlineOffset: '8px' }}>
                      <>{message.body}</>
                    </EditableMessage.Text>

                    <div className="border-t border-keyline/25 pt-2 font-mono">
                      {message?.updatedAt ? (
                        <span className="text-xs">
                          Edited {new Date(message.updatedAt).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-xs">
                          Created {new Date(message.createdAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </SpeechBubble>
                </EditableMessage.Root>
              </MotionDiv>
            </Suspense>
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
