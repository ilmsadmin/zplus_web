import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ZPlus Web',
  description: 'ZPlus Web Application',
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