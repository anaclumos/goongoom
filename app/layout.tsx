import { koKR } from '@clerk/localizations'
import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata, Viewport } from 'next'
import { ConvexClientProvider } from '@/app/ConvexClientProvider'
import { Providers } from '@/components/providers'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: '궁금닷컴',
  description: '궁금한 건 뭐든 물어보고 솔직한 답을 받아요',
}

export const viewport: Viewport = {
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0ea5e9' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider localization={koKR}>
      <html className={inter.variable} lang="ko" suppressHydrationWarning>
        <body className="bg-background font-sans antialiased">
          <ConvexClientProvider>
            <Providers>{children}</Providers>
          </ConvexClientProvider>
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  )
}
