'use server'

import { revalidateTag, unstable_cache } from 'next/cache'
import { desc, eq, sql } from 'drizzle-orm'

import { db } from '@/lib/db'
import { messageTable, threadTable, threadToUserTable } from '@/lib/schema'
import type { EditMessage, NewMessage } from '@/lib/schema'
import type { ServerResponse } from '@/lib/types'
import { capitalise } from '@/utils/capitalise'
import { generateId } from '@/utils/generate-id'

export async function createThread(userIds: string[], messageId: string) {
  try {
    const [newThread] = await db
      .insert(threadTable)
      .values({
        createdAt: Date.now(),
      })
      .returning({ id: threadTable.id })

    await db.insert(threadToUserTable).values(
      userIds.map(userId => ({
        threadId: newThread.id,
        userId,
      }))
    )

    revalidateTag('threads')

    return newThread.id
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function resolveThread(
  threadId: string | undefined,
  userIds: string[],
  messageId: string
) {
  try {
    if (!threadId) {
      return await createThread(userIds, messageId)
    }

    const [existingThread] = await db.select().from(threadTable).where(eq(threadTable.id, threadId))

    if (!existingThread) {
      throw new Error('Could not find thread')
    }

    await db
      .update(threadTable)
      .set({ updatedAt: Date.now() })
      .where(eq(threadTable.id, existingThread.id))

    return existingThread.id
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function createMessage(payload: NewMessage) {
  try {
    const { id: messageId = generateId(), recipientIds, threadId } = payload

    if (!recipientIds) throw new Error('No recipients provided')

    const resolvedThreadId = await resolveThread(threadId, recipientIds, messageId)

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

export async function updateMessage(payload: EditMessage & { messageId: string }) {
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

export const getThreads = unstable_cache(
  async (userId: string) => {
    try {
      const threads = await db
        .select({
          threadId: threadToUserTable.threadId,
          createdAt: threadTable.createdAt,
          updatedAt: threadTable.updatedAt,
        })
        .from(threadToUserTable)
        .leftJoin(threadTable, eq(threadTable.id, threadToUserTable.threadId))
        .where(eq(threadToUserTable.userId, userId))

      if (!threads.length) return []

      return threads
    } catch (err) {
      return []
    }
  },
  ['threads'],
  { tags: ['threads'] }
)

export async function getThread(threadId: string) {
  try {
    const [t] = await db.select().from(threadTable).where(eq(threadTable.id, threadId))

    if (!t) return null

    return t
  } catch (err) {
    console.error(err)
    return null
  }
}

export const getMessagesWithUser = unstable_cache(
  async (userId: string) => {
    try {
      const threads = await getThreads(userId)

      if (!threads.length) return []

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
        .where(sql`thread_id IN (${threads.map(thread => thread.threadId)})`)
        .orderBy(desc(messageTable.createdAt))

      return messages
    } catch (err) {
      return []
    }
  },
  ['messages'],
  { tags: ['messages'] }
)

export const getMessagesWithThread = unstable_cache(
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
        .orderBy(desc(messageTable.createdAt))

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
