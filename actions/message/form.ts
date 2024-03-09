'use server'

import { createMessage } from '@/actions/message/db'

import { error, success } from '@/lib/db'
import { ServerResponse } from '@/lib/types'

export async function send(
  senderId: string,
  threadId: string | undefined,
  recipients: string[],
  prevState: ServerResponse,
  formData: FormData
): Promise<ServerResponse> {
  try {
    const body = formData.get('body') as string

    await createMessage({
      threadId,
      body,
      createdAt: Date.now(),
      senderId,
      recipientIds: recipients.split(','),
      type: 'message',
    })

    return success(201, 'Message sent')
  } catch (err) {
    return error(500, err instanceof Error ? err.message : 'An unknown error occurred')
  }
}
