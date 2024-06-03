'use client'

import { useActionState, useEffect, useId } from 'react'
import { signup } from '#/api/user/actions'

import { useToast } from '#/hooks/use-toast'

import { FormGroup } from '#/components/global/form-group'
import { Input } from '#/components/global/input'
import { Label } from '#/components/global/label'
import { Spinner } from '#/components/global/spinner'
import { SubmitButton } from '#/components/global/submit-button'

export function SignupForm() {
  const emailId = useId()
  const passwordId = useId()
  const usernameId = useId()

  const [res, dispatch] = useActionState(signup, null)
  const { toast } = useToast()

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
          {({ isPending }) => (
            <>
              Signup
              {isPending && <Spinner />}
            </>
          )}
        </SubmitButton>
      </FormGroup>
    </form>
  )
}
