import { cn } from '#/utils/cn'

type Props = {
  ref?: React.Ref<HTMLTextAreaElement>
  className?: string
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>

export function Textarea({ ref, className, ...rest }: Props) {
  return (
    <textarea
      ref={ref}
      className={cn(
        'sk-focus w-full rounded-lg border border-keyline bg-keyline/30 px-4 py-2 placeholder:text-sm autofill:shadow-[inset_0_0_0px_1000px_#fff]',
        className
      )}
      {...rest}
    />
  )
}
