'use server'

import { eq } from 'drizzle-orm'

import { db, DbError } from '@/lib/db'
import type { NewMessage } from '@/lib/schema'
import { message, thread, threadToUser } from '@/lib/schema'
import type { ServerResponse, ServerResponseWithPayload } from '@/lib/types'
import { capitalise } from '@/utils/capitalise'

export async function createThread(userIds: string[]) {
  try {
    const [newThread] = await db
      .insert(thread)
      .values({
        createdAt: new Date().toISOString(),
      })
      .returning({ id: thread.id })

    await db.insert(threadToUser).values(
      userIds.map(userId => ({
        threadId: newThread.id,
        userId,
      }))
    )

    return {
      type: 'success',
      message: 'Thread created',
      status: 201,
      payload: newThread.id,
    } satisfies ServerResponseWithPayload<string>
  } catch (err) {
    return {
      type: 'error',
      message: capitalise((err as DbError)?.message) ?? 'An unknown error occurred',
      status: 500,
    } satisfies ServerResponse
  }
}

export async function resolveThread(threadId: string | null | undefined, toUserId: string[]) {
  if (!threadId) {
    const { payload } = await createThread(toUserId)

    if (!payload) {
      throw new Error('Missing payload, failed to create thread.')
    }

    return payload
  }

  return threadId
}

export async function sendMessage(newMessage: NewMessage) {
  try {
    const { threadId, toUserId, ...rest } = newMessage
    const resolvedThreadId = await resolveThread(threadId, toUserId!)

    await db.insert(message).values({
      toUserId,
      threadId: resolvedThreadId,
      ...rest,
    })

    return {
      type: 'success',
      message: 'Message sent',
      status: 201,
    } satisfies ServerResponse
  } catch (err) {
    return {
      type: 'error',
      message: capitalise((err as DbError)?.message) ?? 'An unknown error occurred',
      status: 500,
    } satisfies ServerResponse
  }
}
