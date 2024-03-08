'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { send } from '@/actions/message/form'
import { flushSync, useFormState } from 'react-dom'

import type { ServerResponse } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'
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

export function SendMessageForm({
  userId,
  threadId,
  to,
}: {
  userId: string
  threadId?: string
  to?: string
}) {
  const recipientId = useId()
  const bodyId = useId()

  const [users, setUsers] = useState<string[]>([])
  const [state, dispatch] = useFormState(send.bind(null, userId, threadId), initialState)
  const { replace } = useRouter()
  const { toast } = useToast()
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!state.type) return

    toast({ ...state })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  return (
    <form action={dispatch}>
      <FormGroup>
        <Label htmlFor={recipientId} className="sr-only">
          To
        </Label>

        <Search.Root className="flex flex-col gap-2">
          {({ value, setValue }) => (
            <>
              <Search.Box
                ref={searchRef}
                placeholder="To"
                name="to"
                id={recipientId}
                results={to ? [to] : undefined}
                onConfirm={() => {
                  flushSync(() => {
                    setUsers(prev => [...new Set([...prev, value])])
                    replace('/messages/new')
                    setValue('')
                  })

                  searchRef.current?.focus()
                }}
              />

              <Search.Results>
                <Listbox.Root
                  onChange={value => {
                    flushSync(() => {
                      setUsers(prev => prev.filter(user => user !== value))
                    })

                    searchRef.current?.focus()
                  }}
                  persist>
                  <Listbox.Options className="flex">
                    {users.map(
                      user =>
                        user && (
                          <Listbox.Option
                            key={generateId()}
                            value={user}
                            className="flex gap-1 font-mono rounded-full py-1.5 px-2.5 bg-keyline/80 text-sm">
                            {user}
                            <Icon name="x" size={10} />
                          </Listbox.Option>
                        )
                    )}
                  </Listbox.Options>
                </Listbox.Root>
              </Search.Results>
            </>
          )}
        </Search.Root>
      </FormGroup>

      <FormGroup>
        <Label htmlFor={bodyId}>Message</Label>
        <Textarea id={bodyId} name="body" required className="h-20" />
      </FormGroup>

      <FormGroup>
        <SubmitButton>
          {({ pending }) => (
            <>
              {pending && <LoadingSpinner />}
              Send
            </>
          )}
        </SubmitButton>
      </FormGroup>
    </form>
  )
}
