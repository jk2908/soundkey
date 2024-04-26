'use client'

import { useEffect, useId, useActionState } from 'react'
import { signup } from '@/api/user/actions'

import { ServerResponse } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'

import { Label } from '@/components/global/label'
import { FormGroup } from '@/components/global/form-group'
import { Input } from '@/components/global/input'
import { Spinner } from '@/components/global/spinner'
import { SubmitButton } from '@/components/global/submit-button'

const initialState: ServerResponse = {
  type: undefined,
  message: null,
  status: undefined,
}

export function SignupForm() {
  const emailId = useId()
  const passwordId = useId()
  const usernameId = useId()

  const [state, dispatch] = useActionState(signup, initialState)
  const { toast } = useToast()

  useEffect(() => {
    if (!state.type) return

    toast({ ...state })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  return (
    <form action={dispatch} autoComplete="off">
      <FormGroup>
        <Label htmlFor={usernameId}>Username</Label>
        <Input id={usernameId} type="text" name="username" required />
      </FormGroup>

      <FormGroup>
        <Label htmlFor={emailId}>Email</Label>
        <Input id={emailId} type="email" name="email" required />
      </FormGroup>

      <FormGroup>
        <Label htmlFor={passwordId}>Password</Label>
        <Input
          id={passwordId}
          type="password"
          name="password"
          autoComplete="new-password"
          required
        />
      </FormGroup>

      <FormGroup>
        <SubmitButton>
          {({ pending }) => (
            <>
              Signup
              {pending && <Spinner />}
            </>
          )}
        </SubmitButton>
      </FormGroup>
    </form>
  )
}
