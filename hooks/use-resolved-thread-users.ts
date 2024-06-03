import { useMemo } from 'react'
import { resolveThreadUsers } from '#/api/thread/handlers'

export function useResolvedThreadUsers(threadId: string) {
  return useMemo(() => resolveThreadUsers(threadId), [threadId])
}
