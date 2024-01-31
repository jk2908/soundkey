import { message, systemMessage } from '@/lib/schema'

export function buildMessage(source: 'message' | 'system') {
  const {
    id: messageId,
    fromUserId,
    content,
    createdAt,
    updatedAt,
    read,
    type,
  } = source === 'message' ? message : systemMessage

  return {
    messageId,
    fromUserId,
    content,
    createdAt,
    updatedAt,
    read,
    type,
  }
}
