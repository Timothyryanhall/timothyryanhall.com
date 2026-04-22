'use client'

import type { Playlist } from '@/lib/youtube'

interface PlaylistTabsProps {
  playlists: Playlist[]
  activeId: string
  onChange: (id: string) => void
}

export function PlaylistTabs({ playlists, activeId, onChange }: PlaylistTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {playlists.map((playlist) => (
        <button
          key={playlist.id}
          onClick={() => onChange(playlist.id)}
          className={`shrink-0 rounded-sm px-4 py-1.5 text-xs font-medium tracking-wide transition-colors ${
            activeId === playlist.id
              ? 'bg-accent text-black'
              : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'
          }`}
        >
          {playlist.title}
        </button>
      ))}
    </div>
  )
}
