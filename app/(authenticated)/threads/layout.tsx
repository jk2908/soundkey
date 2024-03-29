import { ThreadActionsMenu } from '@/components/authenticated/thread-actions-menu'
import { YSpace } from '@/components/global/y-space'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <YSpace className="flex grow flex-col">
      <ThreadActionsMenu />

      {children}
    </YSpace>
  )
}
