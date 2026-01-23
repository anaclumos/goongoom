"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

const historyStack: string[] = []

export function useNavigationDirection() {
  const pathname = usePathname()
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      historyStack.push(pathname)
      isInitialMount.current = false
      return
    }

    const prevPath = historyStack.at(-2)

    if (prevPath === pathname) {
      historyStack.pop()
      document.documentElement.dataset.navDirection = "back"
    } else {
      historyStack.push(pathname)
      document.documentElement.dataset.navDirection = "forward"
    }

    return () => {
      delete document.documentElement.dataset.navDirection
    }
  }, [pathname])

  useEffect(() => {
    function handlePopState() {
      document.documentElement.dataset.navDirection = "back"
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])
}
