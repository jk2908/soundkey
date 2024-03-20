'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'

import { APP_URL } from '@/lib/config'
import type { SafeUser, Thread } from '@/lib/schema'
import { cn } from '@/utils/cn'

async function resolveThreadUsers(threadId: string) {
  const res = await fetch(`${APP_URL}/api/thread/users/${threadId}`)

  if (!res.ok) {
    throw new Error('Could not get thread users')
  }

  return res.json()
}

export function ThreadPreview({ userId, thread, className }: { userId: string; thread: Thread, className?: string }) {
  const users = use<SafeUser[]>(resolveThreadUsers(thread.threadId))
  const { push } = useRouter()

  const createdAt = new Date(thread.createdAt).toLocaleString()
  const updatedAt = thread.updatedAt ? new Date(thread.updatedAt).toLocaleString() : '-'

  const usersDisplay = users.filter(u => {
    if (users.length === 1 && u.userId === userId) {
      return u
    }

    return u.userId !== userId
  })

  return (
    <tr onClick={() => push(`/threads/${thread.threadId}`)} role="row" className={cn('cursor-pointer', className)}>
      <td role="gridcell">
        {usersDisplay.map((u, idx) => (
          <span
            key={u.userId}
            className={cn(
              u.userId === userId && 'italic'
            )}>{`${u.username}${idx < usersDisplay.length - 1 ? ', ' : ''}`}</span>
        ))}
      </td>
      <td className="font-mono text-sm">{createdAt}</td>
      <td className="font-mono text-sm">{updatedAt}</td>
    </tr>
  )
}
