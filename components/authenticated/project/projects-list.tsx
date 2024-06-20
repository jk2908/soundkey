import { Suspense } from 'react'

import { type Project } from '#/lib/schema'
import { toLocaleFromTimestamp } from '#/utils/to-locale-from-timestamp'

import { ProjectPreview } from '#/components/authenticated/project/project-preview'
import { SKTableRowLoader } from '#/components/global/sk-table-row-loader'

export function ProjectsList({ projects }: { projects: Project[] }) {
  return (
    <div className="sk-scrollbar flex overflow-x-auto">
      <table className="sk-table" role="treegrid" aria-label="List of owned projects">
        <thead>
          <tr>
            <th>Name</th>
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
    </div>
  )
}
