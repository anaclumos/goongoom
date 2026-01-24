'use client'

import { useTheme } from 'next-themes'
import { useEffect } from 'react'

/**
 * Syncs the resolved theme to a cookie so server components
 * (like OG images) can access the user's theme preference.
 */
export function ThemeCookieSync() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    if (resolvedTheme) {
      document.cookie = `theme=${resolvedTheme};path=/;max-age=31536000;SameSite=Lax`
    }
  }, [resolvedTheme])

  return null
}
