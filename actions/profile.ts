'use server'

import { revalidateTag, unstable_cache } from 'next/cache'
import { and, eq, ne, or } from 'drizzle-orm'

import { db } from '@/lib/db'
import { profileTable } from '@/lib/schema'
import { ServerResponse } from '@/lib/types'
import { capitalise } from '@/utils/capitalise'
import { generateId } from '@/utils/generate-id'

export const createProfile = async (userId: string) => {
  try {
    await db.insert(profileTable).values({
      userId,
      username: '',
      bio: '',
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

export async function updateProfile(
  userId: string,
  prevState: ServerResponse,
  formData: FormData
): Promise<ServerResponse> {
  try {
    const username = formData.get('username') as string
    const bio = formData.get('bio') as string

    if (typeof username !== 'string' || username.length < 3 || username.length > 255) {
      return {
        type: 'error',
        message: 'Invalid username',
        status: 400,
      }
    }

    if (typeof bio !== 'string' || bio.length > 255) {
      return {
        type: 'error',
        message: 'Bio must be less than 255 characters',
        status: 400,
      }
    }

    await db
      .update(profileTable)
      .set({
        username, bio
      })
      .where(
        and(
          eq(profileTable.userId, userId),
          or(ne(profileTable.username, username), ne(profileTable.bio, bio))
        )
      )

    revalidateTag('profile')

    return {
      type: 'success',
      message: 'Profile updated',
      status: 200,
      key: generateId(),
    }
  } catch (err) {
    return {
      type: 'error',
      message: err instanceof Error ? capitalise(err?.message) : 'An unknown error occurred',
      status: 500,
    }
  }
}
