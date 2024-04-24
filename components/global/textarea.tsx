import { cn } from '@/utils/cn'
import { forwardRef } from 'react'

type Props = {
  className?: string
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(({ className, ...rest }, ref) => {
  return (
    <textarea 
      ref={ref}
      className={cn(
        'sk-focus w-full rounded-lg border border-keyline px-4 py-2 text-neutral-900 placeholder:text-sm autofill:shadow-[inset_0_0_0px_1000px_#fff]',
        className
      )}
      {...rest}
    />
  )
})

Textarea.displayName = 'Textarea'
