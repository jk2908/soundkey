import { ThreadNav } from '@/components/authenticated/thread/thread-nav'
import { Heading } from '@/components/global/heading'
import { YSpace } from '@/components/global/y-space'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <YSpace className="flex grow flex-col">
      <Heading level={1} className="sr-only">
        Threads
      </Heading>

      <ThreadNav />

      {children}
    </YSpace>
  )
}
