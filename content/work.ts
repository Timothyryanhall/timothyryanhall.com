export interface WorkEntry {
  company: string
  role: string
  start: string
  end: string
  location: string
  tech: string[]
}

export interface Achievement {
  title: string
  description: string
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
  // Add more entries as you fill them in from LinkedIn
]

export const achievements: Achievement[] = [
  {
    title: 'Yamaha Artist in-Residence Fellow',
    description: 'Founded and directed a community ensemble.',
  },
  {
    title: 'Fulbright U.S. Student Program Alternate',
    description:
      'Proposed project: transcribing Doina music, composing for classical guitar, and performing in Romania.',
  },
]
