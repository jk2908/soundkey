import 'server-only'

import { cache } from 'react'
import { revalidateTag, unstable_cache } from 'next/cache'
import { getUsers } from '#/api/user/utils'
import { desc, eq } from 'drizzle-orm'

import { db } from '#/lib/db'
import { messageTable, threadTable, threadToUserTable } from '#/lib/schema'
import type { Thread } from '#/lib/schema'

export async function createThread({
  senderId,
  recipientIds,
}: {
  senderId: string
  recipientIds: string[]
}) {
  try {
    const [newThread] = await db
      .insert(threadTable)
      .values({
        createdAt: Date.now(),
        ownerId: senderId,
        userIds: [...new Set([senderId, ...recipientIds])].join(','),
      })
      .returning({ id: threadTable.id })

    await db.insert(threadToUserTable).values(
      [...new Set([senderId, ...recipientIds])].map(userId => ({
        threadId: newThread.id,
        userId,
      }))
    )

    revalidateTag('thread')

    return newThread.id
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function resolveThread({
  threadId,
  senderId,
  recipientIds,
}: {
  threadId?: string
  senderId: string
  recipientIds: string[]
}) {
  try {
    if (threadId) {
      const [existingThread] = await db
        .select()
        .from(threadTable)
        .where(eq(threadTable.id, threadId))

      if (!existingThread) throw new Error('Could not find thread')

      await db
        .update(threadTable)
        .set({ updatedAt: Date.now() })
        .where(eq(threadTable.id, existingThread.id))

      return existingThread.id
    }

    const [existingThread] = await db
      .select()
      .from(threadTable)
      .where(eq(threadTable.userIds, [...new Set([senderId, ...recipientIds])].join(',')))

    if (existingThread) {
      await db
        .update(threadTable)
        .set({ updatedAt: Date.now() })
        .where(eq(threadTable.id, existingThread.id))

      return existingThread.id
    }

    return await createThread({ senderId, recipientIds })
  } catch (err) {
    console.log(err)
    throw err
  }
}

export const getThreads = unstable_cache(
  async (userId: string) => {
    try {
      const threads = (await db
        .select({
          threadId: threadToUserTable.threadId,
          createdAt: threadTable.createdAt,
          updatedAt: threadTable.updatedAt,
          userIds: threadTable.userIds,
          ownerId: threadTable.ownerId,
        })
        .from(threadToUserTable)
        .leftJoin(threadTable, eq(threadTable.id, threadToUserTable.threadId))
        .where(eq(threadToUserTable.userId, userId))
        .orderBy(desc(threadTable.updatedAt || threadTable.createdAt))) as Thread[]

      if (!threads.length) return []

      return threads
    } catch (err) {
      return []
    }
  },
  ['thread'],
  { tags: ['thread'] }
)

export const getThread = cache(async (threadId: string) => {
  try {
    const [thread] = await db.select().from(threadTable).where(eq(threadTable.id, threadId))

    if (!thread) return null

    return { ...thread, threadId: thread.id }
  } catch (err) {
    console.error(err)
    return null
  }
})

export async function deleteThread(threadId: string) {
  try {
    await db.delete(threadToUserTable).where(eq(threadToUserTable.threadId, threadId))
    await db.delete(threadTable).where(eq(threadTable.id, threadId))
    await db.delete(messageTable).where(eq(messageTable.threadId, threadId))

    revalidateTag('thread')
    revalidateTag('message')
  } catch (err) {
    console.error(err)
  }
}

export const resolveThreadUsers = cache(async (threadId: string) => {
  try {
    const thread = await getThread(threadId)

    if (!thread) return []

    const userIds = thread.userIds.split(',')
    const users = await getUsers(userIds)

    return users
  } catch (err) {
    console.error(err)
    return []
  }
})
