'use client'

import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from 'react'
import { clipSquircleObj, type SquircleOptionsClip } from 'html-squircle'

function supportsNativeSquircle(): boolean {
  if (typeof window === 'undefined') return true
  return CSS.supports('corner-shape', 'squircle')
}

let cachedSupport: boolean | null = null
function getNativeSquircleSupport(): boolean {
  if (cachedSupport === null) {
    cachedSupport = supportsNativeSquircle()
  }
  return cachedSupport
}

type SquircleOptions = Omit<SquircleOptionsClip, 'width' | 'height'>

export function useSquircle<T extends HTMLElement>(
  ref: RefObject<T | null>,
  options: SquircleOptions = {}
): React.CSSProperties {
  const [style, setStyle] = useState<React.CSSProperties>({})
  const observerRef = useRef<ResizeObserver | null>(null)

  useEffect(() => {
    if (getNativeSquircleSupport()) return

    const element = ref.current
    if (!element) return

    const updateClipPath = () => {
      const rect = element.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return

      const clipStyle = clipSquircleObj({
        width: rect.width,
        height: rect.height,
        ...options,
      })

      setStyle(clipStyle as React.CSSProperties)
    }

    updateClipPath()

    observerRef.current = new ResizeObserver(updateClipPath)
    observerRef.current.observe(element)

    return () => {
      observerRef.current?.disconnect()
    }
  }, [ref, options])

  return style
}

export function useNativeSquircleSupport(): boolean {
  return useSyncExternalStore(
    () => () => {},
    getNativeSquircleSupport,
    () => true
  )
}

export { getNativeSquircleSupport }
