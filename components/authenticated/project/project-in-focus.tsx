import { type Project } from '#/lib/schema'
import { type WithFormattedTimestamps } from '#/lib/types'
import { cn } from '#/utils/cn'

import { BodyHeading } from '#/components/global/body-heading'
import { Button } from '#/components/global/button'
import { FocusedText } from '#/components/global/focused-text'
import { HorizontalRule } from '#/components/global/horizontal-rule'
import { Icon } from '#/components/global/icon'
import Link from 'next/link'

export function ProjectInFocus({
  project,
  ref,
  withOpenButton = true,
  className,
}: {
  project: WithFormattedTimestamps<Project, 'createdAt' | 'updatedAt'>
  ref?: React.Ref<HTMLDivElement>
  withOpenButton?: boolean
  className?: string
}) {
  const { projectId, name, description, artist, createdAt, updatedAt } = project

  const list = [
    {
      text: 'Name',
      body: name,
    },
    {
      text: 'Artist',
      body: artist,
    },
    {
      text: 'Created',
      body: createdAt,
    },
    {
      text: 'Updated',
      body: updatedAt,
    },
  ]

  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col gap-4 rounded-lg bg-app-bg-inverted p-6 text-app-fg-inverted',
        className
      )}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-8 flex-col gap-3">
          <FocusedText as="h2">In focus</FocusedText>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Icon name="music" size={20} />

              <BodyHeading level={3} styleAsLevel={2}>
                {name} <span className="font-sans text-sm not-italic">by</span> {artist}
              </BodyHeading>
            </div>

            {description && <p>{description}</p>}
          </div>
        </div>

        {withOpenButton && (
          <Button
            as={Link}
            href={`/projects/p/${projectId}`}
            variant="highlight"
            size="sm"
            className="w-fit">
            Open
          </Button>
        )}
      </div>

      <HorizontalRule className="border-keyline/25" />

      <ul className="flex flex-wrap items-baseline gap-3">
        {list.map(
          ({ text, body }) =>
            body && (
              <li
                key={text}
                className="flex items-baseline gap-1 rounded-full bg-app-bg px-4 py-1 text-app-fg">
                <BodyHeading
                  level={4}
                  styleAsLevel={6}
                  className="font-sans uppercase not-italic tracking-widest">
                  {text}:
                </BodyHeading>

                <p className="text-sm font-semibold">{body}</p>
              </li>
            )
        )}
      </ul>
    </div>
  )
}
