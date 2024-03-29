import type { Message } from '@/lib/schema'
import { cn } from '@/utils/cn'

export function MessageMeta({ message, className }: { message: Message; className?: string }) {
  const createdAt = new Date(message.createdAt).toLocaleString()
  const updatedAt = message.updatedAt ? new Date(message.updatedAt).toLocaleString() : null

  return (
    <div className={cn('flex gap-2 font-mono', className)}>
      {message.updatedAt ? (
        <span className="text-xs">Edited {updatedAt}</span>
      ) : (
        <span className="text-xs">Created {createdAt}</span>
      )}
    </div>
  )
}
