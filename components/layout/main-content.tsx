import type { ReactNode } from "react"

interface MainContentProps {
  children: ReactNode
}

export function MainContent({ children }: MainContentProps) {
  return <div className="mx-auto max-w-3xl p-4 pt-20 sm:p-6">{children}</div>
}
