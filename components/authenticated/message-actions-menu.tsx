import { ServerResponse } from '@/lib/types'
import { cn } from '@/utils/cn'
import { RemoveMessageButton } from '@/components/authenticated/remove-message-button'

export function MessageActionsMenu({
  messageId,
  className,
}: {
  messageId: string
  className?: string
}) {

  return (
    <div className={cn('flex gap-4', className)}>
      <RemoveMessageButton messageId={messageId} />
    </div>
  )
}
