import { MusicClient } from '@/components/music/music-client'
import { BookingSection } from '@/components/music/booking-section'
import type { Playlist, Video } from '@/lib/youtube'

export default async function MusicPage() {
  let playlists: Playlist[] = []
  const allVideos: Record<string, Video[]> = {}

  if (process.env.YOUTUBE_CHANNEL_ID && process.env.YOUTUBE_API_KEY) {
    const { getPlaylists, getPlaylistVideos } = await import('@/lib/youtube')
    playlists = await getPlaylists()
    await Promise.all(
      playlists.map(async (p) => {
        allVideos[p.id] = await getPlaylistVideos(p.id)
      })
    )
  }

  return (
    <div className="min-h-screen pt-14">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-accent">
          Music
        </p>
        <h1 className="mb-6 text-4xl font-light text-white">Timothy Hall</h1>
        <p className="mb-10 max-w-2xl text-sm leading-relaxed text-white/50">
          B.M. and M.M. in classical guitar performance from the University of
          South Carolina. Yamaha Artist in-Residence Fellow. Plays folk, jazz,
          blues, funk, country, and bluegrass — currently keys in a funk band
          and B3 organ in a country band. Also sings. Classical training is the
          foundation, not the identity.
        </p>

        {playlists.length > 0 ? (
          <MusicClient playlists={playlists} allVideos={allVideos} />
        ) : (
          <p className="text-sm text-white/30">
            Videos loading — add YOUTUBE_CHANNEL_ID and YOUTUBE_API_KEY to .env.local.
          </p>
        )}

        <div className="mt-8 text-center">
          <a
            href="https://www.youtube.com/@TimothyRyanHall"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/30 transition-colors hover:text-white/60"
          >
            See all videos on YouTube →
          </a>
        </div>

        <BookingSection />
      </div>
    </div>
  )
}
