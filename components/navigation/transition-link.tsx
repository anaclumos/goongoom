"use client"

import Link from "next/link"
import type { ComponentProps } from "react"

type TransitionLinkProps = ComponentProps<typeof Link>

export function TransitionLink({ ...props }: TransitionLinkProps) {
  return (
    <Link
      onNavigate={() => {
        document.documentElement.dataset.navDirection = "forward"
      }}
      {...props}
    />
  )
}
