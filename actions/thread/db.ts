import { revalidateTag, unstable_cache } from 'next/cache'
import { desc, eq } from 'drizzle-orm'

import { db } from '@/lib/db'
import { threadTable, threadToUserTable } from '@/lib/schema'
import type { Thread } from '@/lib/schema'

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
        userIds: [senderId, ...recipientIds].join(','),
      })
      .returning({ id: threadTable.id })

    await db.insert(threadToUserTable).values(
      [...new Set([senderId, ...recipientIds])].map(userId => ({
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
    console.log(senderId, recipientIds)
    if (!threadId) return await createThread({ senderId, recipientIds })

    const [existingThread] = await db.select().from(threadTable).where(eq(threadTable.id, threadId))

    if (!existingThread) throw new Error('Could not find thread')

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

export const getThreads = unstable_cache(
  async (userId: string) => {
    try {
      const threads = (await db
        .select({
          threadId: threadToUserTable.threadId,
          createdAt: threadTable.createdAt,
          updatedAt: threadTable.updatedAt,
          userIds: threadTable.userIds,
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