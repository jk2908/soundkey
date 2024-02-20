'use server'

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

export async function createMessage(payload: NewMessage): Promise<ServerResponse> {
  try {
    const { id: messageId = generateId(), recipientIds, threadId } = payload

    if (!recipientIds) return { type: 'error', message: 'No recipient specified', status: 400 }

    const resolvedThreadId = await resolveThread(threadId, recipientIds, messageId)

    if (!resolvedThreadId) {
      return { type: 'error', message: 'Could not resolve thread', status: 500 }
    }

    await db.insert(messageTable).values({
      ...(payload as NewMessage),
      threadId: resolvedThreadId,
      recipientIds: recipientIds.join(','),
    })

    return {
      type: 'success',
      message: 'Message sent',
      status: 201,
    }
  } catch (err) {
    console.log(err)
    return {
      type: 'error',
      message: err instanceof Error ? capitalise(err?.message) : 'An unknown error occurred',
      status: 500,
    }
  }
}

export async function updateMessage(
  payload: EditMessage & { messageId: string }
): Promise<ServerResponse> {
  try {
    const { messageId, body } = payload

    await db
      .update(messageTable)
      .set({ body, updatedAt: Date.now() })
      .where(eq(messageTable.id, messageId))

    return {
      type: 'success',
      message: 'Message edited',
      status: 200,
    }
  } catch (err) {
    console.log(err)
    return {
      type: 'error',
      message: err instanceof Error ? capitalise(err?.message) : 'An unknown error occurred',
      status: 500,
    }
  }
}

export async function getThreads(userId: string) {
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
}

export async function getThread(threadId: string) {
  try {
    const [t] = await db.select().from(threadTable).where(eq(threadTable.id, threadId))

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
}

export async function getMessagesByThread(threadId: string) {
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
}

export async function getMessage(messageId: string) {
  try {
    const [message] = await db.select().from(messageTable).where(eq(messageTable.id, messageId))

    if (!message) return null

    return message
  } catch (err) {
    return null
  }
}
