import { unstable_cache } from 'next/cache'
import { getUser } from '@/actions/user'
import { eq } from 'drizzle-orm'

import { db } from '@/lib/db'
import { Profile, profileTable } from '@/lib/schema'
import { ServerResponse } from '@/lib/types'
import { capitalise } from '@/utils/capitalise'

export const getProfile = unstable_cache(
  async (userId: string) => {
    try {
      const [profile] = await db
        .select({ username: profileTable.username })
        .from(profileTable)
        .where(eq(profileTable.id, userId))
        .limit(1)

      if (!profile) return {
        username: null
      } satisfies Profile

      return profile
    } catch (err) {
      console.log(err)
      throw err
    }
  },
  ['profile'],
  { tags: ['profile'] }
)

export async function updateProfile(
  userId: string,
  prevState: ServerResponse,
  formData: FormData
): Promise<ServerResponse> {
  try {
    const username = formData.get('username') as string

    if (typeof username !== 'string' || username.length < 3 || username.length > 255) {
      return {
        type: 'error',
        message: 'Invalid username',
        status: 400,
      }
    }

    const [usernameTaken] = await db
      .select()
      .from(profileTable)
      .where(eq(profileTable.username, username.toLowerCase()))

    if (usernameTaken) {
      return {
        type: 'error',
        message: 'Username already in use',
        status: 400,
      }
    }

    await db.update(profileTable).set({ username }).where(eq(profileTable.id, userId))

    return {
      type: 'success',
      message: 'Profile updated',
      status: 200,
    }
  } catch (err) {
    return {
      type: 'error',
      message: err instanceof Error ? capitalise(err?.message) : 'An unknown error occurred',
      status: 500,
    }
  }
}
