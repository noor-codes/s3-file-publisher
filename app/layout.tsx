import './globals.css'

import type { Metadata } from 'next'

import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'

import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'S3 File Publisher',
  description: 'Upload and share files with MinIO S3-compatible storage',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        {children}
        <Toaster position='bottom-left' />
        <Script
          src='https://analytics.ramaki.app/script.js'
          data-website-id={process.env.NEXT_PUBLIC_ANALYTICS_ID}
          strategy='afterInteractive'
        />
      </body>
    </html>
  )
}
