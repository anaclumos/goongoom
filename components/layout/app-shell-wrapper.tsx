import { auth } from "@clerk/nextjs/server"
import { AppShell } from "@/components/layout/app-shell"
import { getClerkUsersByIds } from "@/lib/clerk"
import { getUnansweredQuestions } from "@/lib/db/queries"

interface AppShellWrapperProps {
  children: React.ReactNode
}

export async function AppShellWrapper({ children }: AppShellWrapperProps) {
  const { userId: clerkId } = await auth()

  let recentQuestions: Array<{
    id: number
    content: string
    createdAt: Date
    senderName?: string
    senderAvatarUrl?: string | null
    isAnonymous?: boolean
  }> = []

  if (clerkId) {
    const questions = await getUnansweredQuestions(clerkId)
    const recentFive = questions.slice(0, 5)

    const senderIds = Array.from(
      new Set(
        recentFive
          .filter((q) => q.isAnonymous !== 1 && q.senderClerkId)
          .map((q) => q.senderClerkId as string)
      )
    )

    const senderMap =
      senderIds.length > 0 ? await getClerkUsersByIds(senderIds) : new Map()

    recentQuestions = recentFive.map((q) => {
      const sender =
        q.isAnonymous !== 1 && q.senderClerkId
          ? senderMap.get(q.senderClerkId)
          : null

      return {
        id: q.id,
        content: q.content,
        createdAt: q.createdAt,
        senderName: sender?.displayName || sender?.username || undefined,
        senderAvatarUrl: sender?.avatarUrl || null,
        isAnonymous: q.isAnonymous === 1,
      }
    })
  }

  return <AppShell recentQuestions={recentQuestions}>{children}</AppShell>
}
