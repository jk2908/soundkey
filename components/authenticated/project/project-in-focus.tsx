import { type Project } from '#/lib/schema'
import { type WithFormattedTimestamps } from '#/lib/types'
import { cn } from '#/utils/cn'

import { BodyHeading } from '#/components/global/body-heading'
import { HorizontalRule } from '#/components/global/horizontal-rule'

export function ProjectInFocus({
  project,
  ref,
  className,
}: {
  project: WithFormattedTimestamps<Project, 'createdAt' | 'updatedAt'>
  ref?: React.Ref<HTMLDivElement>
  className?: string
}) {
  const { name, description, artist, createdAt, updatedAt } = project

  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col gap-4 rounded-lg bg-app-bg-inverted p-6 text-app-fg-inverted',
        className
      )}>
      <div className="flex flex-col gap-2">
        <BodyHeading level={2} styleAsLevel={4}>
          {name} <span className="font-sans text-xs not-italic">by</span> {artist}
        </BodyHeading>
      </div>

      <HorizontalRule className="border-keyline/25" />

      <p className={cn('text-pretty text-sm')}>{description}</p>
    </div>
  )
}
