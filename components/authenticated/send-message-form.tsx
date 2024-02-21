'use client'

import { useEffect } from 'react'
import { send } from '@/actions/message/api'
import { useFormState } from 'react-dom'

import type { ServerResponse } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'

import { LoadingSpinner } from '@/components/global/loading-spinner'
import { SubmitButton } from '@/components/global/submit-button'

const initialState: ServerResponse = {
  type: undefined,
  message: null,
  status: undefined,
}

export function SendMessageForm({ userId, threadId }: { userId: string; threadId?: string }) {
  const [state, dispatch] = useFormState(send.bind(null, userId, threadId), initialState)
}
