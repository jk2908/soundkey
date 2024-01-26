'use client'

import { useEffect, experimental_useEffectEvent as useEffectEvent } from 'react'
import { useFormState } from 'react-dom'

import { verifyEmail } from '@/lib/auth-actions'
import type { ServerResponse } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'

import { LoadingSpinner } from '@/components/global/loading-spinner'
import { SubmitButton } from '@/components/global/submit-button'

const initialState: ServerResponse = {
  type: undefined,
  message: null,
  status: undefined,
}

export function SendVerificationEmailForm() {
  const [state, dispatch] = useFormState(verifyEmail, initialState)

  const { toast } = useToast()

  const onStateChange = useEffectEvent((state: ServerResponse) => {
    if (!state.type) return

    toast({ ...state })
  })

  useEffect(() => {
    onStateChange(state)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  return (
    <form action={dispatch}>
      <SubmitButton>
        {({ pending }) => (
          <>
            {pending && <LoadingSpinner />}
            Resend email
          </>
        )}
      </SubmitButton>
    </form>
  )
}
