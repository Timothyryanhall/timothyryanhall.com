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
              <div className="mt-2 flex-1 border-l border-border" />
            )}
          </div>
          <div className="pb-8">
            <p className="text-xs text-muted-foreground">
              {entry.start} – {entry.end} · {entry.location}
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">{entry.role}</p>
            <p className="text-sm text-muted-foreground">{entry.company}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {entry.tech.map((t) => (
                <Badge
                  key={t}
                  variant="secondary"
                  className="bg-foreground/5 text-muted-foreground"
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
