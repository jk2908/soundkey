import { cn } from '#/utils/cn'

import { Icon } from '#/components/global/icon'

export type Props = {
  children: React.ReactNode
  withIcon?: boolean
} & React.HTMLAttributes<HTMLParagraphElement>

export function FormFieldDescription({ children, withIcon = true, className }: Props) {
  return (
    <div className={cn('flex items-start gap-2', className)}>
      {withIcon && <Icon name="info" size={16} className="shrink-0 mt-0.5" />}
      <p className="m-0 text-sm text-gr33n">{children}</p>
    </div>
  )
}
