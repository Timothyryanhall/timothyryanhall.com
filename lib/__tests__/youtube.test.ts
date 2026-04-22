import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('getPlaylists', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.resetAllMocks()
    process.env.YOUTUBE_API_KEY = 'test-key'
    process.env.YOUTUBE_CHANNEL_ID = 'test-channel'
  })

  it('sorts playlists by most recent video date, descending', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [
            { id: 'PL1', snippet: { title: 'Folk' }, contentDetails: { itemCount: 10 } },
            { id: 'PL2', snippet: { title: 'Jazz' }, contentDetails: { itemCount: 5 } },
          ],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [{ snippet: { publishedAt: '2023-01-01T00:00:00Z' } }],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [{ snippet: { publishedAt: '2024-06-01T00:00:00Z' } }],
        }),
      })

    const { getPlaylists } = await import('../youtube')
    const playlists = await getPlaylists()

    expect(playlists[0].title).toBe('Jazz')
    expect(playlists[1].title).toBe('Folk')
  })

  it('places a playlist with no videos last', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [
            { id: 'PL1', snippet: { title: 'Empty' }, contentDetails: { itemCount: 0 } },
            { id: 'PL2', snippet: { title: 'Active' }, contentDetails: { itemCount: 3 } },
          ],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [{ snippet: { publishedAt: '2024-01-01T00:00:00Z' } }],
        }),
      })

    const { getPlaylists } = await import('../youtube')
    const playlists = await getPlaylists()

    expect(playlists[0].title).toBe('Active')
    expect(playlists[1].title).toBe('Empty')
  })
})

describe('getPlaylistVideos', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.resetAllMocks()
    process.env.YOUTUBE_API_KEY = 'test-key'
  })

  it('maps API response to Video shape', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        items: [
          {
            snippet: {
              title: 'My Song',
              publishedAt: '2024-03-15T00:00:00Z',
              thumbnails: { medium: { url: 'https://example.com/thumb.jpg' } },
              resourceId: { videoId: 'abc123' },
            },
          },
        ],
      }),
    })

    const { getPlaylistVideos } = await import('../youtube')
    const videos = await getPlaylistVideos('PL1')

    expect(videos).toHaveLength(1)
    expect(videos[0]).toEqual({
      id: 'abc123',
      title: 'My Song',
      thumbnailUrl: 'https://example.com/thumb.jpg',
      publishedAt: '2024-03-15T00:00:00Z',
    })
  })

  it('falls back to YouTube thumbnail URL when thumbnails are missing', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        items: [
          {
            snippet: {
              title: 'No Thumb',
              publishedAt: '2024-01-01T00:00:00Z',
              thumbnails: {},
              resourceId: { videoId: 'xyz789' },
            },
          },
        ],
      }),
    })

    const { getPlaylistVideos } = await import('../youtube')
    const videos = await getPlaylistVideos('PL1')
    expect(videos[0].thumbnailUrl).toBe(
      'https://img.youtube.com/vi/xyz789/mqdefault.jpg'
    )
  })
})
