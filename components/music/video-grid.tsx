import { VideoCard } from './video-card'
import type { Video } from '@/lib/youtube'

interface VideoGridProps {
  videos: Video[]
  loading?: boolean
  onPlay: (videoId: string) => void
}

export function VideoGrid({ videos, loading, onPlay }: VideoGridProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-video animate-pulse rounded-lg bg-white/5"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} onPlay={onPlay} />
      ))}
    </div>
  )
}
