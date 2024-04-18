import { cn } from '@/utils/cn'

function Tip({ className }: { className?: string }) {
  return (
    <div
      style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
      className={cn('aspect-square w-2', className)}
      aria-hidden="true"></div>
  )
}

export type Props = {
  children: React.ReactNode
  avatar?: React.ReactNode
  placement?: 'left' | 'right'
  className?: string
}

export async function SpeechBubble({ children, avatar, placement = 'right', className }: Props) {
  const tw = /bg-[^\s]*/
  const [bg] = (className && tw.exec(className)) || ['bg-app-bg-inverted']

  return (
    <div className="@container">
      <div
        className={cn(
          'flex flex-col gap-2 @xs:gap-3',
          placement === 'left' ? '@xs:flex-row-reverse' : '@xs:flex-row'
        )}>
        <div className="relative grow">
          <div
            className={cn(
              'peer rounded-lg bg-app-bg-inverted p-6 text-app-fg-inverted has-[div[contenteditable=true]]:bg-white has-[div[contenteditable=true]]:text-gr33n-100',
              className
            )}>
            {children}
          </div>

          {avatar && (
            <Tip
              className={cn(
                'peer-has-[div[contenteditable=true]]:bg-white absolute top-[calc(100%_-_1px)] -translate-y-1/2 rotate-[135deg] @xs:left-[calc(100%_-_1px)] @xs:right-auto @xs:top-2 @xs:translate-y-0',
                placement === 'left'
                  ? 'left-6 @xs:left-auto @xs:right-[calc(100%_-_1px)] @xs:translate-x-1/2 @xs:rotate-[225deg]'
                  : 'right-6 @xs:left-[calc(100%_-_1px)] @xs:right-auto @xs:-translate-x-1/2 @xs:rotate-45 @xs:scale-100',
                bg,
                
              )}
            />
          )}
        </div>
          
        {avatar && (
          <div
            className={cn(
              'shrink-0',
              placement === 'left'
                ? 'self-start pl-1 @xs:pl-0 @xs:pt-2'
                : 'self-end pr-1 @xs:self-start @xs:pr-0 @xs:pt-2'
            )}>
            {avatar}
          </div>
        )}
      </div>
    </div>
  )
}
