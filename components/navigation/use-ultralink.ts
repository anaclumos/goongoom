"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import { imageCache, markRouteSeen } from "./prefetch-cache"

interface UseUltralinkOptions {
  href: string
  prefetch?: boolean
  prefetchImages?: string[]
  debounceMs?: number
}

export function useUltralink({
  href,
  prefetch = true,
  prefetchImages = [],
  debounceMs = 300,
}: UseUltralinkOptions) {
  const ref = useRef<HTMLAnchorElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (!prefetch || typeof href !== "string") {
      return
    }

    const element = ref.current
    if (!element) {
      return
    }

    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting) {
          timeoutId = setTimeout(() => {
            if (markRouteSeen(href)) {
              router.prefetch(href)
              if (prefetchImages.length > 0) {
                imageCache.set(href, prefetchImages)
              }
            }
          }, debounceMs)
        } else if (timeoutId) {
          clearTimeout(timeoutId)
          timeoutId = null
        }
      },
      { rootMargin: "100px" }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [href, prefetch, prefetchImages, debounceMs, router])

  return ref
}
