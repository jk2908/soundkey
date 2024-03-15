'use server'

import { createMessage } from '@/actions/message/db'

import { error, success } from '@/lib/db'
import { ServerResponse } from '@/lib/types'

import { getUsersWithEmail } from '../user/db'

export async function send(
  senderId: string,
  threadId: string | undefined,
  recipients: string[],
  prevState: ServerResponse,
  formData: FormData
): Promise<ServerResponse> {
  try {
    const body = formData.get('body') as string
    const users = await getUsersWithEmail(recipients)

    if (!users || !users.length) return error(400, 'No recipients found')

    const { threadId: resolvedThreadId } = await createMessage({
      threadId,
      body,
      createdAt: Date.now(),
      senderId,
      recipientIds: users.map(u => u.userId),
      type: 'message',
    })

    return success(201, 'Message sent', { payload: resolvedThreadId })
  } catch (err) {
    return error(500, err instanceof Error ? err.message : 'An unknown error occurred')
  }
}
