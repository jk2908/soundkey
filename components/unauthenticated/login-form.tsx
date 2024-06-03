'use client'

import { useEffect, useId, useActionState } from 'react'
import { login } from '#/api/user/actions'

import { useToast } from '#/hooks/use-toast'

import { Label } from '#/components/global/label'
import { FormGroup } from '#/components/global/form-group'
import { Input } from '#/components/global/input'
import { Spinner } from '#/components/global/spinner'
import { SubmitButton } from '#/components/global/submit-button'

export function LoginForm() {
  const emailId = useId()
  const passwordId = useId()

  const [res, dispatch] = useActionState(login, null)
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
          {({ isPending }) => (
            <>
              Login
              {isPending && <Spinner />}
            </>
          )}
        </SubmitButton>
      </FormGroup>
    </form>
  )
}
