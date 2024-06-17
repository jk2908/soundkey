import { ProjectNav } from '#/components/authenticated/project/project-nav'
import { YSpace } from '#/components/global/y-space'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <YSpace className="flex grow flex-col">
      <ProjectNav />

      <YSpace className="flex grow flex-col">{children}</YSpace>
    </YSpace>
  )
}
