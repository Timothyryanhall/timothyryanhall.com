import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Code2 } from 'lucide-react'
import type { Project } from '@/lib/projects'

interface ProjectCardProps {
  project: Project
  onLaunch?: () => void
}

export function ProjectCard({ project, onLaunch }: ProjectCardProps) {
  const typeLabel: Record<Project['type'], string> = {
    embedded: 'Demo',
    deployed: 'Live',
    repo: 'Repo',
  }

  return (
    <div className="flex flex-col rounded-lg border border-white/5 bg-white/[0.02] p-6">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
            {typeLabel[project.type]}
          </span>
          <h3 className="text-sm font-medium text-white">{project.title}</h3>
        </div>
      </div>

      <p className="mb-4 flex-1 text-xs leading-relaxed text-white/50">
        {project.description}
      </p>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {project.tech.map((t) => (
          <Badge
            key={t}
            variant="secondary"
            className="bg-white/5 text-white/40 hover:bg-white/10"
          >
            {t}
          </Badge>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {project.type === 'embedded' && (
          <Button size="sm" onClick={onLaunch} aria-label="Launch demo">
            Launch
          </Button>
        )}
        {project.type === 'deployed' && project.url && (
          <Button
            size="sm"
            render={
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Live site"
              />
            }
          >
            <ExternalLink size={12} className="mr-1.5" />
            Live
          </Button>
        )}
        {project.repo && (
          <Button
            size="sm"
            variant="outline"
            render={
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub repository"
              />
            }
          >
            <Code2 size={12} className="mr-1.5" />
            GitHub
          </Button>
        )}
      </div>
    </div>
  )
}
