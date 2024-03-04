'use server'

import { unstable_cache } from 'next/cache'
import { eq } from 'drizzle-orm'

import { db } from '@/lib/db'
import { profileTable } from '@/lib/schema'

export const createProfile = async (userId: string) => {
  try {
    await db.insert(profileTable).values({
      userId,
    })
  } catch (err) {
    console.log(err)
    throw err
  }
}

export const getProfile = unstable_cache(
  async (userId: string) => {
    try {
      const [profile] = await db
        .select()
        .from(profileTable)
        .where(eq(profileTable.userId, userId))
        .limit(1)

      const { id, ...rest } = profile

      return rest
    } catch (err) {
      console.log(err)
      throw err
    }
  },
  ['profile'],
  { tags: ['profile'] }
)
