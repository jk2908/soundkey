'use client'

import { useActionState, useEffect, useId, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { send } from '#/api/message/actions'
import { flushSync } from 'react-dom'

import { useToast } from '#/hooks/use-toast'
import { cn } from '#/utils/cn'
import { generateId } from '#/utils/generate-id'

import { FormGroup } from '#/components/global/form-group'
import { Icon } from '#/components/global/icon'
import { Label } from '#/components/global/label'
import * as Listbox from '#/components/global/listbox'
import * as Search from '#/components/global/search'
import { Spinner } from '#/components/global/spinner'
import { SubmitButton } from '#/components/global/submit-button'
import { Textarea } from '#/components/global/textarea'

type ResolvedRecipient = {
  userId: string
  label: string
}

export function SendMessageForm({
  senderId,
  threadId,
  resolvedRecipients = [],
  forceScroll = true,
  className,
  ...rest
}: {
  senderId: string
  threadId?: string
  resolvedRecipients: ResolvedRecipient[] | []
  forceScroll?: boolean
  className?: string
} & React.HTMLAttributes<HTMLFormElement>) {
  const ref = useRef<HTMLFormElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLTextAreaElement>(null)

  const [recipients, setRecipients] = useState<ResolvedRecipient[] | []>(resolvedRecipients)

  const recipientsId = useId()
  const bodyId = useId()

  const [res, dispatch] = useActionState(
    send.bind(
      null,
      senderId,
      threadId,
      recipients.map(u => u.userId)
    ),
    null
  )

  const { replace, push } = useRouter()
  const { toast } = useToast()
  const pathname = usePathname()

  useEffect(() => {
    if (!res) return

    const { ok, message = '', status, payload } = res

    if (!ok) {
      toast.error({ message, status })
      return
    }

    toast.success({ message, status })

    if (payload && !threadId) {
      replace(`/threads/t/${payload}`)
    }

    if (bodyRef.current) {
      bodyRef.current.value = ''
      bodyRef.current.focus()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [res, push])

  useEffect(() => {
    if (!forceScroll || !res?.ok) return

    setTimeout(() => {
      if (!ref.current) return

      scrollTo({
        top: ref.current?.getBoundingClientRect().bottom,
        behavior: 'smooth',
      })
    }, 1000)
  }, [forceScroll, res])

  return (
    <form
      ref={ref}
      action={dispatch}
      className={cn('flex max-w-prose flex-col', className)}
      {...rest}>
      {!threadId && (
        <FormGroup>
          <Label htmlFor={recipientsId} className="sr-only">
            To
          </Label>

          <Search.Root className="flex flex-col gap-2">
            {({ setValue }) => (
              <>
                <Search.Box
                  ref={searchRef}
                  placeholder="To"
                  name="to"
                  id={recipientsId}
                  results={resolvedRecipients?.map(r => r.label)}
                  onConfirm={(value, e) => {
                    e.stopPropagation()

                    if (!resolvedRecipients?.length) return

                    flushSync(() => {
                      setRecipients(prev => [
                        ...prev.filter(u => u.label !== value),
                        ...resolvedRecipients,
                      ])

                      replace(pathname)
                      setValue('')
                    })

                    searchRef.current?.focus()
                  }}
                  onClear={() => {
                    queueMicrotask(() => {
                      searchRef.current?.focus()
                    })
                  }}
                />

                <Search.Results>
                  <Listbox.Root
                    selected={recipients.map(r => r.label)}
                    onSelect={(value, _, e) => {
                      e.preventDefault()

                      flushSync(() => {
                        setRecipients(prev => prev.filter(u => u.label !== value))
                      })

                      searchRef.current?.focus()
                    }}
                    className="flex-row items-center gap-2">
                    {recipients.map(u => (
                      <Listbox.Option
                        key={u.label}
                        value={u.label}
                        className="flex gap-1 rounded-full bg-keyline/80 px-2.5 py-1.5 text-sm">
                        {u.label}
                        <Icon name="x" size={10} />
                      </Listbox.Option>
                    ))}
                  </Listbox.Root>
                </Search.Results>
              </>
            )}
          </Search.Root>
        </FormGroup>
      )}

      <FormGroup className="mt-auto">
        <Label htmlFor={bodyId} className={cn(threadId && 'sr-only')}>
          Message
        </Label>
        <Textarea ref={bodyRef} id={bodyId} name="body" required style={{ minHeight: '200px' }} />
      </FormGroup>

      <FormGroup>
        <SubmitButton>
          {({ isPending }) => (
            <>
              Send
              {isPending && <Spinner />}
            </>
          )}
        </SubmitButton>
      </FormGroup>
    </form>
  )
}
