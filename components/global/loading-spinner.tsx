import { cn } from '@/lib/utils'

import { Icon, type Props } from '@/components/global/icon'

export function LoadingSpinner(props: Props) {
  const { name, className, ...rest } = props

  return (
    <Icon
      name="spinner"
      className={cn('animate-spin', className)}
      style={{ transformOrigin: 'center center' }}
      {...rest}
    />
  )
}
