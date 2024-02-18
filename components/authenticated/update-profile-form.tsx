'use client'

import { useEffect, useId } from 'react'
import { updateProfile } from '@/actions/profile'
import { useFormState } from 'react-dom'

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

export function UpdateProfileForm({
  userId,
  username,
}: {
  userId: string
  username: string | null
}) {
  const usernameId = useId()
  const [state, dispatch] = useFormState(updateProfile, initialState)
  const { toast } = useToast()

  useEffect(() => {
    if (!state.type) return

    toast({ ...state })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  return (
    <form action={dispatch}>
      <FormGroup>
        <Label htmlFor={usernameId}>Username</Label>
        <Input id={usernameId} type="text" placeholder={username ? username : 'Username'} />
      </FormGroup>

      <FormGroup>
        <SubmitButton className="mx-auto">
          {({ pending }) => (
            <>
              {pending && <LoadingSpinner />}
              Update
            </>
          )}
        </SubmitButton>
      </FormGroup>
    </form>
  )
}
