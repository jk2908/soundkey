import { unstable_cache } from 'next/cache'
import { and, eq, ne, or } from 'drizzle-orm'

import { db } from '@/lib/db'
import { profileTable, type EditProfile } from '@/lib/schema'

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

export async function updateProfile(payload: EditProfile) {
  try {
    const { userId, bio } = payload

    if (typeof bio !== 'string' || bio.length > 255) {
      throw new Error('Bio must be less than 255 characters')
    }

    await db
      .update(profileTable)
      .set({ bio })
      .where(
        and(
          eq(profileTable.userId, userId),
          or(ne(profileTable.bio, bio))
        )
      )
  } catch (err) {
    console.log(err)
    throw err
  }
}
