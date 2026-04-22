import { render, screen } from '@testing-library/react'
import { Nav } from '@/components/layout/nav'

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ href, children, className, ...props }: { href: string; children: React.ReactNode; className?: string; [key: string]: unknown }) => (
    <a href={href} className={className} {...props}>{children}</a>
  ),
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}))

import { usePathname } from 'next/navigation'

describe('Nav', () => {
  it('renders site name and all nav links', () => {
    render(<Nav />)
    expect(screen.getByText('Timothy Hall')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about')
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects')
    expect(screen.getByRole('link', { name: 'Music' })).toHaveAttribute('href', '/music')
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toBeInTheDocument()
  })

  it('highlights the active link', () => {
    vi.mocked(usePathname).mockReturnValue('/about')
    render(<Nav />)
    const aboutLink = screen.getByRole('link', { name: 'About' })
    expect(aboutLink).toHaveClass('text-white')
  })
})
