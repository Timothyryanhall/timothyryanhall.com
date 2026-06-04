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
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Experience
          </p>
          <EmploymentTimeline entries={workHistory} />
          <div className="mt-8">
            <a
              href="https://www.linkedin.com/in/timothyryanhall/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Full résumé on LinkedIn →
            </a>
          </div>
        </div>
      </section>
      <section className="border-t border-border px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/projects"
            className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            View my projects →
          </Link>
        </div>
      </section>
    </>
  )
}
