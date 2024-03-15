'use server'

import { revalidateTag } from 'next/cache'
import { updateProfile } from '@/actions/profile/db'

import { error, success } from '@/lib/db'
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

    await updateProfile({ userId, username, bio })
    revalidateTag('profile')

    return success(200, 'Profile updated', { key: generateId() })
  } catch (err) {
    return error(500, err instanceof Error ? err.message : 'An unknown error occurred')
  }
}
