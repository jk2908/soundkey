'use server'

import { desc, eq, sql } from 'drizzle-orm'

import { db } from '@/lib/db'
import { message, systemMessage, thread, threadToUser } from '@/lib/schema'
import type { NewMessage, NewSystemMessage } from '@/lib/schema'
import type { ServerResponse } from '@/lib/types'
import { buildMessage } from '@/utils/build-message'
import { capitalise } from '@/utils/capitalise'

export async function createThread(userIds: string[], messageId: string) {
  try {
    const [newThread] = await db
      .insert(thread)
      .values({
        messageId: [messageId],
        createdAt: new Date().toISOString(),
      })
      .returning({ id: thread.id })

    await db.insert(threadToUser).values(
      userIds.map(userId => ({
        threadId: newThread.id,
        userId,
      }))
    )

    return newThread.id
  } catch (err) {
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

    const [existingThread] = await db.select().from(thread).where(eq(thread.id, threadId))

    if (!existingThread) {
      throw new Error('Could not find thread')
    }

    await db
      .update(thread)
      .set({ messageId: sql`message_id || ${messageId}`, updatedAt: new Date().toISOString() })
      .where(eq(thread.id, existingThread.id))

    return existingThread.id
  } catch (err) {
    throw err
  }
}

export async function sendMessage(newMessage: NewMessage, threadId?: string) {
  try {
    const { id: messageId, toUserId } = newMessage

    if (!toUserId || !messageId) return

    const resolvedThreadId = await resolveThread(threadId, toUserId, messageId)

    if (!resolvedThreadId) return

    await db.insert(message).values({
      ...newMessage,
      threadId: resolvedThreadId,
    })

    return {
      type: 'success',
      message: 'Message sent',
      status: 201,
    } satisfies ServerResponse
  } catch (err) {
    return {
      type: 'error',
      message: err instanceof Error ? capitalise(err?.message) : 'An unknown error occurred',
      status: 500,
    } satisfies ServerResponse
  }
}

export async function sendSystemMessage(newSystemMessage: NewSystemMessage, threadId?: string) {
  try {
    const { id: messageId, toUserId } = newSystemMessage

    if (!toUserId || !messageId) return

    const resolvedThreadId = await resolveThread(threadId, toUserId, messageId)

    if (!resolvedThreadId) return

    await db.insert(systemMessage).values({
      ...newSystemMessage,
      threadId: resolvedThreadId,
      fromUserId: 'system',
    })

    return {
      type: 'success',
      message: 'Message sent',
      status: 201,
    } satisfies ServerResponse
  } catch (err) {
    return {
      type: 'error',
      message: err instanceof Error ? capitalise(err?.message) : 'An unknown error occurred',
      status: 500,
    } satisfies ServerResponse
  }
}

export async function getThreads(userId: string) {
  try {
    const threads = await db
      .select({
        threadId: threadToUser.threadId,
        createdAt: thread.createdAt,
        updatedAt: thread.updatedAt,
      })
      .from(threadToUser)
      .leftJoin(thread, eq(thread.id, threadToUser.threadId))
      .where(eq(threadToUser.userId, userId))

    if (!threads.length) return []

    return threads
  } catch (err) {
    console.error(err)
    return []
  }
}

export async function getThread(threadId: string) {
  try {
    const [t] = await db.select().from(thread).where(eq(thread.id, threadId))

    if (!t) return null

    return t
  } catch (err) {
    console.error(err)
    return null
  }
}

export async function getMessagesByUser(userId: string) {
  try {
    const threads = await getThreads(userId)

    if (!threads.length) return []

    const messages = await db
      .select({ ...buildMessage('message') })
      .from(message)
      .where(sql`thread_id IN (${threads.map(thread => thread.threadId)})`)
      .unionAll(
        db
          .select({
            ...buildMessage('system'),
          })
          .from(systemMessage)
          .where(sql`thread_id IN (${threads.map(thread => thread.threadId)})`)
          .orderBy(desc(systemMessage.createdAt))
      )
      .orderBy(desc(message.createdAt))

    return messages
  } catch (err) {
    console.error(err)
    return []
  }
}

export async function getMessagesByThread(threadId: string) {
  try {
    const messages = await db
      .select({
        ...buildMessage('message'),
      })
      .from(message)
      .where(eq(message.threadId, threadId))
      .unionAll(
        db
          .select({
            ...buildMessage('system'),
          })
          .from(systemMessage)
          .where(eq(systemMessage.threadId, threadId))
          .orderBy(desc(systemMessage.createdAt))
      )
      .orderBy(desc(message.createdAt))

    return messages
  } catch (err) {
    console.error(err)
    return []
  }
}

export async function getMessage(messageId: string) {
  try {
    const [m] = await db.select().from(message).where(eq(message.id, messageId))

    if (!m) return null

    return m
  } catch (err) {
    console.error(err)
    return null
  }
}
