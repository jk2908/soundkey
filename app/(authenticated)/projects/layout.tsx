import { ProjectNav } from '#/components/authenticated/project/project-nav'
import { BodyHeading } from '#/components/global/body-heading'
import { Scrollable } from '#/components/global/scrollable'
import { YSpace } from '#/components/global/y-space'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <YSpace className="flex grow flex-col">
      <BodyHeading level={1} className="sr-only">
        Projects
      </BodyHeading>

      <ProjectNav />

      {children}
    </YSpace>
  )
}
