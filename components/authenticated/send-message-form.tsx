'use client'

import { useCallback, useEffect, useId, useState } from 'react'
import { send } from '@/actions/message/form'
import { useFormState } from 'react-dom'

import type { ServerResponse } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'

import { Label } from '@/components/authenticated/label'
import { Button } from '@/components/global/button'
import { FormGroup } from '@/components/global/form-group'
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
  const { toast } = useToast()

  useEffect(() => {
    if (!state.type) return

    toast({ ...state })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  const handleSearchChange = useCallback(
    (value: string) => {
      setUsers(prev =>
        value === to ? [...new Set([...prev, value])] : prev.filter(t => t !== value)
      )
    },
    [to]
  )

  console.log(to)

  return (
    <form action={dispatch}>
      <FormGroup>
        <Label htmlFor={recipientId} className="sr-only">
          To
        </Label>

        <Search.Root>
          {({ setValue }) => (
            <>
              <Search.Box placeholder="To" name="to" />

              <Search.Results>
                <Listbox.Root
                  onChange={(value: string) => {
                    //handleSearchChange(value)
                    //setValue('')
                  }}
                  persist>
                  <Listbox.Options className="flex">
                    {[to, ...users].map(
                      user =>
                        user && (
                          <Listbox.Option key={user} value={user}>
                            {user}
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
