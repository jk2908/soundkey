import { cn } from '@/lib/utils'

type Props = {
  children: React.ReactNode
  className?: string
} & React.LabelHTMLAttributes<HTMLLabelElement>

export function Label({ children, className, ...rest }: Props) {
  return (
    <label className={cn(className)} {...rest}>
      {children}
    </label>
  )
}