'use client'

import { startTransition } from 'react'

import { sendMessage } from '@/lib/message-actions'
import { NewMessage } from '@/lib/schema'

export function SendMessageButton({ message }: { message: NewMessage }) {
  const onSendMessage = () => {
    try {
      startTransition(() => {
        sendMessage({ ...message })
      })

      console.log('Message sent')
    } catch (err) {
      console.log(err)
    }
  }

  return <button onClick={() => onSendMessage()}>Send</button>
}
