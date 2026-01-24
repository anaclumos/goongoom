import { getClerkUserByUsername } from "@/lib/clerk"
import { getSignatureColor } from "@/lib/colors/signature-colors"
import { getOrCreateUser } from "@/lib/db/queries"

interface ProfileLayoutProps {
  children: React.ReactNode
  params: Promise<{ username: string }>
}

export default async function ProfileLayout({
  children,
  params,
}: ProfileLayoutProps) {
  const { username } = await params

  const clerkUser = await getClerkUserByUsername(username)
  const dbUser = clerkUser ? await getOrCreateUser(clerkUser.clerkId) : null
  const colors = getSignatureColor(dbUser?.signatureColor)

  const colorOverrideCSS = `
    :root {
      --emerald: ${colors.light.primary};
      --success: ${colors.light.primary};
    }
    .dark {
      --emerald: ${colors.dark.primary};
      --success: ${colors.dark.primary};
    }
  `

  return (
    <>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Server-rendered CSS for theme injection */}
      <style dangerouslySetInnerHTML={{ __html: colorOverrideCSS }} />
      {children}
    </>
  )
}
