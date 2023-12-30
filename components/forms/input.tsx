import { cn } from '@/lib/utils'

type Props = {
  className?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export function Input({ children, className, ...rest }: Props) {
  return (
    <input className={cn(className)} {...rest} />
  )
}
