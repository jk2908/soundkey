import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

type Size = '3xs' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

export const Section = forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode
    className?: string
    size?: Size
  }
>(({ children, className, size = 'md' }, ref) => {
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

  return (
    <section ref={ref} className={cn(styleMap[size], className)}>
      {children}
    </section>
  )
})

Section.displayName = 'Section'
