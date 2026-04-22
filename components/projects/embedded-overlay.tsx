'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { ComponentType } from 'react'

interface EmbeddedOverlayProps {
  title: string
  component: ComponentType | null
  onClose: () => void
}

export function EmbeddedOverlay({
  title,
  component: Demo,
  onClose,
}: EmbeddedOverlayProps) {
  return (
    <Dialog open={Demo !== null} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-3xl border-white/10 bg-card">
        <DialogHeader>
          <DialogTitle className="text-white">{title}</DialogTitle>
        </DialogHeader>
        <div className="min-h-[300px]">
          {Demo && <Demo />}
        </div>
      </DialogContent>
    </Dialog>
  )
}
