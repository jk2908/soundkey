import { MessageActions } from '@/components/authenticated/message-actions'
import { YSpace } from '@/components/global/y-space'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <YSpace className="flex h-full flex-col">
      <MessageActions />

      {children}
    </YSpace>
  )
}
