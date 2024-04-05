'use client'

import { use } from 'react'
import { AnimatePresence } from 'framer-motion'
import { flushSync } from 'react-dom'

import { IntentVariant } from '@/lib/types'
import { cn } from '@/utils/cn'
import { generateId } from '@/utils/generate-id'

import { DeleteMessageButton } from '@/components/authenticated/message/delete-message-button'
import { EditableMessageContext } from '@/components/authenticated/message/editable-message'
import { Button } from '@/components/global/button'
import { Icon } from '@/components/global/icon'
import { MotionDiv } from '@/components/global/motion-div'

export function MessageActionsMenu({
  messageId,
  className,
}: {
  messageId: string
  className?: string
}) {
  const { ref, isEditing, setEditing, save } = use(EditableMessageContext)

  const props = { variant: 'secondary' as IntentVariant, iconOnly: true }

  return (
    <div className={cn('flex gap-2', className)}>
      <AnimatePresence>
        {isEditing ? (
          <>
            <MotionDiv key={generateId()} layout>
              <Button
                onClick={async () => await save()}
                className="bg-success"
                {...props}>
                <Icon name="check" size={14} colour="#fff" title="Save changes" />
                <span className="sr-only">Save changes</span>
              </Button>
            </MotionDiv>

            <MotionDiv key={generateId()} layout>
              <Button onClick={() => setEditing(false)} className="bg-danger" {...props}>
                <Icon name="x" size={14} colour="#fff" title="Cancel edit" />
                <span className="sr-only">Cancel edit</span>
              </Button>
            </MotionDiv>
          </>
        ) : (
          <MotionDiv key={generateId()} layout>
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
          </MotionDiv>
        )}

        <MotionDiv key={generateId()} layout>
          <DeleteMessageButton messageId={messageId} {...props}>
            <Icon name="trash" size={14} title="Delete message" />
            <span className="sr-only">Delete message</span>
          </DeleteMessageButton>
        </MotionDiv>
      </AnimatePresence>
    </div>
  )
}
