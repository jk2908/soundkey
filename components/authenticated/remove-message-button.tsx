'use client'
'use client'

import { useEffect } from 'react'
import { remove } from '@/actions/message/form'
import { useFormState } from 'react-dom'

import { ServerResponse } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/utils/cn'

import { Icon } from '@/components/global/icon'

const initialState: ServerResponse = {
  type: undefined,
  message: null,
  status: undefined,
}

export function RemoveMessageButton({
  messageId,
  className,
}: {
  messageId: string
  className?: string
}) {
  const [state, dispatch] = useFormState(remove.bind(null, messageId), initialState)
  const { toast } = useToast()

  useEffect(() => {
    if (!state.type) return

    toast({ ...state })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  return (
    <form action={dispatch} className={cn(className)}>
      <button
        type="submit"
        style={{ width: '40px', height: '40px' }}
        className="flex flex-col items-center justify-center gap-2">
        <Icon name="trash" size={20} />
        <span className="sr-only">Delete message</span>
      </button>
    </form>
  )
}
