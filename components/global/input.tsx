import { cn } from '@/utils/cn'

type Props = {
  className?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export function Input({ children, className, ...rest }: Props) {
  return (
    <input className={cn('rounded-full py-1.5 px-3 w-full text-app-fg-inverted', className)} {...rest} />
  )
}
