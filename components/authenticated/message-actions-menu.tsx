import { cn } from '@/utils/cn'

import { DeleteMessageButton } from '@/components/authenticated/delete-message-button'

export function MessageActionsMenu({
  messageId,
  className,
}: {
  messageId: string
  className?: string
}) {
  return (
    <div className={cn('flex gap-4', className)}>
      <DeleteMessageButton messageId={messageId} />
    </div>
  )
}
