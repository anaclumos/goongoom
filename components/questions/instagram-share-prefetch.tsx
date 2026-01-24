"use client"

import { useTheme } from "next-themes"
import { useEffect, useMemo } from "react"

interface InstagramSharePrefetchProps {
  imageUrl: string
}

export function InstagramSharePrefetch({
  imageUrl,
}: InstagramSharePrefetchProps) {
  const { resolvedTheme } = useTheme()

  const themedImageUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return imageUrl
    }
    const url = new URL(imageUrl, window.location.origin)
    if (resolvedTheme === "dark") {
      url.searchParams.set("dark", "1")
    }
    return url.pathname + url.search
  }, [imageUrl, resolvedTheme])

  useEffect(() => {
    let cancelled = false

    async function prefetch() {
      try {
        const response = await fetch(themedImageUrl, { cache: "force-cache" })
        if (cancelled || !response.ok) {
          return
        }
        await response.blob()
      } catch {
        /* empty */
      }
    }

    prefetch()
    return () => {
      cancelled = true
    }
  }, [themedImageUrl])

  return null
}
