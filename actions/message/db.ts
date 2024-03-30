import 'server-only'

import { revalidateTag, unstable_cache } from 'next/cache'
import { deleteThread, resolveThread } from '@/actions/thread/db'
import { asc, eq, inArray, or } from 'drizzle-orm'

import { db } from '@/lib/db'
import { messageTable, userTable } from '@/lib/schema'
import type { EditMessage, NewMessage, Thread } from '@/lib/schema'

export async function createMessage(payload: NewMessage) {
  try {
    const { senderId, recipientIds, threadId } = payload

    if (!recipientIds) throw new Error('No recipients provided')

    const resolvedThreadId = await resolveThread({ threadId, senderId, recipientIds })

    if (!resolvedThreadId) throw new Error('Could not resolve thread')

    const [createdMessage] = await db
      .insert(messageTable)
      .values({
        ...(payload as NewMessage),
        threadId: resolvedThreadId,
        recipientIds: recipientIds.join(','),
      })
      .returning({ messageId: messageTable.id, threadId: messageTable.threadId })

    revalidateTag('messages')

    return createdMessage
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function editMessage(payload: EditMessage & { messageId: string }) {
  try {
    const { messageId, body } = payload

    await db
      .update(messageTable)
      .set({ body, updatedAt: Date.now() })
      .where(eq(messageTable.id, messageId))

    return messageId
  } catch (err) {
    console.error(err)
  }
}

export async function deleteMessage(messageId: string) {
  try {
    const [message] = await db.select().from(messageTable).where(eq(messageTable.id, messageId))

    if (!message) throw new Error('Message not found')

    const messages = await db
      .select()
      .from(messageTable)
      .where(eq(messageTable.threadId, message.threadId))
    await db.delete(messageTable).where(eq(messageTable.id, messageId))

    if (messages.length === 1) {
      await deleteThread(message.threadId)
    }

    revalidateTag('messages')
  } catch (err) {
    console.error(err)
  }
}

export const getMessages = unstable_cache(
  async (threadId: string) => {
    try {
      const messages = await db
        .select({
          messageId: messageTable.id,
          threadId: messageTable.threadId,
          senderId: messageTable.senderId,
          recipientIds: messageTable.recipientIds,
          body: messageTable.body,
          createdAt: messageTable.createdAt,
          updatedAt: messageTable.updatedAt,
          read: messageTable.read,
          type: messageTable.type,
        })
        .from(messageTable)
        .where(eq(messageTable.threadId, threadId))
        .orderBy(asc(messageTable.createdAt))

      return messages
    } catch (err) {
      return []
    }
  },
  ['messages'],
  { tags: ['messages'] }
)

export async function getMessage(messageId: string) {
  try {
    const [message] = await db.select().from(messageTable).where(eq(messageTable.id, messageId))

    if (!message) return null

    return message
  } catch (err) {
    return null
  }
}

export async function resolveMessageRecipient(str: string) {
  try {
    const [recipient] = await db
      .select({ userId: userTable.id, email: userTable.email, username: userTable.username })
      .from(userTable)
      .where(or(eq(userTable.email, str.toLowerCase()), eq(userTable.username, str)))

    return recipient
  } catch (err) {
    return null
  }
}

export async function resolveMessageRecipients(recipientIds: string[]) {
  try {
    const recipients = await db
      .select({ userId: userTable.id, email: userTable.email, username: userTable.username })
      .from(userTable)
      .where(inArray(userTable.id, recipientIds))

    return recipients
  } catch (err) {
    return []
  }
}
