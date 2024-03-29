'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

import { APP_URL } from '@/lib/config'
import type { SafeUser, Thread } from '@/lib/schema'
import { cn } from '@/utils/cn'

import * as ContextMenu from '@/components/global/context-menu'
import { Icon } from '@/components/global/icon'

async function resolveThreadUsers(threadId: string) {
  const res = await fetch(`${APP_URL}/api/thread/users/${threadId}`)

  if (!res.ok) {
    throw new Error('Could not get thread users')
  }

  return res.json()
}

type Props = {
  userId: string
  thread: Thread
  onDelete: () => void
  onArchive?: () => void
  className?: string
}

export function ThreadPreview({ userId, thread, onDelete, onArchive, className }: Props) {
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

  const actions = [
    {
      label: 'Delete',
      onClick: onDelete,
    },
    {
      label: 'Archive',
      onClick: () => {},
    },
  ]

  return (
    <motion.tr
      key={thread.threadId}
      onClick={() => push(`/threads/${thread.threadId}`)}
      role="row"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn('cursor-pointer', className)}>
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
      <td>
        <ContextMenu.Root>
          <ContextMenu.Toggle
            className="flex flex-col items-center justify-center gap-2 text-sm"
            style={{ width: '32px', height: '32px', borderRadius: '50%' }}>
            <Icon name="dots" size={18} />
            <span className="sr-only">Actions</span>
          </ContextMenu.Toggle>

          <ContextMenu.Content position="left" offset={10}>
            {actions.map(({ label, onClick }) => (
              <ContextMenu.Item key={label} onClick={() => onClick()}>
                {label}
              </ContextMenu.Item>
            ))}
          </ContextMenu.Content>
        </ContextMenu.Root>{' '}
      </td>
    </motion.tr>
  )
}
