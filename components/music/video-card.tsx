'use client'

import Image from 'next/image'
import type { Video } from '@/lib/youtube'

interface VideoCardProps {
  video: Video
  onPlay: (videoId: string) => void
}

export function VideoCard({ video, onPlay }: VideoCardProps) {
  return (
    <button
      onClick={() => onPlay(video.id)}
      className="group relative w-full overflow-hidden rounded-lg border border-white/5 bg-white/[0.02] text-left transition-colors hover:border-accent/20"
    >
      <div className="relative aspect-video overflow-hidden bg-white/5">
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
            <div className="ml-1 h-0 w-0 border-y-8 border-l-[14px] border-y-transparent border-l-black" />
          </div>
        </div>
      </div>
      <div className="p-3">
        <p className="line-clamp-2 text-xs text-white/60">{video.title}</p>
      </div>
    </button>
  )
}
