'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { send } from '@/actions/message/form'
import { flushSync, useFormState } from 'react-dom'

import type { ServerResponse } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/utils/cn'
import { generateId } from '@/utils/generate-id'

import { Label } from '@/components/authenticated/label'
import { FormGroup } from '@/components/global/form-group'
import { Icon } from '@/components/global/icon'
import * as Listbox from '@/components/global/listbox'
import { LoadingSpinner } from '@/components/global/loading-spinner'
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
}: {
  senderId: string
  threadId?: string
  resolvedRecipients: ResolvedRecipient[] | []
}) {
  const recipientId = useId()
  const bodyId = useId()
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

    if (type === 'success' && payload && !threadId) {
      push(pathname.replace('new', payload.toString()))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, push])

  return (
    <form action={dispatch} className="flex h-full flex-col">
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
                          className="flex gap-1 rounded-full bg-keyline/80 px-2.5 py-1.5 font-mono text-sm">
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

      <FormGroup className="flex grow flex-col">
        <Label htmlFor={bodyId} className={cn(threadId && 'sr-only')}>
          Message
        </Label>
        <Textarea id={bodyId} name="body" required className="grow" />
      </FormGroup>

      <FormGroup>
        <SubmitButton>
          {({ pending }) => (
            <>
              Send
              {pending && <LoadingSpinner />}
            </>
          )}
        </SubmitButton>
      </FormGroup>
    </form>
  )
}
