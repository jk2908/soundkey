'use client'

import { use } from 'react'
import { flushSync } from 'react-dom'

import { cn } from '@/utils/cn'

import { DeleteMessageButton } from '@/components/authenticated/message/delete-message-button'
import { EditableMessageContext } from '@/components/authenticated/message/editable-message'
import { Button } from '@/components/global/button'
import { Icon } from '@/components/global/icon'

export function MessageActionsMenu({
  messageId,
  className,
}: {
  messageId: string
  className?: string
}) {
  const { ref, isEditing, setEditing, save, cancel } = use(EditableMessageContext)

  const props = { iconOnly: true }

  return (
    <div className={cn('flex gap-2', className)}>
      {isEditing ? (
        <>
          <Button onClick={async () => await save()} variant="success" {...props}>
            <Icon name="check" size={14} colour="#fff" title="Save changes" />
            <span className="sr-only">Save changes</span>
          </Button>

          <Button onClick={cancel} variant="danger" {...props}>
            <Icon name="x" size={14} colour="#fff" title="Cancel edit" />
            <span className="sr-only">Cancel edit</span>
          </Button>
        </>
      ) : (
        <Button
          onClick={() => {
            flushSync(() => {
              setEditing(true)
            })

            ref.current?.focus()
          }}
          {...props}>
          <Icon name="pencil" size={14} title="Edit message" />
          <span className="sr-only">Edit message</span>
        </Button>
      )}

      <DeleteMessageButton messageId={messageId} onModalOpen={cancel} {...props}>
        <Icon name="trash" size={14} title="Delete message" />
        <span className="sr-only">Delete message</span>
      </DeleteMessageButton>
    </div>
  )
}
