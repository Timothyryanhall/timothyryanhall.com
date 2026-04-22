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
