import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Code2 } from 'lucide-react'
import type { Project } from '@/lib/projects'

interface ProjectCardProps {
  project: Project
  onLaunch?: () => void
}

export function ProjectCard({ project, onLaunch }: ProjectCardProps) {
  return (
    <div className="flex flex-col rounded-lg border border-border bg-card p-6">
      <h3 className="mb-2 text-sm font-medium text-foreground">{project.title}</h3>

      <p className="mb-4 flex-1 text-xs leading-relaxed text-muted-foreground">
        {project.description}
      </p>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {project.tech.map((t) => (
          <Badge
            key={t}
            variant="secondary"
            className="bg-foreground/5 text-muted-foreground hover:bg-foreground/10"
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
        {project.url && (
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
