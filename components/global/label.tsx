import { cn } from '@/utils/cn'

type Props = {
  children: React.ReactNode
  className?: string
} & React.LabelHTMLAttributes<HTMLLabelElement>

export function Label({ children, className, ...rest }: Props) {
  return (
    <label className={cn('block font-mono lowercase', className)} {...rest}>
      {children}
    </label>
  )
}
