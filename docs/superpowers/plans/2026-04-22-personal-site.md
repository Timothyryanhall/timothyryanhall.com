# Personal Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy timothyryanhall.com — a personal site for a software engineer and musician, serving both professional employers and music gig bookers.

**Architecture:** Next.js 14 App Router with static generation. All content pulled at build time: projects from MDX files, work history from a TypeScript config, music playlists and videos from the YouTube Data API v3. shadcn/ui provides component primitives; Tailwind CSS with CSS variable design tokens provides the dark visual theme.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, next-mdx-remote, gray-matter, Vitest, React Testing Library, YouTube Data API v3

---

## File Map

```
/app
  layout.tsx                         root layout + Nav mount
  globals.css                        CSS variable design tokens
  page.tsx                           homepage (server component)
  about/page.tsx                     about page (server component)
  projects/page.tsx                  projects page (server component)
  music/page.tsx                     music page (server component)

/components
  /layout
    nav.tsx                          top nav bar (client component)
  /home
    hero.tsx                         full-viewport hero section
    preview-cards.tsx                three preview cards below fold
  /about
    employment-timeline.tsx          work history list
    achievement-list.tsx             Fulbright, Yamaha, etc.
  /projects
    project-card.tsx                 renders embedded/deployed/repo cards
    project-filter.tsx               filter tabs (client component)
    empty-state.tsx                  shown when no projects exist
    embedded-overlay.tsx             Dialog overlay for live demos
  /music
    music-client.tsx                 client wrapper (tab state + lightbox)
    playlist-tabs.tsx                horizontal scrollable tab row
    video-grid.tsx                   responsive video grid
    video-card.tsx                   thumbnail + title
    video-lightbox.tsx               inline YouTube embed Dialog
    booking-section.tsx              instruments, styles, contact
  /demos                             embedded demo components (empty to start)
  /ui                                shadcn/ui generated components

/lib
  youtube.ts                         YouTube API fetch + sort logic
  projects.ts                        MDX frontmatter parsing

/content
  work.ts                            employment history typed array
  projects/                          one .mdx file per project (empty to start)

tailwind.config.ts                   design tokens (extends shadcn/ui vars)
vitest.config.ts
vitest.setup.ts
.env.local                           YOUTUBE_API_KEY, YOUTUBE_CHANNEL_ID
```

---

## Task 1: Initialize Next.js project

**Files:**
- Modify: `tailwind.config.ts` (replaced after scaffold)
- Modify: `app/globals.css` (replaced after scaffold)
- Create: `.env.local`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`

- [ ] **Step 1: Scaffold Next.js app in current directory**

Run from `/Users/timothyhall/personal-site`:
```bash
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --yes
```
Expected: Next.js scaffolded. `package.json`, `app/`, `public/`, `tailwind.config.ts`, `tsconfig.json` created. Existing `docs/` and `.gitignore` are left intact.

- [ ] **Step 2: Install additional dependencies**

```bash
npm install next-mdx-remote gray-matter lucide-react
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @types/testing-library__jest-dom
```
Expected: no errors; `node_modules/` populated.

- [ ] **Step 3: Replace `tailwind.config.ts` with design tokens**

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        border: 'hsl(var(--border))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

- [ ] **Step 4: Replace `app/globals.css` with custom theme**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Dark & Sharp theme */
    --background: 0 0% 6%;         /* #0f0f0f */
    --foreground: 0 0% 98%;
    --card: 0 0% 8%;
    --card-foreground: 0 0% 98%;
    --primary: 72 100% 50%;        /* #c8ff00 electric lime */
    --primary-foreground: 0 0% 0%;
    --muted: 0 0% 10%;
    --muted-foreground: 0 0% 45%;
    --accent: 72 100% 50%;
    --accent-foreground: 0 0% 0%;
    --border: 0 0% 12%;
    --input: 0 0% 12%;
    --ring: 72 100% 50%;
    --radius: 0.375rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    background-color: #0f0f0f;
    @apply text-foreground;
    -webkit-font-smoothing: antialiased;
  }
  /* Hide scrollbar for horizontal scroll containers */
  .scrollbar-none {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-none::-webkit-scrollbar {
    display: none;
  }
}
```

- [ ] **Step 5: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
    },
  },
})
```

- [ ] **Step 6: Create `vitest.setup.ts`**

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 7: Add test script to `package.json`**

In `package.json`, add to `"scripts"`:
```json
"test": "vitest",
"test:run": "vitest run"
```

- [ ] **Step 8: Create `.env.local`**

```
YOUTUBE_API_KEY=
YOUTUBE_CHANNEL_ID=
```

Leave values empty for now — filled in Task 13.

- [ ] **Step 9: Create `content/projects/` directory with a `.gitkeep`**

```bash
mkdir -p content/projects && touch content/projects/.gitkeep
```

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: initialize Next.js project with design tokens and Vitest"
```

---

## Task 2: Install shadcn/ui

**Files:**
- Create: `components/ui/button.tsx`, `card.tsx`, `dialog.tsx`, `badge.tsx`
- Modify: `components.json` (generated by shadcn)

- [ ] **Step 1: Run shadcn/ui init**

```bash
npx shadcn@latest init --defaults
```
When prompted:
- Style: Default
- Base color: Neutral
- CSS variables: Yes

Expected: `components/ui/utils.ts` and `lib/utils.ts` created. `components.json` created.

- [ ] **Step 2: Add required components**

```bash
npx shadcn@latest add button card dialog badge
```
Expected: `components/ui/button.tsx`, `card.tsx`, `dialog.tsx`, `badge.tsx` created.

- [ ] **Step 3: Verify the Button renders with accent color**

Create `app/test-ui/page.tsx` temporarily:
```tsx
import { Button } from '@/components/ui/button'

export default function TestUI() {
  return (
    <div className="p-8 bg-background min-h-screen flex gap-4 items-start">
      <Button>Primary</Button>
      <Button variant="outline">Outline</Button>
    </div>
  )
}
```

Run `npm run dev`, open http://localhost:3000/test-ui. Expected: dark background, primary button in lime/green color.

- [ ] **Step 4: Delete test page**

```bash
rm -rf app/test-ui
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add shadcn/ui with button, card, dialog, badge"
```

---

## Task 3: Root layout and Nav

**Files:**
- Modify: `app/layout.tsx`
- Create: `components/layout/nav.tsx`
- Create: `components/__tests__/nav.test.tsx`

- [ ] **Step 1: Write the failing Nav test**

Create `components/__tests__/nav.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { Nav } from '@/components/layout/nav'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

describe('Nav', () => {
  it('renders site name and all nav links', () => {
    render(<Nav />)
    expect(screen.getByText('Timothy Hall')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about')
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects')
    expect(screen.getByRole('link', { name: 'Music' })).toHaveAttribute('href', '/music')
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toBeInTheDocument()
  })

  it('highlights the active link', () => {
    vi.mocked(require('next/navigation').usePathname).mockReturnValue('/about')
    render(<Nav />)
    const aboutLink = screen.getByRole('link', { name: 'About' })
    expect(aboutLink).toHaveClass('text-white')
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm run test:run -- components/__tests__/nav.test.tsx
```
Expected: FAIL — `Nav` not found.

- [ ] **Step 3: Create `components/layout/nav.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Linkedin } from 'lucide-react'

const NAV_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/music', label: 'Music' },
]

export function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-sm">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-sm font-bold uppercase tracking-widest text-white"
        >
          Timothy Hall
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm transition-colors ${
                pathname.startsWith(href)
                  ? 'text-white'
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              {label}
            </Link>
          ))}
          <a
            href="https://www.linkedin.com/in/timothyryanhall/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-white/40 transition-colors hover:text-white/80"
          >
            <Linkedin size={16} />
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="flex flex-col gap-1.5 p-2 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span
            className={`block h-px w-5 bg-white/60 transition-transform ${
              open ? 'translate-y-2 rotate-45' : ''
            }`}
          />
          <span
            className={`block h-px w-5 bg-white/60 transition-opacity ${
              open ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block h-px w-5 bg-white/60 transition-transform ${
              open ? '-translate-y-2 -rotate-45' : ''
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/5 bg-background/95 px-6 py-4 md:hidden">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block py-3 text-sm text-white/60 hover:text-white"
            >
              {label}
            </Link>
          ))}
          <a
            href="https://www.linkedin.com/in/timothyryanhall/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 py-3 text-sm text-white/60 hover:text-white"
          >
            <Linkedin size={14} />
            LinkedIn
          </a>
        </div>
      )}
    </header>
  )
}
```

- [ ] **Step 4: Update `app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { Nav } from '@/components/layout/nav'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: 'Timothy Hall',
  description:
    'Software engineer and musician based in Boston.',
  openGraph: {
    title: 'Timothy Hall',
    description: 'Software engineer and musician based in Boston.',
    url: 'https://timothyryanhall.com',
    siteName: 'Timothy Hall',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="bg-background text-white antialiased">
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  )
}
```

- [ ] **Step 5: Run tests — expect pass**

```bash
npm run test:run -- components/__tests__/nav.test.tsx
```
Expected: 2 passing.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: root layout and Nav component"
```

---

## Task 4: Homepage

**Files:**
- Create: `components/home/hero.tsx`
- Create: `components/home/preview-cards.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create `components/home/hero.tsx`**

```tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="flex min-h-screen flex-col justify-center px-6 pt-14">
      <div className="mx-auto w-full max-w-5xl">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-accent">
          Software Engineer · Musician
        </p>
        <h1 className="mb-6 text-5xl font-light tracking-tight text-white sm:text-7xl">
          Timothy Hall
        </h1>
        <p className="mb-10 max-w-xl text-base leading-relaxed text-white/50">
          I build software by day and play music by night — and I approach both the
          same way: learn everything, commit to nothing too early, ship often.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <Link href="/projects">View Projects</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/music">Watch Music</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create `components/home/preview-cards.tsx`**

```tsx
import Link from 'next/link'
import type { Project } from '@/lib/projects'
import type { Video } from '@/lib/youtube'

interface PreviewCardsProps {
  featuredProject: Project | null
  latestVideo: Video | null
  latestRepo: Project | null
}

export function PreviewCards({
  featuredProject,
  latestVideo,
  latestRepo,
}: PreviewCardsProps) {
  const cards = [
    {
      label: 'Latest Project',
      href: '/projects',
      title: featuredProject?.title ?? null,
      subtitle: featuredProject?.description ?? null,
    },
    {
      label: 'Latest Music',
      href: '/music',
      title: latestVideo?.title ?? null,
      subtitle: 'Watch on Music page →',
    },
    {
      label: 'Latest Experiment',
      href: '/projects',
      title: latestRepo?.title ?? null,
      subtitle: latestRepo?.description ?? null,
    },
  ]

  return (
    <section className="px-6 pb-24">
      <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
        {cards.map(({ label, href, title, subtitle }) => (
          <Link
            key={label}
            href={href}
            className="group rounded-lg border border-white/5 bg-white/[0.02] p-6 transition-colors hover:border-accent/30 hover:bg-white/[0.04]"
          >
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
              {label}
            </p>
            {title ? (
              <>
                <p className="text-sm font-medium text-white line-clamp-2">{title}</p>
                {subtitle && (
                  <p className="mt-1 text-xs text-white/40 line-clamp-2">{subtitle}</p>
                )}
              </>
            ) : (
              <p className="text-sm text-white/25">Coming soon</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Update `app/page.tsx`**

```tsx
import { Hero } from '@/components/home/hero'
import { PreviewCards } from '@/components/home/preview-cards'
import { getProjects } from '@/lib/projects'

export default async function HomePage() {
  const featured = getProjects({ featured: true })
  const repos = getProjects().filter((p) => p.type === 'repo')

  const featuredProject = featured[0] ?? null
  const latestRepo = repos[0] ?? null

  // YouTube: fetch lazily — will be populated once YOUTUBE_CHANNEL_ID is set
  let latestVideo = null
  if (process.env.YOUTUBE_CHANNEL_ID && process.env.YOUTUBE_API_KEY) {
    const { getPlaylists, getPlaylistVideos } = await import('@/lib/youtube')
    const playlists = await getPlaylists()
    if (playlists.length > 0) {
      const videos = await getPlaylistVideos(playlists[0].id, 1)
      latestVideo = videos[0] ?? null
    }
  }

  return (
    <>
      <Hero />
      <PreviewCards
        featuredProject={featuredProject}
        latestVideo={latestVideo}
        latestRepo={latestRepo}
      />
    </>
  )
}
```

- [ ] **Step 4: Smoke-test in browser**

```bash
npm run dev
```
Open http://localhost:3000. Expected: dark background, hero text visible, three empty preview cards with "Coming soon".

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: homepage with hero and preview cards"
```

---

## Task 5: Project content model and parsing utility

**Files:**
- Create: `lib/projects.ts`
- Create: `lib/__tests__/projects.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `lib/__tests__/projects.test.ts`:
```ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fs from 'fs'
import path from 'path'

const FIXTURE_DIR = path.join(process.cwd(), 'content', 'projects', '__test_fixtures__')

beforeAll(() => {
  fs.mkdirSync(FIXTURE_DIR, { recursive: true })
  fs.writeFileSync(
    path.join(FIXTURE_DIR, 'sample-repo.mdx'),
    `---
title: Sample Repo
type: repo
description: A test project
tech: [TypeScript, Node.js]
repo: https://github.com/test/sample
featured: false
---

Some body content.
`
  )
  fs.writeFileSync(
    path.join(FIXTURE_DIR, 'featured-demo.mdx'),
    `---
title: Featured Demo
type: embedded
description: An embedded demo
tech: [React]
featured: true
---
`
  )
})

afterAll(() => {
  fs.rmSync(FIXTURE_DIR, { recursive: true, force: true })
})

describe('getProjects', () => {
  it('returns all projects parsed from MDX frontmatter', async () => {
    const { getProjects } = await import('../projects')
    const projects = getProjects({ dir: FIXTURE_DIR })
    expect(projects).toHaveLength(2)
  })

  it('returns only featured projects when option is set', async () => {
    const { getProjects } = await import('../projects')
    const projects = getProjects({ featured: true, dir: FIXTURE_DIR })
    expect(projects).toHaveLength(1)
    expect(projects[0].title).toBe('Featured Demo')
  })

  it('parses tech array correctly', async () => {
    const { getProjects } = await import('../projects')
    const projects = getProjects({ dir: FIXTURE_DIR })
    const repo = projects.find((p) => p.slug === 'sample-repo')
    expect(repo?.tech).toEqual(['TypeScript', 'Node.js'])
  })

  it('returns empty array when directory is empty or missing', async () => {
    const { getProjects } = await import('../projects')
    const projects = getProjects({ dir: '/nonexistent/path' })
    expect(projects).toEqual([])
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm run test:run -- lib/__tests__/projects.test.ts
```
Expected: FAIL — `getProjects` not found.

- [ ] **Step 3: Create `lib/projects.ts`**

```ts
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
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npm run test:run -- lib/__tests__/projects.test.ts
```
Expected: 4 passing.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: project content model and MDX parsing utility"
```

---

## Task 6: Projects page

**Files:**
- Create: `components/projects/project-card.tsx`
- Create: `components/projects/project-filter.tsx`
- Create: `components/projects/empty-state.tsx`
- Create: `components/projects/embedded-overlay.tsx`
- Create: `components/__tests__/project-card.test.tsx`
- Modify: `app/projects/page.tsx`

- [ ] **Step 1: Write failing ProjectCard test**

Create `components/__tests__/project-card.test.tsx`:
```tsx
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
```

- [ ] **Step 2: Run test — confirm it fails**

```bash
npm run test:run -- components/__tests__/project-card.test.tsx
```
Expected: FAIL.

- [ ] **Step 3: Create `components/projects/project-card.tsx`**

```tsx
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Github } from 'lucide-react'
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
          <Button size="sm" asChild>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Live site"
            >
              <ExternalLink size={12} className="mr-1.5" />
              Live
            </a>
          </Button>
        )}
        {project.repo && (
          <Button size="sm" variant="outline" asChild>
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository"
            >
              <Github size={12} className="mr-1.5" />
              GitHub
            </a>
          </Button>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create `components/projects/empty-state.tsx`**

```tsx
export function EmptyState() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
        Projects
      </p>
      <p className="text-sm text-white/30">More coming soon.</p>
    </div>
  )
}
```

- [ ] **Step 5: Create `components/projects/project-filter.tsx`**

```tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import type { ProjectType } from '@/lib/projects'

const FILTERS: Array<{ label: string; value: ProjectType | 'all' }> = [
  { label: 'All', value: 'all' },
  { label: 'Embedded', value: 'embedded' },
  { label: 'Deployed', value: 'deployed' },
  { label: 'Repos', value: 'repo' },
]

export function ProjectFilter({ active }: { active: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function setFilter(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') {
      params.delete('type')
    } else {
      params.set('type', value)
    }
    router.replace(`/projects?${params.toString()}`)
  }

  return (
    <div className="flex gap-2">
      {FILTERS.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => setFilter(value)}
          className={`rounded-sm px-4 py-1.5 text-xs font-medium tracking-wide transition-colors ${
            active === value || (active === '' && value === 'all')
              ? 'bg-accent text-black'
              : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 6: Create `components/projects/embedded-overlay.tsx`**

```tsx
'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { ComponentType } from 'react'

interface EmbeddedOverlayProps {
  title: string
  component: ComponentType | null
  onClose: () => void
}

export function EmbeddedOverlay({
  title,
  component: Demo,
  onClose,
}: EmbeddedOverlayProps) {
  return (
    <Dialog open={Demo !== null} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-3xl border-white/10 bg-card">
        <DialogHeader>
          <DialogTitle className="text-white">{title}</DialogTitle>
        </DialogHeader>
        <div className="min-h-[300px]">
          {Demo && <Demo />}
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

- [ ] **Step 7: Create `app/projects/page.tsx`**

```tsx
import { Suspense } from 'react'
import { getProjects } from '@/lib/projects'
import { ProjectCard } from '@/components/projects/project-card'
import { ProjectFilter } from '@/components/projects/project-filter'
import { EmptyState } from '@/components/projects/empty-state'
import type { ProjectType } from '@/lib/projects'

interface PageProps {
  searchParams: { type?: string }
}

export default async function ProjectsPage({ searchParams }: PageProps) {
  const all = getProjects()
  const activeFilter = searchParams.type ?? 'all'

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
```

- [ ] **Step 8: Run tests — expect pass**

```bash
npm run test:run -- components/__tests__/project-card.test.tsx
```
Expected: 5 passing.

- [ ] **Step 9: Smoke-test in browser**

Visit http://localhost:3000/projects. Expected: dark page with "Projects" header, filter tabs, empty state.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: projects page with card types, filter tabs, and empty state"
```

---

## Task 7: About page

**Files:**
- Create: `content/work.ts`
- Create: `components/about/employment-timeline.tsx`
- Create: `components/about/achievement-list.tsx`
- Create: `app/about/page.tsx`

- [ ] **Step 1: Create `content/work.ts`**

```ts
export interface WorkEntry {
  company: string
  role: string
  start: string
  end: string
  location: string
  tech: string[]
}

export interface Achievement {
  title: string
  description: string
}

export const workHistory: WorkEntry[] = [
  {
    company: 'Bellese Technologies',
    role: 'Senior Software Engineer',
    start: '2021',
    end: 'Present',
    location: 'Boston, MA',
    tech: ['React', 'TypeScript', 'Node.js'],
  },
  // Add more entries as you fill them in from LinkedIn
]

export const achievements: Achievement[] = [
  {
    title: 'Yamaha Artist in-Residence Fellow',
    description: 'Founded and directed a community ensemble.',
  },
  {
    title: 'Fulbright U.S. Student Program Alternate',
    description:
      'Proposed project: transcribing Doina music, composing for classical guitar, and performing in Romania.',
  },
]
```

- [ ] **Step 2: Create `components/about/employment-timeline.tsx`**

```tsx
import type { WorkEntry } from '@/content/work'
import { Badge } from '@/components/ui/badge'

export function EmploymentTimeline({ entries }: { entries: WorkEntry[] }) {
  return (
    <div className="space-y-8">
      {entries.map((entry, i) => (
        <div key={i} className="flex gap-6">
          <div className="flex flex-col items-center">
            <div className="mt-1.5 h-2 w-2 rounded-full bg-accent" />
            {i < entries.length - 1 && (
              <div className="mt-2 flex-1 border-l border-white/10" />
            )}
          </div>
          <div className="pb-8">
            <p className="text-xs text-white/30">
              {entry.start} – {entry.end} · {entry.location}
            </p>
            <p className="mt-1 text-sm font-medium text-white">{entry.role}</p>
            <p className="text-sm text-white/50">{entry.company}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {entry.tech.map((t) => (
                <Badge
                  key={t}
                  variant="secondary"
                  className="bg-white/5 text-white/40"
                >
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Create `components/about/achievement-list.tsx`**

```tsx
import type { Achievement } from '@/content/work'

export function AchievementList({ achievements }: { achievements: Achievement[] }) {
  return (
    <div className="space-y-4">
      {achievements.map((a, i) => (
        <div key={i}>
          <p className="text-sm font-medium text-white">{a.title}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-white/40">{a.description}</p>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Create `app/about/page.tsx`**

```tsx
import { workHistory, achievements } from '@/content/work'
import { EmploymentTimeline } from '@/components/about/employment-timeline'
import { AchievementList } from '@/components/about/achievement-list'

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-14">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-accent">
          About
        </p>
        <h1 className="mb-6 text-4xl font-light text-white">Timothy Hall</h1>

        <p className="mb-12 max-w-2xl text-sm leading-relaxed text-white/50">
          Senior software engineer at Bellese Technologies in Boston. I build
          thoughtful, well-crafted software — and when I&apos;m not doing that,
          I&apos;m playing music. B.M. and M.M. in classical guitar performance
          from the University of South Carolina. I approach both fields the same
          way: a generalist who goes deep when it counts.
        </p>

        <div className="grid gap-16 md:grid-cols-[2fr_1fr]">
          <div>
            <p className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-white/30">
              Experience
            </p>
            <EmploymentTimeline entries={workHistory} />
            <div className="mt-6">
              <a
                href="https://www.linkedin.com/in/timothyryanhall/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/30 underline-offset-4 hover:text-white/60 hover:underline transition-colors"
              >
                Full résumé on LinkedIn →
              </a>
            </div>
          </div>

          <div>
            <p className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-white/30">
              Honors
            </p>
            <AchievementList achievements={achievements} />
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Smoke-test in browser**

Visit http://localhost:3000/about. Expected: bio, Bellese timeline entry, Yamaha and Fulbright honors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: about page with employment timeline and achievements"
```

---

## Task 8: YouTube API utility

**Files:**
- Create: `lib/youtube.ts`
- Create: `lib/__tests__/youtube.test.ts`

- [ ] **Step 1: Write failing tests**

Create `lib/__tests__/youtube.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('getPlaylists', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.resetAllMocks()
    process.env.YOUTUBE_API_KEY = 'test-key'
    process.env.YOUTUBE_CHANNEL_ID = 'test-channel'
  })

  it('sorts playlists by most recent video date, descending', async () => {
    mockFetch
      // playlists list
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [
            { id: 'PL1', snippet: { title: 'Folk' }, contentDetails: { itemCount: 10 } },
            { id: 'PL2', snippet: { title: 'Jazz' }, contentDetails: { itemCount: 5 } },
          ],
        }),
      })
      // most recent video for PL1 (older)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [{ snippet: { publishedAt: '2023-01-01T00:00:00Z' } }],
        }),
      })
      // most recent video for PL2 (newer)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [{ snippet: { publishedAt: '2024-06-01T00:00:00Z' } }],
        }),
      })

    const { getPlaylists } = await import('../youtube')
    const playlists = await getPlaylists()

    expect(playlists[0].title).toBe('Jazz')
    expect(playlists[1].title).toBe('Folk')
  })

  it('places a playlist with no videos last', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [
            { id: 'PL1', snippet: { title: 'Empty' }, contentDetails: { itemCount: 0 } },
            { id: 'PL2', snippet: { title: 'Active' }, contentDetails: { itemCount: 3 } },
          ],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [{ snippet: { publishedAt: '2024-01-01T00:00:00Z' } }],
        }),
      })

    const { getPlaylists } = await import('../youtube')
    const playlists = await getPlaylists()

    expect(playlists[0].title).toBe('Active')
    expect(playlists[1].title).toBe('Empty')
  })
})

describe('getPlaylistVideos', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.resetAllMocks()
    process.env.YOUTUBE_API_KEY = 'test-key'
  })

  it('maps API response to Video shape', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        items: [
          {
            snippet: {
              title: 'My Song',
              publishedAt: '2024-03-15T00:00:00Z',
              thumbnails: { medium: { url: 'https://example.com/thumb.jpg' } },
              resourceId: { videoId: 'abc123' },
            },
          },
        ],
      }),
    })

    const { getPlaylistVideos } = await import('../youtube')
    const videos = await getPlaylistVideos('PL1')

    expect(videos).toHaveLength(1)
    expect(videos[0]).toEqual({
      id: 'abc123',
      title: 'My Song',
      thumbnailUrl: 'https://example.com/thumb.jpg',
      publishedAt: '2024-03-15T00:00:00Z',
    })
  })

  it('falls back to YouTube thumbnail URL when thumbnails are missing', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        items: [
          {
            snippet: {
              title: 'No Thumb',
              publishedAt: '2024-01-01T00:00:00Z',
              thumbnails: {},
              resourceId: { videoId: 'xyz789' },
            },
          },
        ],
      }),
    })

    const { getPlaylistVideos } = await import('../youtube')
    const videos = await getPlaylistVideos('PL1')
    expect(videos[0].thumbnailUrl).toBe(
      'https://img.youtube.com/vi/xyz789/mqdefault.jpg'
    )
  })
})
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
npm run test:run -- lib/__tests__/youtube.test.ts
```
Expected: FAIL — `getPlaylists` not found.

- [ ] **Step 3: Create `lib/youtube.ts`**

```ts
const BASE = 'https://www.googleapis.com/youtube/v3'

export interface Playlist {
  id: string
  title: string
  videoCount: number
  lastActiveAt: string
}

export interface Video {
  id: string
  title: string
  thumbnailUrl: string
  publishedAt: string
}

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error(`YouTube API error: ${res.status} ${url}`)
  return res.json()
}

async function fetchAllPlaylists(): Promise<
  Array<{ id: string; title: string; videoCount: number }>
> {
  const key = process.env.YOUTUBE_API_KEY!
  const channelId = process.env.YOUTUBE_CHANNEL_ID!
  const results: Array<{ id: string; title: string; videoCount: number }> = []
  let pageToken: string | undefined

  do {
    const params = new URLSearchParams({
      part: 'snippet,contentDetails',
      channelId,
      maxResults: '50',
      key,
      ...(pageToken ? { pageToken } : {}),
    })
    const data = (await fetchJson(`${BASE}/playlists?${params}`)) as {
      items: Array<{
        id: string
        snippet: { title: string }
        contentDetails: { itemCount: number }
      }>
      nextPageToken?: string
    }
    for (const item of data.items ?? []) {
      results.push({
        id: item.id,
        title: item.snippet.title,
        videoCount: item.contentDetails.itemCount,
      })
    }
    pageToken = data.nextPageToken
  } while (pageToken)

  return results
}

async function getMostRecentVideoDate(playlistId: string): Promise<string> {
  const key = process.env.YOUTUBE_API_KEY!
  const params = new URLSearchParams({
    part: 'snippet',
    playlistId,
    maxResults: '1',
    key,
  })
  try {
    const data = (await fetchJson(`${BASE}/playlistItems?${params}`)) as {
      items: Array<{ snippet: { publishedAt: string } }>
    }
    return data.items?.[0]?.snippet.publishedAt ?? '1970-01-01T00:00:00Z'
  } catch {
    return '1970-01-01T00:00:00Z'
  }
}

export async function getPlaylists(): Promise<Playlist[]> {
  const raw = await fetchAllPlaylists()
  const withDates = await Promise.all(
    raw.map(async (p) => ({
      ...p,
      lastActiveAt: await getMostRecentVideoDate(p.id),
    }))
  )
  return withDates.sort(
    (a, b) =>
      new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime()
  )
}

export async function getPlaylistVideos(
  playlistId: string,
  maxResults = 50
): Promise<Video[]> {
  const key = process.env.YOUTUBE_API_KEY!
  const params = new URLSearchParams({
    part: 'snippet',
    playlistId,
    maxResults: String(maxResults),
    key,
  })
  const data = (await fetchJson(`${BASE}/playlistItems?${params}`)) as {
    items: Array<{
      snippet: {
        title: string
        publishedAt: string
        thumbnails: { medium?: { url: string } }
        resourceId: { videoId: string }
      }
    }>
  }

  return (data.items ?? []).map((item) => {
    const videoId = item.snippet.resourceId.videoId
    return {
      id: videoId,
      title: item.snippet.title,
      thumbnailUrl:
        item.snippet.thumbnails?.medium?.url ??
        `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      publishedAt: item.snippet.publishedAt,
    }
  })
}
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npm run test:run -- lib/__tests__/youtube.test.ts
```
Expected: 4 passing.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: YouTube API utility with playlist sort and video fetch"
```

---

## Task 9: Music page

**Files:**
- Create: `components/music/playlist-tabs.tsx`
- Create: `components/music/video-card.tsx`
- Create: `components/music/video-grid.tsx`
- Create: `components/music/video-lightbox.tsx`
- Create: `components/music/booking-section.tsx`
- Create: `components/music/music-client.tsx`
- Create: `components/__tests__/playlist-tabs.test.tsx`
- Modify: `app/music/page.tsx`

- [ ] **Step 1: Write failing PlaylistTabs test**

Create `components/__tests__/playlist-tabs.test.tsx`:
```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { PlaylistTabs } from '@/components/music/playlist-tabs'
import type { Playlist } from '@/lib/youtube'

const playlists: Playlist[] = [
  { id: 'PL1', title: 'Folk', videoCount: 10, lastActiveAt: '2024-01-01' },
  { id: 'PL2', title: 'Jazz', videoCount: 5, lastActiveAt: '2023-01-01' },
]

describe('PlaylistTabs', () => {
  it('renders a button for each playlist', () => {
    render(
      <PlaylistTabs playlists={playlists} activeId="PL1" onChange={vi.fn()} />
    )
    expect(screen.getByRole('button', { name: 'Folk' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Jazz' })).toBeInTheDocument()
  })

  it('calls onChange with the playlist id when clicked', () => {
    const onChange = vi.fn()
    render(
      <PlaylistTabs playlists={playlists} activeId="PL1" onChange={onChange} />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Jazz' }))
    expect(onChange).toHaveBeenCalledWith('PL2')
  })

  it('marks the active playlist button with accent styling', () => {
    render(
      <PlaylistTabs playlists={playlists} activeId="PL1" onChange={vi.fn()} />
    )
    expect(screen.getByRole('button', { name: 'Folk' })).toHaveClass('bg-accent')
    expect(screen.getByRole('button', { name: 'Jazz' })).not.toHaveClass('bg-accent')
  })
})
```

- [ ] **Step 2: Run test — confirm fail**

```bash
npm run test:run -- components/__tests__/playlist-tabs.test.tsx
```
Expected: FAIL.

- [ ] **Step 3: Create `components/music/playlist-tabs.tsx`**

```tsx
'use client'

import type { Playlist } from '@/lib/youtube'

interface PlaylistTabsProps {
  playlists: Playlist[]
  activeId: string
  onChange: (id: string) => void
}

export function PlaylistTabs({ playlists, activeId, onChange }: PlaylistTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {playlists.map((playlist) => (
        <button
          key={playlist.id}
          onClick={() => onChange(playlist.id)}
          className={`shrink-0 rounded-sm px-4 py-1.5 text-xs font-medium tracking-wide transition-colors ${
            activeId === playlist.id
              ? 'bg-accent text-black'
              : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'
          }`}
        >
          {playlist.title}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Run test — expect pass**

```bash
npm run test:run -- components/__tests__/playlist-tabs.test.tsx
```
Expected: 3 passing.

- [ ] **Step 5: Create `components/music/video-card.tsx`**

```tsx
'use client'

import Image from 'next/image'
import type { Video } from '@/lib/youtube'

interface VideoCardProps {
  video: Video
  onPlay: (videoId: string) => void
}

export function VideoCard({ video, onPlay }: VideoCardProps) {
  return (
    <button
      onClick={() => onPlay(video.id)}
      className="group relative w-full overflow-hidden rounded-lg border border-white/5 bg-white/[0.02] text-left transition-colors hover:border-accent/20"
    >
      <div className="relative aspect-video overflow-hidden bg-white/5">
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
            <div className="ml-1 h-0 w-0 border-y-8 border-l-[14px] border-y-transparent border-l-black" />
          </div>
        </div>
      </div>
      <div className="p-3">
        <p className="line-clamp-2 text-xs text-white/60">{video.title}</p>
      </div>
    </button>
  )
}
```

- [ ] **Step 6: Create `components/music/video-grid.tsx`**

```tsx
import { VideoCard } from './video-card'
import type { Video } from '@/lib/youtube'

interface VideoGridProps {
  videos: Video[]
  loading?: boolean
  onPlay: (videoId: string) => void
}

export function VideoGrid({ videos, loading, onPlay }: VideoGridProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-video animate-pulse rounded-lg bg-white/5"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} onPlay={onPlay} />
      ))}
    </div>
  )
}
```

- [ ] **Step 7: Create `components/music/video-lightbox.tsx`**

```tsx
'use client'

import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'

interface VideoLightboxProps {
  videoId: string | null
  onClose: () => void
}

export function VideoLightbox({ videoId, onClose }: VideoLightboxProps) {
  return (
    <Dialog
      open={videoId !== null}
      onOpenChange={(open) => { if (!open) onClose() }}
    >
      <DialogContent className="max-w-4xl border-white/10 bg-black p-0">
        {videoId && (
          <div className="aspect-video w-full">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Video player"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
```

- [ ] **Step 8: Create `components/music/booking-section.tsx`**

```tsx
export function BookingSection() {
  return (
    <section className="mt-20 border-t border-white/5 pt-16">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-accent">
        Book
      </p>
      <h2 className="mb-6 text-2xl font-light text-white">Available for gigs</h2>
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-white/30">
            Instruments
          </p>
          <ul className="space-y-1 text-sm text-white/50">
            <li>Classical guitar</li>
            <li>Piano / Nord Stage 4</li>
            <li>Hammond B3 organ</li>
            <li>Voice</li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-white/30">
            Styles
          </p>
          <ul className="space-y-1 text-sm text-white/50">
            <li>Folk &amp; singer-songwriter</li>
            <li>Jazz</li>
            <li>Funk &amp; soul</li>
            <li>Country &amp; Americana</li>
            <li>Bluegrass</li>
            <li>Classical</li>
          </ul>
        </div>
      </div>
      <div className="mt-8">
        <a
          href="mailto:timothyryanhall@gmail.com"
          className="inline-block rounded-sm bg-accent px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-black transition-opacity hover:opacity-80"
        >
          Get in Touch
        </a>
      </div>
    </section>
  )
}
```

- [ ] **Step 9: Create `components/music/music-client.tsx`**

```tsx
'use client'

import { useState } from 'react'
import type { Playlist, Video } from '@/lib/youtube'
import { PlaylistTabs } from './playlist-tabs'
import { VideoGrid } from './video-grid'
import { VideoLightbox } from './video-lightbox'

interface MusicClientProps {
  playlists: Playlist[]
  allVideos: Record<string, Video[]>
}

export function MusicClient({ playlists, allVideos }: MusicClientProps) {
  const [activeId, setActiveId] = useState(playlists[0]?.id ?? '')
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null)

  const videos = allVideos[activeId] ?? []

  return (
    <>
      <PlaylistTabs
        playlists={playlists}
        activeId={activeId}
        onChange={setActiveId}
      />
      <div className="mt-6">
        <VideoGrid videos={videos} onPlay={setActiveVideoId} />
      </div>
      <VideoLightbox
        videoId={activeVideoId}
        onClose={() => setActiveVideoId(null)}
      />
    </>
  )
}
```

- [ ] **Step 10: Create `app/music/page.tsx`**

```tsx
import { getPlaylists, getPlaylistVideos } from '@/lib/youtube'
import { MusicClient } from '@/components/music/music-client'
import { BookingSection } from '@/components/music/booking-section'
import type { Video } from '@/lib/youtube'

export default async function MusicPage() {
  let playlists = await getPlaylists()
  const allVideos: Record<string, Video[]> = {}

  await Promise.all(
    playlists.map(async (p) => {
      allVideos[p.id] = await getPlaylistVideos(p.id)
    })
  )

  return (
    <div className="min-h-screen pt-14">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-accent">
          Music
        </p>
        <h1 className="mb-6 text-4xl font-light text-white">Timothy Hall</h1>
        <p className="mb-10 max-w-2xl text-sm leading-relaxed text-white/50">
          B.M. and M.M. in classical guitar performance from the University of
          South Carolina. Yamaha Artist in-Residence Fellow. Plays folk, jazz,
          blues, funk, country, and bluegrass — currently keys in a funk band
          and B3 organ in a country band. Also sings. Classical training is the
          foundation, not the identity.
        </p>

        {playlists.length > 0 ? (
          <MusicClient playlists={playlists} allVideos={allVideos} />
        ) : (
          <p className="text-sm text-white/30">
            Videos loading — add YOUTUBE_CHANNEL_ID and YOUTUBE_API_KEY to .env.local.
          </p>
        )}

        <div className="mt-8 text-center">
          <a
            href="https://www.youtube.com/@TimothyRyanHall"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/30 transition-colors hover:text-white/60"
          >
            See all videos on YouTube →
          </a>
        </div>

        <BookingSection />
      </div>
    </div>
  )
}
```

- [ ] **Step 11: Smoke-test**

With `YOUTUBE_CHANNEL_ID` and `YOUTUBE_API_KEY` still empty, visit http://localhost:3000/music. Expected: bio, placeholder message for videos, booking section.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat: music page with playlists, video grid, lightbox, and booking section"
```

---

## Task 10: Wire up YouTube credentials and verify Music page end-to-end

**Files:**
- Modify: `.env.local`

- [ ] **Step 1: Find your YouTube Channel ID**

Go to https://www.youtube.com/@TimothyRyanHall, click your profile photo → Settings → Advanced settings. Copy the Channel ID (starts with `UC`).

- [ ] **Step 2: Create a YouTube Data API v3 key**

1. Go to https://console.cloud.google.com/
2. Create a new project (or use an existing one)
3. Enable "YouTube Data API v3"
4. Go to Credentials → Create credentials → API key
5. Restrict the key to "YouTube Data API v3" (optional but recommended)

- [ ] **Step 3: Add credentials to `.env.local`**

```
YOUTUBE_API_KEY=AIza...your-key-here
YOUTUBE_CHANNEL_ID=UC...your-channel-id-here
```

- [ ] **Step 4: Restart dev server and verify Music page**

```bash
# Stop server (Ctrl+C), then:
npm run dev
```

Visit http://localhost:3000/music. Expected: scrollable playlist tabs matching your YouTube playlists, video thumbnails in grid, most recently active playlist selected by default. Click a thumbnail — video plays in lightbox.

- [ ] **Step 5: Commit (env.local stays gitignored)**

```bash
git add -A
git commit -m "feat: YouTube credentials wired up; music page fully functional"
```

---

## Task 11: Deploy to Vercel

**No files changed** — this task is setup in the Vercel dashboard.

- [ ] **Step 1: Import repo to Vercel**

1. Go to https://vercel.com and sign up with GitHub
2. Click "Add New Project" → import `timothyryanhall.com` from GitHub
3. Framework preset: Next.js (auto-detected)
4. Click "Deploy"

Expected: site live at a `*.vercel.app` URL.

- [ ] **Step 2: Add environment variables in Vercel**

In the Vercel project → Settings → Environment Variables, add:
- `YOUTUBE_API_KEY` = your API key
- `YOUTUBE_CHANNEL_ID` = your channel ID

Redeploy after adding them: Deployments → Redeploy.

- [ ] **Step 3: Buy domain and connect it**

1. In Vercel dashboard → Settings → Domains → Add Domain → search `timothyryanhall.com`
2. Vercel will prompt you to buy it if it's available (~$10–20/year). Complete purchase.
3. DNS is configured automatically.

Expected: `https://timothyryanhall.com` serves the site within a few minutes.

- [ ] **Step 4: Confirm HTTPS and production build work**

Visit https://timothyryanhall.com. Check all four pages load. Check the Music page shows your playlists.

- [ ] **Step 5: Push final state**

```bash
git add -A
git commit -m "chore: verify production deployment"
git push origin main
```

---

## Self-Review Checklist

**Spec coverage:**
- ✅ Dark & Sharp visual theme with electric lime accent — `globals.css` + `tailwind.config.ts`
- ✅ Nav: name left, About/Projects/Music/LinkedIn right, mobile slide-down — Task 3
- ✅ Homepage hero + preview cards — Task 4
- ✅ About page: bio, employment timeline, LinkedIn link, Fulbright/Yamaha — Task 7
- ✅ Projects: 3 card types, filter tabs, empty state, MDX content model — Tasks 5–6
- ✅ Music: auto-discovered playlists sorted by recency, scrollable tabs, video grid, inline lightbox, booking section — Tasks 8–9
- ✅ shadcn/ui components — Task 2
- ✅ Design tokens in `tailwind.config.ts` — Task 1
- ✅ Vercel deployment + domain — Task 11
- ✅ No database, no blog, no auth — correctly omitted

**Placeholder scan:** None found. All code is complete.

**Type consistency:**
- `Project` type defined in `lib/projects.ts`, used in Tasks 4, 5, 6
- `Playlist` and `Video` types defined in `lib/youtube.ts`, used in Tasks 4, 8, 9
- `WorkEntry` and `Achievement` defined in `content/work.ts`, used in Task 7
- `MusicClient` receives `allVideos: Record<string, Video[]>` — matches what `app/music/page.tsx` passes
