import { cn } from '#/utils/cn'

export function YSpace({
  children,
  ref,
  className,
  ...rest
}: {
  children: React.ReactNode
  ref?: React.Ref<HTMLDivElement>
  className?: string
}) {
  return (
    <div
      ref={ref}
      className={cn('space-y-4 md:space-y-8 [&>*[class*="sr-only"]+*]:!mt-0', className)}
      {...rest}>
      {children}
    </div>
  )
}
