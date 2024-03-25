import { cn } from '@/utils/cn'

export function Wrapper({
  children,
  size = 'md',
  className,
}: {
  children: React.ReactNode
  size?: 0 | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  className?: string
}) {
  const styleMap = {
    0: '',
    sm: 'max-w-160',
    md: 'max-w-240',
    lg: 'max-w-320',
    xl: 'max-w-352',
    xxl: 'max-w-384',
  }

  return (
    <div className={cn('mx-auto w-full px-[--wrapper-px]', styleMap[size], className)}>{children}</div>
  )
}
