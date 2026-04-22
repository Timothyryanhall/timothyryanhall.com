import { Suspense } from 'react'
import { getProjects } from '@/lib/projects'
import { ProjectCard } from '@/components/projects/project-card'
import { ProjectFilter } from '@/components/projects/project-filter'
import { EmptyState } from '@/components/projects/empty-state'
import type { ProjectType } from '@/lib/projects'

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const { type } = await searchParams
  const all = getProjects()
  const activeFilter = type ?? 'all'

  const filtered =
    activeFilter === 'all'
      ? all
      : all.filter((p) => p.type === (activeFilter as ProjectType))

  return (
    <div className="min-h-screen pt-14">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-accent">
          Projects
        </p>
        <h1 className="mb-8 text-4xl font-light text-white">What I&apos;m Building</h1>

        <Suspense>
          <div className="mb-8">
            <ProjectFilter active={activeFilter} />
          </div>
        </Suspense>

        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
