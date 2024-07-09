'use client'

import { startTransition, useActionState, useEffect, useRef, useState } from 'react'
import { destroy } from '#/api/message/actions'
import { flushSync } from 'react-dom'

import { useToast } from '#/hooks/use-toast'

import { Button, type ButtonProps } from '#/components/global/button'
import * as Modal from '#/components/global/modal'

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
  const [res, dispatch] = useActionState(destroy.bind(null, messageId), null)
  const { toast } = useToast()

  const openRef = useRef<HTMLButtonElement>(null)
  const confirmRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!res) return

    const { ok, message = '', status } = res

    if (!ok) {
      toast.error({ message, status })
      return
    }

    toast.success({ message, status })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [res])

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

                    startTransition(() => {
                      dispatch()
                    })
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
