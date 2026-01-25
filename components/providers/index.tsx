'use client'

import { EscapeInAppBrowser } from 'eiab/react'
import { ThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'
import { PasskeySetupModal } from '@/components/auth/passkey-setup-modal'
import { AppShellWrapper } from '@/components/layout/app-shell-wrapper'
import { NavigationProvider } from '@/components/navigation/navigation-provider'
import { PushNotificationProvider } from '@/components/notifications/push-provider'
import { IntlProvider } from '@/components/providers/intl-provider'
import { UserProvider } from '@/components/providers/user-provider'
import { AddToHomeScreenNudge } from '@/components/pwa/add-to-homescreen-nudge'
import { ThemeCookieSync } from '@/components/theme/theme-cookie-sync'
import { Toaster } from '@/components/ui/sonner'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <IntlProvider>
      <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange enableSystem>
        <ThemeCookieSync />
        <UserProvider>
          <NavigationProvider />
          <EscapeInAppBrowser />
          <AppShellWrapper>
            <main className="flex-1">{children}</main>
          </AppShellWrapper>
          <PasskeySetupModal />
          <AddToHomeScreenNudge />
          <PushNotificationProvider />
          <Toaster />
        </UserProvider>
      </ThemeProvider>
    </IntlProvider>
  )
}
