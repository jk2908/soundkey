import { cn } from '#/utils/cn'

import { Icon, type Props } from '#/components/global/icon'

export function Spinner(props: Omit<Props, 'name'>) {
  const { className, ...rest } = props

  return (
    <Icon
      name="spinner"
      className={cn('animate-spin', className)}
      style={{ transformOrigin: 'center center' }}
      size={18}
      {...rest}
    />
  )
}
