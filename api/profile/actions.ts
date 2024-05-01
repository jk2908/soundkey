'use server'

import { revalidateTag } from 'next/cache'
import { updateProfile } from '#/api/profile/utils'

import { error, success } from '#/lib/db'
import { ServerResponse } from '#/lib/types'
import { generateId } from '#/utils/generate-id'

export async function update(
  userId: string,
  prevState: ServerResponse,
  formData: FormData
): Promise<ServerResponse> {
  try {
    const bio = formData.get('bio') as string

    await updateProfile({ userId, bio })
    revalidateTag('profile')

    return success(200, 'Profile updated', { key: generateId() })
  } catch (err) {
    return error(500, err instanceof Error ? err.message : 'An unknown error occurred')
  }
}
