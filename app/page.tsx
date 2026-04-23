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
