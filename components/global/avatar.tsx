import Image from 'next/image'
import { getProfile } from '#/api/profile/utils'

import { cn } from '#/utils/cn'

import { Icon } from '#/components/global/icon'

export type Props = {
  userId: string | null
  username: string
  size?: number
  className?: string
}

function Default({ size = 20, className }: Pick<Props, 'size' | 'className'>) {
  return (
    <div
      className={cn('relative overflow-hidden bg-app-bg-inverted p-2', className)}
      style={{ width: `${size}px`, height: `${size}px`, borderRadius: '50%' }}>
      <Icon
        name="user"
        size={size - 5}
        colour="rgb(var(--app-fg-inverted)"
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
      />
    </div>
  )
}

export async function Avatar({ userId, username, size = 24, className }: Props) {
  if (!userId) return <Default size={size} className={className} />

  const profile = await getProfile(userId)
  const { avatar } = profile ?? {}

  if (!avatar) return <Default size={size} className={className} />

  return (
    <Image
      src={avatar}
      alt={username}
      width={size}
      height={size}
      style={{ borderRadius: '50%' }}
      className={className}
    />
  )
}
