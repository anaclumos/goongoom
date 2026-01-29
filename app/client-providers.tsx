'use client'

import { enUS, jaJP, koKR } from '@clerk/localizations'
import { ClerkProvider } from '@clerk/nextjs'
import type { ReactNode } from 'react'
import { ConvexClientProvider } from '@/app/ConvexClientProvider'
import { Providers } from '@/components/providers'

import { type Locale } from '@/i18n/config'
import { localeStore } from '@/i18n/locale-store'

const clerkLocalizations: Record<Locale, typeof koKR> = {
  ko: koKR,
  en: enUS,
  ja: jaJP,
}

interface ClientProvidersProps {
  children: ReactNode
  initialLocale: Locale
}

export function ClientProviders({ children, initialLocale }: ClientProvidersProps) {
  if (typeof window === 'undefined') {
    localeStore.initialize(initialLocale)
  }
  const locale = localeStore.getSnapshot()

  return (
    <ClerkProvider localization={clerkLocalizations[locale]}>
      <ConvexClientProvider>
        <Providers initialLocale={initialLocale}>{children}</Providers>
      </ConvexClientProvider>
    </ClerkProvider>
  )
}
