import { cn } from '@/utils/cn'

type Props = {
  children: React.ReactNode
  className?: string
} & React.HTMLAttributes<HTMLDivElement>

export function FormGroup({ children, className, ...rest }: Props) {
  return (
    <div className={cn('space-y-2 [&_+_&]:mt-6', className)} {...rest}>
      {children}
    </div>
  )
}