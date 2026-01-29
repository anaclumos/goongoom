import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import { SignatureColorProvider } from '@/components/theme/signature-color-provider'

interface ProfileLayoutProps {
  children: React.ReactNode
  params: Promise<{ username: string }>
}

export default async function ProfileLayout({ children, params }: ProfileLayoutProps) {
  const { username } = await params

  let signatureColor: string | null | undefined = null
  try {
    const dbUser = await fetchQuery(api.users.getByUsername, { username })
    signatureColor = dbUser?.signatureColor ?? null
  } catch {
    signatureColor = null
  }

  return <SignatureColorProvider signatureColor={signatureColor}>{children}</SignatureColorProvider>
}
