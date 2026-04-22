import { render, screen, fireEvent } from '@testing-library/react'
import { PlaylistTabs } from '@/components/music/playlist-tabs'
import type { Playlist } from '@/lib/youtube'

const playlists: Playlist[] = [
  { id: 'PL1', title: 'Folk', videoCount: 10, lastActiveAt: '2024-01-01' },
  { id: 'PL2', title: 'Jazz', videoCount: 5, lastActiveAt: '2023-01-01' },
]

describe('PlaylistTabs', () => {
  it('renders a button for each playlist', () => {
    render(
      <PlaylistTabs playlists={playlists} activeId="PL1" onChange={vi.fn()} />
    )
    expect(screen.getByRole('button', { name: 'Folk' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Jazz' })).toBeInTheDocument()
  })

  it('calls onChange with the playlist id when clicked', () => {
    const onChange = vi.fn()
    render(
      <PlaylistTabs playlists={playlists} activeId="PL1" onChange={onChange} />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Jazz' }))
    expect(onChange).toHaveBeenCalledWith('PL2')
  })

  it('marks the active playlist button with accent styling', () => {
    render(
      <PlaylistTabs playlists={playlists} activeId="PL1" onChange={vi.fn()} />
    )
    expect(screen.getByRole('button', { name: 'Folk' })).toHaveClass('bg-accent')
    expect(screen.getByRole('button', { name: 'Jazz' })).not.toHaveClass('bg-accent')
  })
})
