// @ts-nocheck
import { eq } from 'drizzle-orm'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { message } from '@/lib/schema'
import { cn } from '@/utils/cn'

import { Icon, Props } from '@/components/global/icon'

export async function Avatar({
  showAlerts = true,
  size = 20,
  ...rest
}: {
  showAlerts?: boolean
} & Omit<Props, 'name'>) {
  const user = await auth()

  if (!user) return <Icon name="user" {...rest} />

  const messages = await db
    .select()
    .from(systemToUserMessage)
    .where(eq(systemToUserMessage.user_id, user.userId))

  const unreadMessages = messages.filter(message => !message.read)

  return (
    <div className={cn('relative', `h-[${size}] w-[${size}]`)}>
      {showAlerts && unreadMessages.length ? (
        <span className="absolute right-0 top-0 inline-block h-2 w-2 rounded-[50%] bg-gr33n-100">
          {unreadMessages.length}
        </span>
      ) : null}

      <Icon name="user" size={size} {...rest} />
    </div>
  )
}
