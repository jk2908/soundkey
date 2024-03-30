'use client'
'use client'

import { useEffect } from 'react'
import { destroy } from '@/actions/message/state'
import { useFormState } from 'react-dom'

import { ServerResponse } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/global/button'
import { cn } from '@/utils/cn'

import { Icon } from '@/components/global/icon'

const initialState: ServerResponse = {
  type: undefined,
  message: null,
  status: undefined,
}

export function DeleteMessageButton({
  messageId,
  className,
}: {
  messageId: string
  className?: string
}) {
  const [state, dispatch] = useFormState(destroy.bind(null, messageId), initialState)
  const { toast } = useToast()

  useEffect(() => {
    if (!state.type) return

    toast({ ...state })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  return (
    <Button
      onClick={() => dispatch()}
      type="submit"
      variant="secondary"
      className={cn('flex flex-col items-center justify-center gap-2', className)}
      iconOnly>
      <Icon name="trash" size={14} title="Remove message" />
      <span className="sr-only">Remove message</span>
    </Button>
  )
}
