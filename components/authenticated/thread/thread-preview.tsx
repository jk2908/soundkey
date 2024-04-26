'use client'

import { use, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { resolveThreadUsers } from '@/api/thread/handlers'

import type { SafeUser, Thread } from '@/lib/schema'
import { cn } from '@/utils/cn'

import * as ContextMenu from '@/components/global/context-menu'
import { Icon } from '@/components/global/icon'

type Props = {
  userId: string
  thread: Thread
  onDelete: () => void
  onArchive?: () => void
  className?: string
}

export function ThreadPreview({ userId, thread, onDelete, onArchive, className }: Props) {
  const { threadId, ownerId, createdAt, updatedAt } = thread
  const usersPromise = useMemo(() => resolveThreadUsers(threadId), [threadId])
  const users = use<SafeUser[]>(usersPromise)
  const { push } = useRouter()

  const open = () => push(`/threads/${thread.threadId}`)

  const usersDisplay = users.filter(u => {
    if (users.length === 1 && u.userId === userId) {
      return u
    }

    return u.userId !== userId
  })

  const actions = [
    {
      label: 'Open',
      onClick: open,
    },
    {
      label: 'Delete',
      onClick: onDelete,
      hideWhen: ownerId !== userId,
    },
    {
      label: 'Archive',
      onClick: () => {},
    },
  ]

  return (
    <tr key={thread.threadId} onClick={open} role="row" className={cn('cursor-pointer', className)}>
      <td role="gridcell">
        {usersDisplay.map((u, idx) => (
          <span
            key={u.userId}
            className={cn(
              'font-medium',
              u.userId === userId && 'font-mono text-xs italic'
            )}>{`${u.username}${idx < usersDisplay.length - 1 ? ', ' : ''}`}</span>
        ))}
      </td>

      <td className="font-mono text-xs">{new Date(createdAt).toLocaleString()}</td>
      <td className="font-mono text-xs">
        {updatedAt ? new Date(updatedAt).toLocaleString() : '-'}
      </td>
      <td>
        <ContextMenu.Root>
          <ContextMenu.Toggle
            className="flex flex-col items-center justify-center gap-2 text-sm"
            style={{ width: '32px', height: '32px', borderRadius: '50%' }}>
            <Icon name="dots" size={18} />
            <span className="sr-only">Actions</span>
          </ContextMenu.Toggle>

          <ContextMenu.Content position="left" offset={10}>
            {actions.map(
              ({ label, onClick, hideWhen = false }) =>
                !hideWhen && (
                  <ContextMenu.Item key={label} onClick={() => onClick()}>
                    {label}
                  </ContextMenu.Item>
                )
            )}
          </ContextMenu.Content>
        </ContextMenu.Root>
      </td>
    </tr>
  )
}
