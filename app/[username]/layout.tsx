'use client'

import { useParams } from 'next/navigation'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { SignatureColorProvider } from '@/components/theme/signature-color-provider'

interface ProfileLayoutProps {
  children: React.ReactNode
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  const { username } = useParams<{ username: string }>()
  const dbUser = useQuery(api.users.getByUsername, { username })

  return <SignatureColorProvider signatureColor={dbUser?.signatureColor}>{children}</SignatureColorProvider>
}
