import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rabbitt AI - Sales Insight Automator',
  description: 'AI-powered sales spreadsheet analysis and automated email summaries',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
