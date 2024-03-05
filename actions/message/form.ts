'use server'

import { createMessage } from '@/actions/message/db'

import { error, success } from '@/lib/db'
import { ServerResponse } from '@/lib/types'

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

    return success({ message: 'Message sent', status: 201 })
  } catch (err) {
    return error(err as Error)
  }
}
