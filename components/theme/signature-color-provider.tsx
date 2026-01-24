"use client"

import { useEffect, useState } from "react"
import { getSignatureColor } from "@/lib/colors/signature-colors"

interface SignatureColorProviderProps {
  signatureColor: string | null | undefined
}

export function SignatureColorProvider({
  signatureColor,
}: SignatureColorProviderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const colors = getSignatureColor(signatureColor)

  const colorOverrideCSS = `
    :root {
      --emerald: ${colors.light.primary};
      --success: ${colors.light.primary};
    }
    .dark {
      --emerald: ${colors.dark.primary};
      --success: ${colors.dark.primary};
    }
  `

  return (
    // biome-ignore lint/security/noDangerouslySetInnerHtml: Server-controlled CSS for theme injection
    <style dangerouslySetInnerHTML={{ __html: colorOverrideCSS }} />
  )
}
