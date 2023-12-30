import { cn } from '@/lib/utils'

type Props = {
  children: React.ReactNode
  className?: string
} & React.HTMLAttributes<HTMLDivElement>

export function FormGroup({ children, className, ...rest }: Props) {
  return (
    <div className={cn(className)} {...rest}>
      {children}
    </div>
  )
}