'use server'

import { createMessage } from '@/actions/message/handlers'

import { ServerResponse } from '@/lib/types'
import { capitalise } from '@/utils/capitalise'

export async function send(
  senderId: string,
  threadId: string | undefined,
  prevState: ServerResponse,
  formData: FormData
): Promise<ServerResponse> {
  try {
    const recipients = formData.get('recipients') as string
    const body = formData.get('body') as string

    await createMessage({
      threadId,
      body,
      createdAt: Date.now(),
      senderId,
      recipientIds: recipients.split(','),
      type: 'message',
    })

    return {
      type: 'success',
      message: 'Message sent',
      status: 201,
    }
  } catch (err) {
    return {
      type: 'error',
      message: err instanceof Error ? capitalise(err?.message) : 'An unknown error occurred',
      status: 500,
    }
  }
}
