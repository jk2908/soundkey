'use server'

import { desc, eq, sql } from 'drizzle-orm'

import { db } from '@/lib/db'
import { message, thread, threadToUser } from '@/lib/schema'
import type { EditMessage, NewMessage } from '@/lib/schema'
import type { ServerResponse } from '@/lib/types'
import { capitalise } from '@/utils/capitalise'
import { nanoid } from '@/utils/nanoid'

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
    console.log(err)
    throw err
  }
}

export async function sendMessage(payload: NewMessage) {
  try {
    const { id: messageId = nanoid(), recipientIds, threadId } = payload

    if (!recipientIds) throw new Error('No recipient specified')

    const resolvedThreadId = await resolveThread(threadId, recipientIds, messageId)

    if (!resolvedThreadId) throw new Error('Could not resolve thread')

    await db.insert(message).values({
      ...(payload as NewMessage),
      threadId: resolvedThreadId,
    })

    return {
      type: 'success',
      message: 'Message sent',
      status: 201,
    } satisfies ServerResponse
  } catch (err) {
    console.log(err)
    return {
      type: 'error',
      message: err instanceof Error ? capitalise(err?.message) : 'An unknown error occurred',
      status: 500,
    } satisfies ServerResponse
  }
}

export async function editMessage(payload: EditMessage & { messageId: string }) {
  try {
    const { messageId, body } = payload

    await db
      .update(message)
      .set({ body, updatedAt: new Date().toISOString() })
      .where(eq(message.id, messageId))

    return {
      type: 'success',
      message: 'Message edited',
      status: 200,
    } satisfies ServerResponse
  } catch (err) {
    console.log(err)
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
    return []
  }
}

export async function getThread(threadId: string) {
  try {
    const [t] = await db.select().from(thread).where(eq(thread.id, threadId))

    if (!t) return null

    return t
  } catch (err) {
    return null
  }
}

export async function getMessagesByUser(userId: string) {
  try {
    const threads = await getThreads(userId)

    if (!threads.length) return []

    const messages = await db
      .select({
        messageId: message.id,
        threadId: message.threadId,
        senderId: message.senderId,
        recipientIds: message.recipientIds,
        body: message.body,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        read: message.read,
        type: message.type,
      })
      .from(message)
      .where(sql`thread_id IN (${threads.map(thread => thread.threadId)})`)
      .orderBy(desc(message.createdAt))

    return messages
  } catch (err) {
    return []
  }
}

export async function getMessagesByThread(threadId: string) {
  try {
    const messages = await db
      .select({
        messageId: message.id,
        threadId: message.threadId,
        senderId: message.senderId,
        recipientIds: message.recipientIds,
        body: message.body,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        read: message.read,
        type: message.type,
      })
      .from(message)
      .where(eq(message.threadId, threadId))
      .orderBy(desc(message.createdAt))

    return messages
  } catch (err) {
    return []
  }
}

export async function getMessage(messageId: string) {
  try {
    const [m] = await db.select().from(message).where(eq(message.id, messageId))

    if (!m) return null

    return m
  } catch (err) {
    return null
  }
}

export async function markMessageAsRead(messageId: string) {
  try {
    await db.update(message).set({ read: true }).where(eq(message.id, messageId))

    return {
      type: 'success',
      message: 'Message marked as read',
      status: 200,
    } satisfies ServerResponse
  } catch (err) {
    return {
      type: 'error',
      message: err instanceof Error ? capitalise(err?.message) : 'An unknown error occurred',
      status: 500,
    } satisfies ServerResponse
  }
}
