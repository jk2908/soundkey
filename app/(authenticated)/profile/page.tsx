import { auth } from '@/lib/auth'

import { SendMessageButton } from '@/components/global/send-message.button'

export default async function Page() {
  const user = await auth()

  if (!user) {
    return
  }

  return (
    <SendMessageButton
      message={{
        content: 'Hello',
        to_user_id: [user?.userId],
        from_user_id: 'system',
        created_at: new Date().toISOString(),
      }}
    />
  )
}
