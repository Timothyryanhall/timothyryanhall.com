import type { WorkEntry } from '@/content/work'
import { Badge } from '@/components/ui/badge'

export function EmploymentTimeline({ entries }: { entries: WorkEntry[] }) {
  return (
    <div className="space-y-8">
      {entries.map((entry, i) => (
        <div key={i} className="flex gap-6">
          <div className="flex flex-col items-center">
            <div className="mt-1.5 h-2 w-2 rounded-full bg-accent" />
            {i < entries.length - 1 && (
              <div className="mt-2 flex-1 border-l border-white/10" />
            )}
          </div>
          <div className="pb-8">
            <p className="text-xs text-white/30">
              {entry.start} – {entry.end} · {entry.location}
            </p>
            <p className="mt-1 text-sm font-medium text-white">{entry.role}</p>
            <p className="text-sm text-white/50">{entry.company}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {entry.tech.map((t) => (
                <Badge
                  key={t}
                  variant="secondary"
                  className="bg-white/5 text-white/40"
                >
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
