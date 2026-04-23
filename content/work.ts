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
    role: 'Senior Software Engineer & Platform Engineer',
    start: 'Oct 2022',
    end: 'Present',
    location: 'Boston, MA',
    tech: ['Terraform', 'Python', 'AWS', 'Java', 'Spring Boot', 'Jenkins', 'New Relic'],
  },
  {
    company: 'Bellese Technologies',
    role: 'Full Stack Engineer',
    start: 'Oct 2022',
    end: 'Mar 2023',
    location: 'Boston, MA',
    tech: ['Java', 'FHIR', 'AWS', 'TypeScript'],
  },
  {
    company: 'Quil Health',
    role: 'Senior Full Stack Engineer',
    start: 'Apr 2022',
    end: 'Oct 2022',
    location: 'Boston, MA',
    tech: ['Node.js', 'Express', 'Java', 'AWS CDK', 'Jest', 'Datadog'],
  },
  {
    company: 'Hepster Digital Insurance',
    role: 'Backend & Infrastructure Developer',
    start: 'Aug 2019',
    end: 'Dec 2021',
    location: 'Germany',
    tech: ['Kotlin', 'Spring Boot', 'PostgreSQL', 'Keycloak', 'Terraform', 'Docker', 'AWS'],
  },
  {
    company: 'SES Networks',
    role: 'Software Engineer in Test',
    start: 'Jul 2018',
    end: 'Aug 2019',
    location: 'Manassas, VA',
    tech: ['Go', 'Python', 'MySQL', 'Docker'],
  },
]
