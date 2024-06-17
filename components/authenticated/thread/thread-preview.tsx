'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'

import type { SafeUser, Thread } from '#/lib/schema'
import { type WithFormattedTimestamps } from '#/lib/types'
import { useResolvedThreadUsers } from '#/hooks/use-resolved-thread-users'
import { cn } from '#/utils/cn'

import * as ContextMenu from '#/components/global/context-menu'
import { Icon } from '#/components/global/icon'

type Props = {
  userId: string
  thread: WithFormattedTimestamps<Thread, 'createdAt' | 'updatedAt'>
  onDelete: () => void
  onArchive?: () => void
  className?: string
}

export function ThreadPreview({ userId, thread, onDelete, className }: Props) {
  const { threadId, ownerId, createdAt, updatedAt } = thread
  const usersPromise = useResolvedThreadUsers(threadId)
  const users = use<SafeUser[]>(usersPromise)
  const { push } = useRouter()

  const open = () => push(`/threads/t/${thread.threadId}`)

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
  ]

  return (
    <tr key={threadId} onClick={open} role="row" className={cn('cursor-pointer', className)}>
      <td>
        {usersDisplay.map((u, idx) => (
          <span
            key={u.userId}
            className={cn(
              'font-medium',
              u.userId === userId && 'font-mono text-xs italic'
            )}>{`${u.username}${idx < usersDisplay.length - 1 ? ', ' : ''}`}</span>
        ))}
      </td>

      <td className="font-mono text-xs">{createdAt}</td>
      <td className="font-mono text-xs">{updatedAt ?? '-'}</td>
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
