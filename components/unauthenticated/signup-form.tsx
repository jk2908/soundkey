'use client'

import { useEffect, experimental_useEffectEvent as useEffectEvent, useId } from 'react'
import { useFormState } from 'react-dom'

import { signup } from '@/lib/actions'
import { ActionResponse } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'

import { FormGroup } from '@/components/global/form-group'
import { Input } from '@/components/global/input'
import { Label } from '@/components/global/label'
import { SubmitButton } from '@/components/global/submit-button'
import { LoadingSpinner } from '@/components/global/loading-spinner'

const initialState: ActionResponse = {
  type: undefined,
  message: null,
  status: undefined,
}

export function SignupForm() {
  const emailId = useId()
  const passwordId = useId()

  const [state, dispatch] = useFormState(signup, initialState)

  const { toast } = useToast()

  const onStateChange = useEffectEvent((state: ActionResponse) => {
    if (!state.type) return

    toast({ ...state, duration: null })
  })

  useEffect(() => {
    onStateChange(state)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  return (
    <form action={dispatch}>
      <FormGroup>
        <Label htmlFor={emailId}>Email</Label>
        <Input id={emailId} type="email" name="email" required />
      </FormGroup>

      <FormGroup>
        <Label htmlFor={passwordId}>Password</Label>
        <Input id={passwordId} type="password" name="password" required />
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
