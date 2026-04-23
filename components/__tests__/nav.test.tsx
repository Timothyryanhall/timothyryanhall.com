import { render, screen } from '@testing-library/react'
import { Nav } from '@/components/layout/nav'

vi.mock('next/link', () => ({
  default: ({ href, children, className, ...props }: { href: string; children: React.ReactNode; className?: string; [key: string]: unknown }) => (
    <a href={href} className={className} {...props}>{children}</a>
  ),
}))

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}))

import { usePathname } from 'next/navigation'

describe('Nav', () => {
  it('renders site name and only the Projects nav link', () => {
    render(<Nav />)
    expect(screen.getByText('Timothy Hall')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects')
    expect(screen.queryByRole('link', { name: 'About' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Music' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toBeInTheDocument()
  })

  it('highlights the active link', () => {
    vi.mocked(usePathname).mockReturnValue('/projects')
    render(<Nav />)
    const projectsLink = screen.getByRole('link', { name: 'Projects' })
    expect(projectsLink).toHaveClass('text-white')
  })
})
