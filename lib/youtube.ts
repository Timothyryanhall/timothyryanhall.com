const BASE = 'https://www.googleapis.com/youtube/v3'

export interface Playlist {
  id: string
  title: string
  videoCount: number
  lastActiveAt: string
}

export interface Video {
  id: string
  title: string
  thumbnailUrl: string
  publishedAt: string
}

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error(`YouTube API error: ${res.status} ${url}`)
  return res.json()
}

async function fetchAllPlaylists(): Promise<
  Array<{ id: string; title: string; videoCount: number }>
> {
  const key = process.env.YOUTUBE_API_KEY!
  const channelId = process.env.YOUTUBE_CHANNEL_ID!
  const results: Array<{ id: string; title: string; videoCount: number }> = []
  let pageToken: string | undefined

  do {
    const params = new URLSearchParams({
      part: 'snippet,contentDetails',
      channelId,
      maxResults: '50',
      key,
      ...(pageToken ? { pageToken } : {}),
    })
    const data = (await fetchJson(`${BASE}/playlists?${params}`)) as {
      items: Array<{
        id: string
        snippet: { title: string }
        contentDetails: { itemCount: number }
      }>
      nextPageToken?: string
    }
    for (const item of data.items ?? []) {
      results.push({
        id: item.id,
        title: item.snippet.title,
        videoCount: item.contentDetails.itemCount,
      })
    }
    pageToken = data.nextPageToken
  } while (pageToken)

  return results
}

async function getMostRecentVideoDate(playlistId: string): Promise<string> {
  const key = process.env.YOUTUBE_API_KEY!
  const params = new URLSearchParams({
    part: 'snippet',
    playlistId,
    maxResults: '1',
    key,
  })
  try {
    const data = (await fetchJson(`${BASE}/playlistItems?${params}`)) as {
      items: Array<{ snippet: { publishedAt: string } }>
    }
    return data.items?.[0]?.snippet.publishedAt ?? '1970-01-01T00:00:00Z'
  } catch {
    return '1970-01-01T00:00:00Z'
  }
}

export async function getPlaylists(): Promise<Playlist[]> {
  const raw = await fetchAllPlaylists()
  const withDates = await Promise.all(
    raw.map(async (p) => ({
      ...p,
      lastActiveAt: await getMostRecentVideoDate(p.id),
    }))
  )
  return withDates.sort(
    (a, b) =>
      new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime()
  )
}

export async function getPlaylistVideos(
  playlistId: string,
  maxResults = 50
): Promise<Video[]> {
  const key = process.env.YOUTUBE_API_KEY!
  const params = new URLSearchParams({
    part: 'snippet',
    playlistId,
    maxResults: String(maxResults),
    key,
  })
  const data = (await fetchJson(`${BASE}/playlistItems?${params}`)) as {
    items: Array<{
      snippet: {
        title: string
        publishedAt: string
        thumbnails: { medium?: { url: string } }
        resourceId: { videoId: string }
      }
    }>
  }

  return (data.items ?? []).map((item) => {
    const videoId = item.snippet.resourceId.videoId
    return {
      id: videoId,
      title: item.snippet.title,
      thumbnailUrl:
        item.snippet.thumbnails?.medium?.url ??
        `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      publishedAt: item.snippet.publishedAt,
    }
  })
}
