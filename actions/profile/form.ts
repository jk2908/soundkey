'use server'

import { revalidateTag } from 'next/cache'
import { and, eq, ne, or } from 'drizzle-orm'

import { db, error, success } from '@/lib/db'
import { profileTable } from '@/lib/schema'
import { ServerResponse } from '@/lib/types'
import { generateId } from '@/utils/generate-id'

export async function update(
  userId: string,
  prevState: ServerResponse,
  formData: FormData
): Promise<ServerResponse> {
  try {
    const username = formData.get('username') as string
    const bio = formData.get('bio') as string

    if (typeof username !== 'string' || username.length < 3 || username.length > 255) {
      return error({ message: 'Invalid username', status: 400 })
    }

    if (typeof bio !== 'string' || bio.length > 255) {
      return error({ message: 'Bio must be less than 255 characters', status: 400 })
    }

    await db
      .update(profileTable)
      .set({
        username,
        bio,
      })
      .where(
        and(
          eq(profileTable.userId, userId),
          or(ne(profileTable.username, username), ne(profileTable.bio, bio))
        )
      )

    revalidateTag('profile')

    return success({ message: 'Profile updated', status: 200, key: generateId() })
  } catch (err) {
    return error(err as Error)
  }
}
