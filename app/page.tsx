import { Hero } from '@/components/home/hero'
import { PreviewCards } from '@/components/home/preview-cards'
import { getProjects } from '@/lib/projects'
import type { Video } from '@/lib/youtube'

export default async function HomePage() {
  const featured = getProjects({ featured: true })
  const repos = getProjects().filter((p) => p.type === 'repo')

  const featuredProject = featured[0] ?? null
  const latestRepo = repos[0] ?? null

  let latestVideo: Video | null = null
  if (process.env.YOUTUBE_CHANNEL_ID && process.env.YOUTUBE_API_KEY) {
    const { getPlaylists, getPlaylistVideos } = await import('@/lib/youtube')
    const playlists = await getPlaylists()
    if (playlists.length > 0) {
      const videos = await getPlaylistVideos(playlists[0].id, 1)
      latestVideo = videos[0] ?? null
    }
  }

  return (
    <>
      <Hero />
      <PreviewCards
        featuredProject={featuredProject}
        latestVideo={latestVideo}
        latestRepo={latestRepo}
      />
    </>
  )
}
