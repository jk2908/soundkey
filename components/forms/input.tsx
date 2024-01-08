import { cn } from '@/lib/utils'

type Props = {
  className?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export function Input({ children, className, ...rest }: Props) {
  return (
    <input className={cn('rounded-full py-1.5 px-3 w-full max-w-prose', className)} {...rest} />
  )
}
