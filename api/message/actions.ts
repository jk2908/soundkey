'use server'

import { createMessage, deleteMessage, updateMessage } from '#/api/message/utils'

import { error, success } from '#/lib/db'
import { ServerResponse } from '#/lib/types'
import { revalidateTag } from 'next/cache'

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

export async function destroy(
  messageId: string,
  prevState: ServerResponse
): Promise<ServerResponse> {
  try {
    await deleteMessage(messageId)

    return success(204, 'Message deleted')
  } catch (err) {
    return error(500, err instanceof Error ? err.message : 'An unknown error occurred')
  }
}

export async function update(
  messageId: string,
  body: string,
  prevState: ServerResponse
): Promise<ServerResponse> {
  try {
    await updateMessage({ messageId, body })
    
    revalidateTag('message')
    return success(200, 'Message updated')
  } catch (err) {
    return error(500, err instanceof Error ? err.message : 'An unknown error occurred')
  }
}
