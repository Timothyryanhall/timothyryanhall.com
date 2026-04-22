'use client'

import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'

interface VideoLightboxProps {
  videoId: string | null
  onClose: () => void
}

export function VideoLightbox({ videoId, onClose }: VideoLightboxProps) {
  return (
    <Dialog
      open={videoId !== null}
      onOpenChange={(open) => { if (!open) onClose() }}
    >
      <DialogContent className="max-w-4xl border-white/10 bg-black p-0">
        {videoId && (
          <div className="aspect-video w-full">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Video player"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
