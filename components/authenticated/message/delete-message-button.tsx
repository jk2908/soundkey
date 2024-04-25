'use client'

import { useEffect, useRef, useState } from 'react'
import { destroy } from '@/actions/message/state'
import { flushSync, useFormState } from 'react-dom'

import { ServerResponse } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'

import { Button, type ButtonProps } from '@/components/global/button'
import * as Modal from '@/components/global/modal'

const initialState: ServerResponse = {
  type: undefined,
  message: null,
  status: undefined,
}

export function DeleteMessageButton({
  children,
  messageId,
  onModalOpen,
  ...rest
}: {
  children: React.ReactNode
  messageId: string
  onModalOpen?: () => void
} & Omit<ButtonProps<'button'>, 'as'>) {
  const [isConfirmOpen, setConfirmOpen] = useState(false)
  const [state, dispatch] = useFormState(destroy.bind(null, messageId), initialState)
  const { toast } = useToast()

  const openRef = useRef<HTMLButtonElement>(null)
  const confirmRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!state.type) return

    toast({ ...state })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  return (
    <>
      <Button
        ref={openRef}
        onClick={() => {
          flushSync(() => {
            setConfirmOpen(true)
          })

          confirmRef.current?.focus()
          onModalOpen?.()
        }}
        {...rest}>
        {children}
      </Button>

      <Modal.Root
        isOpen={isConfirmOpen}
        setOpen={setConfirmOpen}
        onAfterClose={() => {
          openRef?.current?.focus()
        }}>
        {({ close }) => (
          <>
            <Modal.Overlay />

            <Modal.Content>
              <Modal.Close />
              <p className="text-pretty text-center">
                This action is irreversible. Are you sure you want to delete this message?
              </p>

              <Modal.Actions>
                <Button
                  ref={confirmRef}
                  onClick={() => {
                    close()
                    dispatch()
                  }}
                  variant="danger"
                  className="mr-2">
                  Delete
                </Button>

                <Button onClick={close} variant="secondary">
                  Cancel
                </Button>
              </Modal.Actions>
            </Modal.Content>
          </>
        )}
      </Modal.Root>
    </>
  )
}
