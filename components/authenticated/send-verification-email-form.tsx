'use client'

import { useEffect } from 'react'
import { verify } from '@/api/user/actions'
import { useFormState } from 'react-dom'

import type { ServerResponse } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'

import { Spinner } from '@/components/global/spinner'
import { SubmitButton } from '@/components/global/submit-button'

const initialState: ServerResponse = {
  type: undefined,
  message: null,
  status: undefined,
}

export function SendVerificationEmailForm() {
  const [state, dispatch] = useFormState(verify, initialState)

  const { toast } = useToast()

  useEffect(() => {
    if (!state.type) return

    toast({ ...state })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  return (
    <form action={dispatch}>
      <SubmitButton>
        {({ pending }) => (
          <>
            Resend email
            {pending && <Spinner />}
          </>
        )}
      </SubmitButton>
    </form>
  )
}
