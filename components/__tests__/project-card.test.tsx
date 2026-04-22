import { render, screen } from '@testing-library/react'
import { ProjectCard } from '@/components/projects/project-card'
import type { Project } from '@/lib/projects'

const baseProject: Project = {
  slug: 'test-project',
  title: 'Test Project',
  type: 'repo',
  description: 'A test project description',
  tech: ['TypeScript', 'Node.js'],
  repo: 'https://github.com/test/project',
  featured: false,
  body: '',
}

describe('ProjectCard', () => {
  it('renders title and description', () => {
    render(<ProjectCard project={baseProject} />)
    expect(screen.getByText('Test Project')).toBeInTheDocument()
    expect(screen.getByText('A test project description')).toBeInTheDocument()
  })

  it('renders tech badges', () => {
    render(<ProjectCard project={baseProject} />)
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('Node.js')).toBeInTheDocument()
  })

  it('shows GitHub link for repo type', () => {
    render(<ProjectCard project={baseProject} />)
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      'https://github.com/test/project'
    )
  })

  it('shows live link for deployed type', () => {
    const deployed: Project = {
      ...baseProject,
      type: 'deployed',
      url: 'https://my-app.vercel.app',
    }
    render(<ProjectCard project={deployed} />)
    expect(screen.getByRole('link', { name: /live/i })).toHaveAttribute(
      'href',
      'https://my-app.vercel.app'
    )
  })

  it('shows Launch button for embedded type', () => {
    const embedded: Project = { ...baseProject, type: 'embedded' }
    render(<ProjectCard project={embedded} onLaunch={vi.fn()} />)
    expect(screen.getByRole('button', { name: /launch/i })).toBeInTheDocument()
  })
})
