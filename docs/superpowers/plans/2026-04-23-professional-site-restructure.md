# Professional Site Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Strip the site to a pure software engineering portfolio by removing all music content, restructuring the homepage as an About page, and updating the accent color from lime to cyan.

**Architecture:** Two-page site — homepage (hero + employment timeline + CTA) and projects page (unchanged). The about and music routes are deleted. A footer with GitHub and LinkedIn links is added to the root layout.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS v4 (CSS variable tokens), Vitest + React Testing Library

---

### Task 1: Update accent color

**Files:**
- Modify: `app/globals.css:43-54`

- [ ] **Step 1: Update the three accent CSS custom properties**

In `app/globals.css`, replace the three lime `oklch` values with cyan:

```css
--primary: oklch(0.82 0.14 216);     /* cyan #22d3ee */
--primary-foreground: oklch(0 0 0);
```
```css
--accent: oklch(0.82 0.14 216);      /* cyan #22d3ee */
--accent-foreground: oklch(0 0 0);
```
```css
--ring: oklch(0.82 0.14 216);
```

The full `:root` block after the change:

```css
:root {
  --background: oklch(0.09 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.12 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.12 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.82 0.14 216);     /* cyan #22d3ee */
  --primary-foreground: oklch(0 0 0);
  --secondary: oklch(0.15 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.13 0 0);
  --muted-foreground: oklch(0.5 0 0);
  --accent: oklch(0.82 0.14 216);      /* cyan #22d3ee */
  --accent-foreground: oklch(0 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.2 0 0);
  --input: oklch(0.2 0 0);
  --ring: oklch(0.82 0.14 216);
  --radius: 0.375rem;
}
```

- [ ] **Step 2: Commit**

```bash
git add app/globals.css
git commit -m "feat: update accent color from lime to cyan"
```

---

### Task 2: Update Nav component (TDD)

**Files:**
- Modify: `components/__tests__/nav.test.tsx`
- Modify: `components/layout/nav.tsx`

- [ ] **Step 1: Write the failing test**

Replace the entire contents of `components/__tests__/nav.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { Nav } from '@/components/layout/nav'

vi.mock('next/link', () => ({
  default: ({ href, children, className, ...props }: { href: string; children: React.ReactNode; className?: string; [key: string]: unknown }) => (
    <a href={href} className={className} {...props}>{children}</a>
  ),
}))

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}))

import { usePathname } from 'next/navigation'

describe('Nav', () => {
  it('renders site name and only the Projects nav link', () => {
    render(<Nav />)
    expect(screen.getByText('Timothy Hall')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects')
    expect(screen.queryByRole('link', { name: 'About' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Music' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toBeInTheDocument()
  })

  it('highlights the active link', () => {
    vi.mocked(usePathname).mockReturnValue('/projects')
    render(<Nav />)
    const projectsLink = screen.getByRole('link', { name: 'Projects' })
    expect(projectsLink).toHaveClass('text-white')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/timothyhall/personal-site && npx vitest run components/__tests__/nav.test.tsx
```

Expected: FAIL — `queryByRole('link', { name: 'About' })` returns an element (not null), and `queryByRole('link', { name: 'Music' })` returns an element.

- [ ] **Step 3: Update the Nav component**

Replace the entire contents of `components/layout/nav.tsx`:

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

function LinkedinIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

const NAV_LINKS = [
  { href: '/projects', label: 'Projects' },
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
            <LinkedinIcon />
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
            <LinkedinIcon />
            LinkedIn
          </a>
        </div>
      )}
    </header>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd /Users/timothyhall/personal-site && npx vitest run components/__tests__/nav.test.tsx
```

Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add components/__tests__/nav.test.tsx components/layout/nav.tsx
git commit -m "feat: remove About and Music nav links"
```

---

### Task 3: Update Hero component

**Files:**
- Modify: `components/home/hero.tsx`

- [ ] **Step 1: Update the hero copy and buttons**

Replace the entire contents of `components/home/hero.tsx`:

```tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="flex min-h-screen flex-col justify-center px-6 pt-14">
      <div className="mx-auto w-full max-w-5xl">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-accent">
          Software Engineer
        </p>
        <h1 className="mb-6 text-5xl font-light tracking-tight text-white sm:text-7xl">
          Timothy Hall
        </h1>
        <p className="mb-10 max-w-xl text-base leading-relaxed text-white/50">
          Senior software engineer at Bellese Technologies in Boston. I build
          thoughtful, well-crafted software — and I approach every problem the
          same way: learn everything, commit to nothing too early, ship often.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button render={<Link href="/projects" />}>View Projects</Button>
          <Button
            variant="outline"
            render={<a href="https://www.linkedin.com/in/timothyryanhall/" target="_blank" rel="noopener noreferrer" />}
          >
            LinkedIn
          </Button>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/home/hero.tsx
git commit -m "feat: update hero copy and buttons for software-only site"
```

---

### Task 4: Rewrite homepage

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Rewrite the homepage**

Replace the entire contents of `app/page.tsx`:

```tsx
import Link from 'next/link'
import { Hero } from '@/components/home/hero'
import { EmploymentTimeline } from '@/components/about/employment-timeline'
import { workHistory } from '@/content/work'

export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl">
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-white/30">
            Experience
          </p>
          <EmploymentTimeline entries={workHistory} />
          <div className="mt-8">
            <a
              href="https://www.linkedin.com/in/timothyryanhall/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/30 underline-offset-4 transition-colors hover:text-white/60 hover:underline"
            >
              Full résumé on LinkedIn →
            </a>
          </div>
        </div>
      </section>
      <section className="border-t border-white/5 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/projects"
            className="text-sm text-white/40 underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            View my projects →
          </Link>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "feat: rewrite homepage as about page with employment timeline"
```

---

### Task 5: Add footer and update metadata

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Add footer and update metadata**

Replace the entire contents of `app/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { Nav } from '@/components/layout/nav'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: 'Timothy Hall',
  description: 'Software engineer based in Boston.',
  openGraph: {
    title: 'Timothy Hall',
    description: 'Software engineer based in Boston.',
    url: 'https://timothyryanhall.com',
    siteName: 'Timothy Hall',
  },
}

function GithubIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

function LinkedinIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
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
        <footer className="border-t border-white/5 px-6 py-8">
          <div className="mx-auto flex max-w-5xl items-center gap-6">
            <a
              href="https://github.com/timothyryanhall"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-white/30 transition-colors hover:text-white/60"
            >
              <GithubIcon />
            </a>
            <a
              href="https://www.linkedin.com/in/timothyryanhall/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-white/30 transition-colors hover:text-white/60"
            >
              <LinkedinIcon />
            </a>
          </div>
        </footer>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add footer with GitHub and LinkedIn, update site metadata"
```

---

### Task 6: Delete YouTube library

**Files:**
- Delete: `lib/youtube.ts`
- Delete: `lib/__tests__/youtube.test.ts`

- [ ] **Step 1: Delete YouTube files**

```bash
rm /Users/timothyhall/personal-site/lib/youtube.ts
rm /Users/timothyhall/personal-site/lib/__tests__/youtube.test.ts
```

- [ ] **Step 2: Run tests to confirm no breakage**

```bash
cd /Users/timothyhall/personal-site && npx vitest run
```

Expected: All remaining tests pass (nav, project-card, projects lib).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove YouTube API library and tests"
```

---

### Task 7: Delete music page and components

**Files:**
- Delete: `app/music/` (entire directory)
- Delete: `components/music/` (entire directory)
- Delete: `components/__tests__/playlist-tabs.test.tsx`

- [ ] **Step 1: Delete music files**

```bash
rm -rf /Users/timothyhall/personal-site/app/music
rm -rf /Users/timothyhall/personal-site/components/music
rm /Users/timothyhall/personal-site/components/__tests__/playlist-tabs.test.tsx
```

- [ ] **Step 2: Run tests**

```bash
cd /Users/timothyhall/personal-site && npx vitest run
```

Expected: All remaining tests pass.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove music page and components"
```

---

### Task 8: Delete About page, achievements, and preview cards

**Files:**
- Delete: `app/about/` (entire directory)
- Delete: `components/about/achievement-list.tsx`
- Delete: `components/home/preview-cards.tsx`

- [ ] **Step 1: Delete files**

```bash
rm -rf /Users/timothyhall/personal-site/app/about
rm /Users/timothyhall/personal-site/components/about/achievement-list.tsx
rm /Users/timothyhall/personal-site/components/home/preview-cards.tsx
```

- [ ] **Step 2: Run tests**

```bash
cd /Users/timothyhall/personal-site && npx vitest run
```

Expected: All remaining tests pass.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove About page, achievement list, and preview cards"
```

---

### Task 9: Clean up content/work.ts

**Files:**
- Modify: `content/work.ts`

- [ ] **Step 1: Remove Achievement interface and achievements export**

Replace the entire contents of `content/work.ts`:

```ts
export interface WorkEntry {
  company: string
  role: string
  start: string
  end: string
  location: string
  tech: string[]
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
  // Add more entries from LinkedIn
]
```

- [ ] **Step 2: Run tests**

```bash
cd /Users/timothyhall/personal-site && npx vitest run
```

Expected: All tests pass.

- [ ] **Step 3: Commit**

```bash
git add content/work.ts
git commit -m "chore: remove Achievement type and achievements data from work content"
```

---

### Task 10: Build check

- [ ] **Step 1: Run production build**

```bash
cd /Users/timothyhall/personal-site && npm run build
```

Expected: Build completes with no TypeScript errors or missing module errors. There will be a route table showing only `/` and `/projects`.

- [ ] **Step 2: Fix any errors**

If build fails with a module not found error, check `app/page.tsx` and `app/layout.tsx` for any remaining imports of deleted files. Remove them.

If build fails with a TypeScript error, read the error message and fix the specific file/line indicated.

- [ ] **Step 3: Commit fix if needed**

```bash
git add -A
git commit -m "fix: resolve build errors after restructure"
```
