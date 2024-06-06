import { type Project } from '#/lib/schema'
import { type WithFormattedTimestamps } from '#/lib/types'
import { cn } from '#/utils/cn'

import { BodyHeading } from '#/components/global/body-heading'
import { Button } from '#/components/global/button'
import { HorizontalRule } from '#/components/global/horizontal-rule'
import { Icon } from '#/components/global/icon'

export function ProjectInFocus({
  project,
  ref,
  className,
}: {
  project: WithFormattedTimestamps<Project, 'createdAt' | 'updatedAt'>
  ref?: React.Ref<HTMLDivElement>
  className?: string
}) {
  const { projectId, name, description, artist, createdAt, updatedAt } = project

  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col gap-4 rounded-lg bg-app-bg-inverted p-6 text-app-fg-inverted',
        className
      )}>
      <div className="flex flex-col gap-3">
        <BodyHeading level={2} styleAsLevel={4} className="font-sans not-italic tracking-wide">
          In focus:
        </BodyHeading>

        <div className="flex items-center gap-2">
          <Icon name="disc" size={24} />

          <BodyHeading level={3} styleAsLevel={2}>
            {name} <span className="font-sans text-sm not-italic">by</span> {artist}
          </BodyHeading>
        </div>
      </div>

      <HorizontalRule className="border-keyline/25" />

      <Button as="a" href={`/projects/${projectId}`} variant="highlight" className="w-fit">
        Open
      </Button>
    </div>
  )
}
