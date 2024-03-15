import { getUserWithId } from '@/actions/user/db'

import { type Message } from '@/lib/schema'
import { cn } from '@/utils/cn'

import { Avatar } from '@/components/global/avatar'

function Tip({ className }: { className?: string }) {
  return (
    <div
      style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
      className={cn('aspect-square w-2', className)}
      aria-hidden="true"></div>
  )
}

export async function SpeechBubble({
  children,
  avatar,
  placement = 'right',
  className,
}: {
  children: React.ReactNode
  avatar?: React.ReactNode
  placement?: 'left' | 'right'
  className?: string
}) {
  const tw = /bg-\w+(?:-\w+)*/
  const [bg] = (className && tw.exec(className)) || ['bg-app-bg-inverted']

  return (
    <div className="@container">
      <div className="@xs:flex-row flex flex-col gap-2 @xs:gap-3">
        <div className="relative grow">
          {avatar && <Tip className={cn('absolute right-6 top-[calc(100%_-_1px)] @xs:left-[calc(100%_-_1px)] @xs:top-2 @xs:scale-100 @xs:rotate-180', bg)} />}

          <p className={cn('rounded-lg bg-app-bg-inverted p-6 text-app-fg-inverted', className)}>
            {children}
          </p>
        </div>

        {avatar && (
          <div
            className={cn(
              'shrink-0',
              placement === 'right'
                ? '@xs:self-start @xs:pt-2 @xs:pr-0 self-end pr-1'
                : '@xs:pt-2 @xs:pl-0 self-start pl-1'
            )}>
            {avatar}
          </div>
        )}
      </div>
    </div>
  )
}
