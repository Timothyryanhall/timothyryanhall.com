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
