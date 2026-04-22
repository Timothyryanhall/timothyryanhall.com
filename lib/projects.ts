import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const DEFAULT_DIR = path.join(process.cwd(), 'content', 'projects')

export type ProjectType = 'embedded' | 'deployed' | 'repo'

export interface Project {
  slug: string
  title: string
  type: ProjectType
  description: string
  tech: string[]
  repo?: string
  url?: string
  featured: boolean
  body: string
}

interface GetProjectsOptions {
  featured?: boolean
  dir?: string
}

export function getProjects(options: GetProjectsOptions = {}): Project[] {
  const dir = options.dir ?? DEFAULT_DIR
  if (!fs.existsSync(dir)) return []

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))

  const projects = files.map((file) => {
    const slug = file.replace(/\.mdx$/, '')
    const raw = fs.readFileSync(path.join(dir, file), 'utf8')
    const { data, content } = matter(raw)

    return {
      slug,
      title: String(data.title ?? slug),
      type: (data.type ?? 'repo') as ProjectType,
      description: String(data.description ?? ''),
      tech: Array.isArray(data.tech) ? data.tech : [],
      repo: data.repo as string | undefined,
      url: data.url as string | undefined,
      featured: Boolean(data.featured),
      body: content,
    } satisfies Project
  })

  if (options.featured) return projects.filter((p) => p.featured)
  return projects
}
