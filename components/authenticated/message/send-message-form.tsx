'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { send } from '@/actions/message/state'
import { flushSync, useFormState } from 'react-dom'

import type { ServerResponse } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/utils/cn'
import { generateId } from '@/utils/generate-id'

import { Label } from '@/components/global/label'
import { FormGroup } from '@/components/global/form-group'
import { Icon } from '@/components/global/icon'
import * as Listbox from '@/components/global/listbox'
import { Spinner } from '@/components/global/spinner'
import * as Search from '@/components/global/search'
import { SubmitButton } from '@/components/global/submit-button'
import { Textarea } from '@/components/global/textarea'

const initialState: ServerResponse = {
  type: undefined,
  message: null,
  status: undefined,
}

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
}: {
  senderId: string
  threadId?: string
  resolvedRecipients: ResolvedRecipient[] | []
  forceScroll?: boolean
  className?: string
}) {
  const ref = useRef<HTMLFormElement>(null)
  const recipientId = useId()
  const bodyId = useId()
  const bodyRef = useRef<HTMLTextAreaElement>(null)
  const [recipients, setRecipients] = useState<ResolvedRecipient[] | []>(resolvedRecipients)

  const [state, dispatch] = useFormState(
    send.bind(
      null,
      senderId,
      threadId,
      recipients.map(r => r.userId)
    ),
    initialState
  )

  const { replace, push } = useRouter()
  const { toast } = useToast()
  const searchRef = useRef<HTMLInputElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const { type, payload } = state

    if (!type) return

    toast({ ...state })

    if (type !== 'success') return

    if (payload && !threadId) {
      push(pathname.replace('new', payload.toString()))
    }

    if (bodyRef.current) {
      bodyRef.current.value = ''
      bodyRef.current.focus()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, push])

  useEffect(() => {
    if (!forceScroll || state.type !== 'success') return

    setTimeout(() => {
      if (!ref.current) return

      scrollTo({
        top: ref.current?.getBoundingClientRect().bottom,
        behavior: 'smooth',
      })
    }, 1000)
  }, [forceScroll, state])

  return (
    <form ref={ref} action={dispatch} className={cn('flex flex-col', className)}>
      {!threadId && (
        <FormGroup>
          <Label htmlFor={recipientId} className="sr-only">
            To
          </Label>

          <Search.Root className="flex flex-col gap-2">
            {({ setValue }) => (
              <>
                <Search.Box
                  ref={searchRef}
                  placeholder="To"
                  name="to"
                  id={recipientId}
                  results={
                    resolvedRecipients?.length ? resolvedRecipients.map(r => r.label) : undefined
                  }
                  onConfirm={() => {
                    if (!resolvedRecipients || !resolvedRecipients.length) return

                    flushSync(() => {
                      setRecipients(prev => [...new Set([...prev, ...resolvedRecipients])])
                      replace(pathname)
                      setValue('')
                    })

                    searchRef.current?.focus()
                  }}
                />

                <Search.Results>
                  <Listbox.Root
                    selected={recipients.map(r => r.label)}
                    onSelect={value => {
                      flushSync(() => {
                        setRecipients(prev => prev.filter(u => u.label !== value))
                      })

                      searchRef.current?.focus()
                    }}
                    persist>
                    <Listbox.Options className="flex items-center gap-2">
                      {recipients.map(u => (
                        <Listbox.Option
                          key={generateId()}
                          value={u.label}
                          className="flex gap-1 rounded-full bg-keyline/80 px-2.5 py-1.5 text-sm">
                          {u.label}
                          <Icon name="x" size={10} />
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
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
        <Textarea
          ref={bodyRef}
          id={bodyId}
          name="body"
          required
          className="max-w-prose bg-keyline"
          style={{ minHeight: '200px' }}
        />
      </FormGroup>

      <FormGroup>
        <SubmitButton>
          {({ pending }) => (
            <>
              Send
              {pending && <Spinner />}
            </>
          )}
        </SubmitButton>
      </FormGroup>
    </form>
  )
}
