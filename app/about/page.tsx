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
