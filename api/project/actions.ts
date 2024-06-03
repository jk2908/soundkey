'use server'

import { createProject } from '#/api/project/utils'

import { type ActionResponse } from '#/lib/types'
import { error, success } from '#/utils/action-response'
import { isValidEmail } from '#/utils/is-valid-email'

export async function create(userId: string, prevState: ActionResponse | null, formData: FormData) {
  try {
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const coordinatorName = formData.get('coordinator-name') as string
    const coordinatorEmail = formData.get('coordinator-email') as string
    const coordinatorPhone = formData.get('coordinator-phone') as string
    const artist = formData.get('artist') as string
    const management = formData.get('management') as string
    const label = formData.get('label') as string

    if (!name || !coordinatorName || !coordinatorEmail || !artist) {
      return error(400, 'Missing required fields')
    }

    if (!isValidEmail(coordinatorEmail)) {
      return error(400, 'Invalid coordinator email')
    }

    const { projectId } = await createProject({
      userId,
      name,
      description,
      coordinatorName,
      coordinatorEmail,
      coordinatorPhone,
      artist,
      management,
      label,
    })

    return success(201, 'Project created', { payload: projectId })
  } catch (err) {
    return error(500, err instanceof Error ? err.message : 'An unknown error occurred')
  }
}
