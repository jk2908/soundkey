import { ThreadNav } from '#/components/authenticated/thread/thread-nav'
import { BodyHeading } from '#/components/global/body-heading'
import { YSpace } from '#/components/global/y-space'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <YSpace className="flex grow flex-col">
      <BodyHeading level={1} className="sr-only">
        Threads
      </BodyHeading>

      <ThreadNav />

      {children}
    </YSpace>
  )
}
