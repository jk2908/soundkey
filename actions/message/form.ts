'use server'

import { createMessage, removeMessage } from '@/actions/message/db'

import { error, success } from '@/lib/db'
import { ServerResponse } from '@/lib/types'

export async function send(
  senderId: string,
  threadId: string | undefined,
  recipientIds: string[],
  prevState: ServerResponse,
  formData: FormData
): Promise<ServerResponse> {
  try {
    const body = formData.get('body') as string

    if (!recipientIds.length) throw new Error('Please provide at least one recipient')

    const { threadId: resolvedThreadId } = await createMessage({
      threadId,
      body,
      createdAt: Date.now(),
      senderId,
      recipientIds,
      type: 'message',
    })

    return success(201, 'Message sent', { payload: resolvedThreadId })
  } catch (err) {
    return error(500, err instanceof Error ? err.message : 'An unknown error occurred')
  }
}

export async function remove(
  messageId: string,
  prevState: ServerResponse
): Promise<ServerResponse> {
  try {
    await removeMessage(messageId)
    
    return success(204, 'Message deleted')
  } catch (err) {
    return error(500, err instanceof Error ? err.message : 'An unknown error occurred')
  }
}
