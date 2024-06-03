import { cn } from '#/utils/cn'

type Props = {
  children: React.ReactNode
  withNestedChildren?: boolean
  followsNestedChildren?: boolean
  className?: string
} & React.HTMLAttributes<HTMLDivElement>

export function FormGroup({
  children,
  withNestedChildren,
  followsNestedChildren,
  className,
  ...rest
}: Props) {
  return (
    <div
      className={cn(
        '[&>:is(h2,h3,h4,h5,h6)]:mb-4',
        !withNestedChildren ? 'space-y-2 [&_+_&]:mt-4' : '[&_+_&]:mt-6',
        followsNestedChildren && 'mt-6',
        className
      )}
      {...rest}>
      {children}
    </div>
  )
}
