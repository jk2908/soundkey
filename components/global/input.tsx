import { forwardRef } from 'react'

import { cn } from '@/utils/cn'

export type Props = {
  className?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ children, className, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'sk-focus w-full rounded-full border border-keyline bg-white px-4 py-2 text-neutral-900 placeholder:text-sm autofill:shadow-[inset_0_0_0px_1000px_#fff]',
          className
        )}
        {...rest}
      />
    )
  }
)

Input.displayName = 'Input'
