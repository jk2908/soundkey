import { cn } from '@/utils/cn'

type Props = {
  className?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export function Input({ children, className, ...rest }: Props) {
  return (
    <input className={cn('rounded-full border-keyline border py-1.5 px-3 w-full text-app-fg-inverted autofill:shadow-[inset_0_0_0px_1000px_transparent]', className)} {...rest} />
  )
}
