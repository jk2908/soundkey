import Image from 'next/image'
import { getProfile } from '@/actions/profile/db'

import { cn } from '@/utils/cn'

import { Icon } from '@/components/global/icon'

function Default({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <div
      className={cn('overflow-hidden bg-app-bg-inverted relative', className)}
      style={{ width: `${size}px`, height: `${size}px`, borderRadius: '50%' }}>
      <Icon name="user" size={size - 5} colour="rgb(var(--app-fg-inverted)" className="absolute left-1/2 -translate-x-1/2 bottom-0" />
    </div>
  )
}

export async function Avatar({
  userId,
  size = 24,
  className,
}: {
  userId: string | null
  size?: number
  className?: string
}) {
  if (!userId) return <Default size={size} className={className} />

  const profile = await getProfile(userId)
  const { avatar, username } = profile ?? {}

  if (!avatar || !username) return <Default size={size} className={className} />

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
