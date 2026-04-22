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
          <Button render={<Link href="/projects" />}>View Projects</Button>
          <Button variant="outline" render={<Link href="/music" />}>Watch Music</Button>
        </div>
      </div>
    </section>
  )
}
