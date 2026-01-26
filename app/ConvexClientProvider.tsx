'use client'

import { useAuth } from '@clerk/nextjs'
import { ConvexQueryCacheProvider } from 'convex-helpers/react/cache/provider'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import type { ReactNode } from 'react'
import { convex } from '@/lib/convex/client'

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <ConvexQueryCacheProvider>{children}</ConvexQueryCacheProvider>
    </ConvexProviderWithClerk>
  )
}
