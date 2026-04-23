export interface WorkEntry {
  company: string
  role: string
  start: string
  end: string
  location: string
  tech: string[]
}

export const workHistory: WorkEntry[] = [
  {
    company: 'Bellese Technologies',
    role: 'Senior Software Engineer',
    start: '2021',
    end: 'Present',
    location: 'Boston, MA',
    tech: ['React', 'TypeScript', 'Node.js'],
  },
  // Add more entries from LinkedIn
]
