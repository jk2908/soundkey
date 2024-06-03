'use client'

import { useActionState, useEffect } from 'react'
import { verify } from '#/api/user/actions'

import { useToast } from '#/hooks/use-toast'

import { Spinner } from '#/components/global/spinner'
import { SubmitButton } from '#/components/global/submit-button'

export function SendVerificationEmailForm() {
  const [res, dispatch] = useActionState(verify, null)

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
      <SubmitButton>
        {({ isPending }) => (
          <>
            Resend email
            {isPending && <Spinner />}
          </>
        )}
      </SubmitButton>
    </form>
  )
}
