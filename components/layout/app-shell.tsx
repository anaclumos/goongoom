"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { MobileTabBar } from "@/components/layout/mobile-tab-bar"
import { QuickAnswerDialog } from "@/components/questions/quick-answer-dialog"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

interface RecentQuestion {
  id: string
  content: string
  createdAt: number
  senderName?: string
  senderAvatarUrl?: string | null
  isAnonymous?: boolean
}

interface AppShellProps {
  children: React.ReactNode
  recentQuestions?: RecentQuestion[]
  defaultSidebarOpen?: boolean
}

export function AppShell({
  children,
  recentQuestions = [],
  defaultSidebarOpen = true,
}: AppShellProps) {
  const [selectedQuestion, setSelectedQuestion] =
    useState<RecentQuestion | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  function handleQuestionClick(id: string) {
    const question = recentQuestions.find((q) => q.id === id)
    if (question) {
      setSelectedQuestion(question)
      setDialogOpen(true)
    }
  }

  function handleDialogChange(open: boolean) {
    setDialogOpen(open)
    if (!open) {
      setSelectedQuestion(null)
    }
  }

  const sidebarQuestions = recentQuestions.map((q) => ({
    id: q.id,
    content: q.content,
    createdAt: q.createdAt,
  }))

  return (
    <SidebarProvider defaultOpen={defaultSidebarOpen}>
      <AppSidebar
        onQuestionClick={handleQuestionClick}
        recentQuestions={sidebarQuestions}
      />
      <SidebarInset className="pb-20 md:pb-0">{children}</SidebarInset>
      <MobileTabBar />
      <QuickAnswerDialog
        onOpenChange={handleDialogChange}
        open={dialogOpen}
        question={selectedQuestion}
      />
    </SidebarProvider>
  )
}
