import { cn } from '@/utils/cn'

export type Props = {
  children: React.ReactNode
  className?: string
} & React.LabelHTMLAttributes<HTMLLabelElement>

export function Label({ children, className, ...rest }: Props) {
  return (
    <label className={cn('block font-mono text-sm lowercase select-none', className)} {...rest}>
      {children}
    </label>
  )
}
