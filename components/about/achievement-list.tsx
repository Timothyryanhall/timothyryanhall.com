import type { Achievement } from '@/content/work'

export function AchievementList({ achievements }: { achievements: Achievement[] }) {
  return (
    <div className="space-y-4">
      {achievements.map((a, i) => (
        <div key={i}>
          <p className="text-sm font-medium text-white">{a.title}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-white/40">{a.description}</p>
        </div>
      ))}
    </div>
  )
}
