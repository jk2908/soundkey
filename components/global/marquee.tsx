import { cn } from '#/utils/cn'

export function Marquee({
  children,
  className,
  ...rest
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('sk-marquee', className)} {...rest}>
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </div>
  )
}
