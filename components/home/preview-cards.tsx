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
