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
