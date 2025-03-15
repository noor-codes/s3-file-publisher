import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'S3 File Publisher - Redirecting',
  description: 'Redirecting to your file...',
}

export default function ShortlinkLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="shortlink-container">
      {children}
    </div>
  )
}
