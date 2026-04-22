'use client'

import { useState } from 'react'
import type { Playlist, Video } from '@/lib/youtube'
import { PlaylistTabs } from './playlist-tabs'
import { VideoGrid } from './video-grid'
import { VideoLightbox } from './video-lightbox'

interface MusicClientProps {
  playlists: Playlist[]
  allVideos: Record<string, Video[]>
}

export function MusicClient({ playlists, allVideos }: MusicClientProps) {
  const [activeId, setActiveId] = useState(playlists[0]?.id ?? '')
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null)

  const videos = allVideos[activeId] ?? []

  return (
    <>
      <PlaylistTabs
        playlists={playlists}
        activeId={activeId}
        onChange={setActiveId}
      />
      <div className="mt-6">
        <VideoGrid videos={videos} onPlay={setActiveVideoId} />
      </div>
      <VideoLightbox
        videoId={activeVideoId}
        onClose={() => setActiveVideoId(null)}
      />
    </>
  )
}
