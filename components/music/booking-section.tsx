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
