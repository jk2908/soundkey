import { type Project } from '#/lib/schema'
import { toLocaleFromTimestamp } from '#/utils/to-locale-from-timestamp'

import { ProjectPreview } from '#/components/authenticated/project/project-preview'
import { Scrollable } from '#/components/global/scrollable'

export function ProjectsList({ projects }: { projects: Project[] }) {
  return (
    <Scrollable scrollbars>
      <table className="sk-table" role="treegrid" aria-label="List of owned projects">
        <thead>
          <tr>
            <th className="min-w-[30ch]">Name</th>
            <th className="w-44">Artist</th>
            <th className="w-56">Created</th>
            <th className="w-56">Updated</th>
            <th className="w-32">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {projects.map(p => (
            <ProjectPreview
              key={p.projectId}
              project={{
                ...p,
                createdAt: toLocaleFromTimestamp(p.createdAt),
                updatedAt: toLocaleFromTimestamp(p.updatedAt),
              }}
            />
          ))}
        </tbody>
      </table>
    </Scrollable>
  )
}
