import { cn } from '@/utils/cn'

type Props = {
  className?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export function Input({ children, className, ...rest }: Props) {
  return (
    <input
      className={cn(
        'sk-focus w-full rounded-full border border-keyline px-4 py-2 text-neutral-900 placeholder:text-sm autofill:shadow-[inset_0_0_0px_1000px_#fff]',
        className
      )}
      {...rest}
    />
  )
}
