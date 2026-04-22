import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { Nav } from '@/components/layout/nav'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: 'Timothy Hall',
  description: 'Software engineer and musician based in Boston.',
  openGraph: {
    title: 'Timothy Hall',
    description: 'Software engineer and musician based in Boston.',
    url: 'https://timothyryanhall.com',
    siteName: 'Timothy Hall',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="bg-background text-white antialiased">
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  )
}
