'use client'

import { useEffect, useId } from 'react'
import { useFormState } from 'react-dom'

import { signup } from '@/actions/user'
import { ServerResponse } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'

import { FormGroup } from '@/components/global/form-group'
import { Input } from '@/components/global/input'
import { Label } from '@/components/global/label'
import { LoadingSpinner } from '@/components/global/loading-spinner'
import { SubmitButton } from '@/components/global/submit-button'

const initialState: ServerResponse = {
  type: undefined,
  message: null,
  status: undefined,
}

export function SignupForm() {
  const emailId = useId()
  const passwordId = useId()

  const [state, dispatch] = useFormState(signup, initialState)

  const { toast } = useToast()

  useEffect(() => {
    if (!state.type) return

    toast({ ...state })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  return (
    <form action={dispatch} autoComplete="off">
      <input type="hidden" name="foo" />

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
              {pending && <LoadingSpinner />}
              Signup
            </>
          )}
        </SubmitButton>
      </FormGroup>
    </form>
  )
}
