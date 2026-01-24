"use client"

import NextLink from "next/link"
import { useRouter } from "next/navigation"
import type { ComponentProps, MouseEvent } from "react"
import { imageCache, prefetchImage } from "./prefetch-cache"
import { useUltralink } from "./use-ultralink"

type NextLinkProps = ComponentProps<typeof NextLink>

interface UltralinkProps extends NextLinkProps {
  prefetchImages?: string[]
  prefetchDebounce?: number
}

export function Ultralink({
  children,
  prefetchImages = [],
  prefetchDebounce = 300,
  onMouseEnter,
  onMouseDown,
  onNavigate,
  ...props
}: UltralinkProps) {
  const router = useRouter()
  const href = String(props.href)

  const ref = useUltralink({
    href,
    prefetch: props.prefetch !== false,
    prefetchImages,
    debounceMs: prefetchDebounce,
  })

  const handleMouseEnter = (e: MouseEvent<HTMLAnchorElement>) => {
    router.prefetch(href)

    const cachedImages = imageCache.get(href) || prefetchImages
    for (const src of cachedImages) {
      prefetchImage(src)
    }

    onMouseEnter?.(e)
  }

  const handleMouseDown = (e: MouseEvent<HTMLAnchorElement>) => {
    const url = new URL(href, window.location.href)
    if (
      url.origin === window.location.origin &&
      e.button === 0 &&
      !e.altKey &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.shiftKey
    ) {
      e.preventDefault()
      router.push(href)
    }

    onMouseDown?.(e)
  }

  const handleNavigate = (
    e: Parameters<NonNullable<NextLinkProps["onNavigate"]>>[0]
  ) => {
    document.documentElement.dataset.navDirection = "forward"
    onNavigate?.(e)
  }

  return (
    <NextLink
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onNavigate={handleNavigate}
      prefetch={false}
      ref={ref}
      {...props}
    >
      {children}
    </NextLink>
  )
}
