import Link from 'next/link'

import { type Project } from '#/lib/schema'
import { type WithFormattedTimestamps } from '#/lib/types'
import { cn } from '#/utils/cn'

import { BodyHeading } from '#/components/global/body-heading'
import { Button } from '#/components/global/button'
import { FocusedText } from '#/components/global/focused-text'
import { GradientMask } from '#/components/global/gradient-mask'
import { HorizontalRule } from '#/components/global/horizontal-rule'
import { Icon } from '#/components/global/icon'
import { Marquee } from '#/components/global/marquee'

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
        'flex flex-col gap-4 rounded-2xl bg-app-bg-inverted text-app-fg-inverted py-4',
        className
      )}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-4">
          <FocusedText as="h2" className="text-end px-4">
            In focus
          </FocusedText>

          <HorizontalRule className="border-keyline/25" />
          <div className="relative">
            <GradientMask className="from-app-bg-inverted" isVisible />

            <Marquee>
              <div className="flex items-center gap-3">
                <Icon name="disc" size={20} />

                <BodyHeading level={3} className="font-normal">
                  {name} <span className="font-sans text-sm not-italic">by</span> {artist}
                </BodyHeading>

                <Icon name="disc" size={20} />
              </div>
            </Marquee>

            <GradientMask className="from-app-bg-inverted" isVisible mirror />
          </div>

          <HorizontalRule className="border-keyline/25" />

          <div className="px-4">
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
        </div>

        {/*
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
      */}
      </div>

      {/*
      <HorizontalRule className="border-dashed border-keyline/25" />

      <ul className="flex flex-wrap items-baseline gap-3">
        {list.map(
          ({ text, body }) =>
            body && (
              <li
                key={text}
                className="flex items-baseline gap-1 rounded-full border border-dashed border-app-bg/20 bg-app-bg/10 px-4 py-1 text-sm text-app-fg-inverted">
                {text}: {body}
              </li>
            )
        )}
      </ul>
      */}
    </div>
  )
}
