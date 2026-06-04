import { getProjects } from '@/lib/projects'
import { ProjectCard } from '@/components/projects/project-card'
import { EmptyState } from '@/components/projects/empty-state'

export default function ProjectsPage() {
  const projects = getProjects()

  return (
    <div className="min-h-screen pt-14">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="mb-8 text-4xl font-light text-foreground">Projects</h1>

        {projects.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
