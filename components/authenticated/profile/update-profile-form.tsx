'use client'

import { useActionState, useEffect, useId, useRef } from 'react'
import { update } from '#/api/profile/actions'

import { ServerResponse } from '#/lib/types'
import { useToast } from '#/hooks/use-toast'

import { FormGroup } from '#/components/global/form-group'
import { Input } from '#/components/global/input'
import { Label } from '#/components/global/label'
import { Spinner } from '#/components/global/spinner'
import { SubmitButton } from '#/components/global/submit-button'

const initialState: ServerResponse = {
  type: undefined,
  message: null,
  status: undefined,
}

export function UpdateProfileForm({
  userId,
  username,
  bio,
}: {
  userId: string
  username: string | null
  bio: string | null
}) {
  const ref = useRef<HTMLFormElement>(null)

  const usernameId = useId()
  const bioId = useId()

  const [state, dispatch] = useActionState(update.bind(null, userId), initialState)
  const { toast } = useToast()

  useEffect(() => {
    if (!state.type) return

    toast({ ...state })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  return (
    <form key={state?.key} ref={ref} action={dispatch}>
      <FormGroup>
        <Label htmlFor={usernameId}>Username</Label>
        <Input
          id={usernameId}
          name="username"
          type="text"
          defaultValue={username ? username : undefined}
          placeholder={!username ? 'No username set' : undefined}
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor={bioId}>Bio</Label>
        <Input
          id={bioId}
          name="bio"
          type="text"
          defaultValue={bio ? bio : undefined}
          placeholder={!bio ? 'No bio set' : undefined}
        />
      </FormGroup>

      <FormGroup>
        <SubmitButton>
          {({ pending }) => (
            <>
              Update
              {pending && <Spinner />}
            </>
          )}
        </SubmitButton>
      </FormGroup>
    </form>
  )
}
