import { cn } from '#/utils/cn'

type Level = 1 | 2 | 3 | 4 | 5 | 6

export type Props = {
  children: React.ReactNode
  level?: Level
  styleAsLevel?: Level
  className?: string
} & React.HTMLAttributes<HTMLHeadingElement>

export function BodyHeading({ children, level = 2, styleAsLevel, className, ...rest }: Props) {
  const Cmp = `h${level}` as const

  const styleMap: Record<Level, string> = {
    1: 'text-lg',
    2: 'text-md',
    3: 'text-base',
    4: 'text-sm',
    5: 'text-xs',
    6: 'text-xs',
  }

  return (
    <Cmp
      className={cn(
        'font-mono font-medium italic tracking-wide',
        className,
        styleMap[styleAsLevel ?? level]
      )}
      {...rest}>
      {children}
    </Cmp>
  )
}
