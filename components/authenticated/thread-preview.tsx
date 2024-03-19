'use client'

import { use } from 'react'

import { APP_URL } from '@/lib/config'
import type { SafeUser, Thread } from '@/lib/schema'

async function resolveThreadUsers(threadId: string) {
  const res = await fetch(`${APP_URL}/api/thread/users/${threadId}`)

  if (!res.ok) {
    throw new Error('Could not get thread users')
  }

  return res.json()
}

export function ThreadPreview({ thread }: { thread: Thread }) {
  const users = use<SafeUser[]>(resolveThreadUsers(thread.threadId))
  const createdAt = new Date(thread.createdAt).toLocaleString()
  const { updatedAt } = thread

  return (
    <tr>
      <td>
        {users.map((u, idx) => (
          <span key={u.userId}>{`${u.username}${idx < users.length - 1 ? ', ' : ''}`}</span>
        ))}
      </td>

      <td>{createdAt}</td>
    </tr>
  )
}
