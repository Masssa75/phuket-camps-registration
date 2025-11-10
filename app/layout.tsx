import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Phuket Nature Camp - Bamboo Valley Phuket',
  description: 'Nature-based educational camps for children in Phuket, Thailand',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
