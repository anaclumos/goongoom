'use client'

import { enUS, jaJP, koKR } from '@clerk/localizations'
import { ClerkProvider } from '@clerk/nextjs'
import { useState, type ReactNode } from 'react'
import { ConvexClientProvider } from '@/app/ConvexClientProvider'
import { Providers } from '@/components/providers'
import { type Locale, defaultLocale } from '@/i18n/config'
import { localeStore } from '@/i18n/locale-store'

const clerkLocalizations: Record<Locale, typeof koKR> = {
  ko: koKR,
  en: enUS,
  ja: jaJP,
}

interface ClientProvidersProps {
  children: ReactNode
}

export function ClientProviders({ children }: ClientProvidersProps) {
  const locale = localeStore.getSnapshot()

  const [signUpUnsafeMetadata] = useState<
    Record<string, string> | undefined
  >(() => {
    if (typeof document === 'undefined') return undefined
    try {
      const match = document.cookie.match(/(^| )referral=([^;]+)/)
      const referralRaw = match?.[2]
      if (!referralRaw) return undefined
      const referralData = JSON.parse(decodeURIComponent(referralRaw))
      return {
        referrerUsername: referralData.u,
        utmSource: referralData.s,
        utmMedium: referralData.m,
        utmCampaign: referralData.c,
        utmTerm: referralData.t,
        utmContent: referralData.n,
      }
    } catch {
      return undefined
    }
  })

  return (
    <ClerkProvider
      localization={clerkLocalizations[locale]}
      // @ts-expect-error - signUpUnsafeMetadata is a custom prop for referral tracking
      signUpUnsafeMetadata={signUpUnsafeMetadata}
    >
      <ConvexClientProvider>
        <Providers initialLocale={defaultLocale}>{children}</Providers>
      </ConvexClientProvider>
    </ClerkProvider>
  )
}
