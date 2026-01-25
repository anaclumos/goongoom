import { enUS, jaJP, koKR } from '@clerk/localizations'
import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import Script from 'next/script'
import { ConvexClientProvider } from '@/app/ConvexClientProvider'
import { Providers } from '@/components/providers'
import type { Locale } from '@/i18n/config'
import { getUserLocale } from '@/i18n/request'
import './globals.css'

const clerkLocalizations: Record<Locale, typeof koKR> = {
  ko: koKR,
  en: enUS,
  ja: jaJP,
}

const lineSeedKR = localFont({
  src: [
    { path: '../public/fonts/LINESeedKR-Th.woff2', weight: '100' },
    { path: '../public/fonts/LINESeedKR-Rg.woff2', weight: '400' },
    { path: '../public/fonts/LINESeedKR-Bd.woff2', weight: '700' },
  ],
  variable: '--font-line-seed-kr',
  display: 'swap',
})

const lineSeedJP = localFont({
  src: [
    { path: '../public/fonts/LINESeedJP_OTF_Th.woff2', weight: '100' },
    { path: '../public/fonts/LINESeedJP_OTF_Rg.woff2', weight: '400' },
    { path: '../public/fonts/LINESeedJP_OTF_Bd.woff2', weight: '700' },
    { path: '../public/fonts/LINESeedJP_OTF_Eb.woff2', weight: '800' },
  ],
  variable: '--font-line-seed-jp',
  display: 'swap',
})

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getUserLocale()

  return (
    <ClerkProvider localization={clerkLocalizations[locale]}>
        <html className={`${lineSeedKR.variable} ${lineSeedJP.variable}`} lang={locale} suppressHydrationWarning>
        <body className="bg-background font-sans antialiased">
          <ConvexClientProvider>
            <Providers>{children}</Providers>
          </ConvexClientProvider>
          <Script src="/_vercel/insights/script.js" strategy="afterInteractive" />
          <Script src="/_vercel/speed-insights/script.js" strategy="afterInteractive" />
        </body>
      </html>
    </ClerkProvider>
  )
}
