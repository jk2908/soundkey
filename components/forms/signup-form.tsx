'use client'

import { useEffect, useId } from 'react'
import { useFormState } from 'react-dom'

import { signup } from '@/lib/actions'
import { ActionResponse } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'

import { Form } from '@/components/forms/form'
import { FormGroup } from '@/components/forms/form-group'
import { Input } from '@/components/forms/input'
import { Label } from '@/components/forms/label'
import { SubmitButton } from '@/components/forms/submit-button'
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

  useEffect(() => {
    const { type, message, status } = state

    if (!type) return

    toast({ type, message: `${message} / ${status}` })
  }, [state, toast])

  return (
    <Form action={dispatch}>
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
    </Form>
  )
}
