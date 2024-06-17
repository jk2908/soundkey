'use client'

import { useRouter } from 'next/navigation'

import { type Project } from '#/lib/schema'
import { type WithFormattedTimestamps } from '#/lib/types'
import { cn } from '#/utils/cn'

import * as ContextMenu from '#/components/global/context-menu'
import { Icon } from '#/components/global/icon'

export function ProjectPreview({
  project,
  className,
}: {
  project: WithFormattedTimestamps<Project, 'createdAt' | 'updatedAt'>
  className?: string
}) {
  const { projectId, name, artist, createdAt, updatedAt } = project
  const { push } = useRouter()

  const open = () => push(`/projects/p/${projectId}`)

  const actions = [
    {
      label: 'Open',
      onClick: open,
    },
  ]

  return (
    <tr key={projectId} onClick={open} role="row" className={cn('cursor-pointer', className)}>
      <td>{name}</td>
      <td>{artist}</td>
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
            {actions.map(({ label, onClick }) => (
              <ContextMenu.Item key={label} onClick={() => onClick()}>
                {label}
              </ContextMenu.Item>
            ))}
          </ContextMenu.Content>
        </ContextMenu.Root>
      </td>
    </tr>
  )
}
