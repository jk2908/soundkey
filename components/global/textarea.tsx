import { cn } from '@/utils/cn'

type Props = {
  className?: string
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>

export function Textarea({ children, className, ...rest }: Props) {
  return (
    <textarea
      className={cn(
        'sk-focus w-full rounded-xl border border-keyline px-4 py-2 text-neutral-900 placeholder:text-sm autofill:shadow-[inset_0_0_0px_1000px_#fff]',
        className
      )}
      {...rest}
    />
  )
}
