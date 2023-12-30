import { cn } from '@/lib/utils'

type Level = 1 | 2 | 3 | 4 | 5 | 6

type Props = {
  children: React.ReactNode
  level?: Level
  styleAsLevel?: Level
  className?: string
} & React.HTMLAttributes<HTMLHeadingElement>

export function Heading({ children, level = 2, styleAsLevel, className, ...rest }: Props) {
  const Cmp = `h${level}` as const

  const styleMap: Record<Level, string> = {
    1: 'text-2xl',
    2: 'text-xl',
    3: 'text-lg',
    4: 'text-md',
    5: 'text-base',
    6: 'text-sm',
  }

  return (
    <Cmp className={cn(className, styleMap[styleAsLevel ?? level])} {...rest}>
      {children}
    </Cmp>
  )
}
