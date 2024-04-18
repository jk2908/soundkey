'use client'

import { useEffect } from 'react'
import { destroy } from '@/actions/message/state'
import { useFormState } from 'react-dom'

import { ServerResponse } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'

import { Button, type Props } from '@/components/global/button'

const initialState: ServerResponse = {
  type: undefined,
  message: null,
  status: undefined,
}

export function DeleteMessageButton<E extends React.ElementType = 'button'>({
  children,
  messageId,
  ...rest
}: {
  children: React.ReactNode
  messageId: string
} & Omit<Props<E>, 'as'>) {
  const [state, dispatch] = useFormState(destroy.bind(null, messageId), initialState)
  const { toast } = useToast()

  useEffect(() => {
    if (!state.type) return

    toast({ ...state })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  return (
    <Button onClick={() => dispatch()} {...rest}>
      {children}
    </Button>
  )
}
