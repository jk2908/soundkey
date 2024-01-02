import { cn } from '@/lib/utils'

type Size = '3xs' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

export function Section({
  children,
  className,
  size = 'md',
}: {
  children: React.ReactNode
  className?: string
  size?: Size
}) {
  const styleMap: Record<Size, string> = {
    '3xs': 'py-0.5',
    '2xs': 'py-1',
    xs: 'py-2',
    sm: 'py-3',
    md: 'py-4',
    lg: 'py-6',
    xl: 'py-8',
    '2xl': 'py-12',
    '3xl': 'py-16',
  }

  return <section className={cn(styleMap[size], className)}>{children}</section>
}
