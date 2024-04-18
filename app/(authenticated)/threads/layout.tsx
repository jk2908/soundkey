import { ThreadNav } from '@/components/authenticated/thread/thread-nav'
import { YSpace } from '@/components/global/y-space'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <YSpace className="flex grow flex-col">
      <ThreadNav />

      {children}
    </YSpace>
  )
}
