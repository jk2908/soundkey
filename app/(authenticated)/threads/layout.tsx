import { ThreadNav } from '#/components/authenticated/thread/thread-nav'
import { BodyHeading } from '#/components/global/body-heading'
import { YSpace } from '#/components/global/y-space'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <YSpace className="flex grow flex-col">
      <ThreadNav />

      <YSpace className="flex grow flex-col">{children}</YSpace>
    </YSpace>
  )
}
