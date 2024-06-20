import { cn } from '#/utils/cn'

export function GradientMask({
  isVisible,
  mirror,
  className,
  ...rest
}: { isVisible?: boolean; mirror?: boolean } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'absolute z-10 w-6 from-app-bg to-app-bg/0 opacity-0 transition-opacity duration-100',
        mirror ? 'inset-[0_0_0_auto] bg-gradient-to-l' : 'inset-[0_auto_0_0] bg-gradient-to-r',
        isVisible && 'opacity-100',
        className
      )}
      aria-hidden="true"
      {...rest}></div>
  )
}
