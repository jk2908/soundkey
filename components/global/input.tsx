import { cn } from '#/utils/cn'

export type Props = {
  ref?: React.Ref<HTMLInputElement>
  className?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export function Input({ ref, className, ...rest }: Props) {
  return (
    <input
      ref={ref}
      className={cn(
        'sk-focus w-full rounded-full  border border-keyline bg-keyline/30 px-4 py-2 placeholder:text-sm placeholder:text-app-fg/60 autofill:shadow-[inset_0_0_0px_1000px_#fff]',
        className
      )}
      {...rest}
    />
  )
}
