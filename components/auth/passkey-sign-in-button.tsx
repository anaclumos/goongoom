'use client'

import { useClerk, useSignIn } from '@clerk/nextjs'
import posthog from 'posthog-js'
import { cloneElement, isValidElement, useCallback, useState, type ReactElement } from 'react'

interface PasskeySignInButtonProps {
  children: ReactElement<{ onClick?: () => void }>
}

export function PasskeySignInButton({ children }: PasskeySignInButtonProps) {
  const { signIn, setActive } = useSignIn()
  const clerk = useClerk()
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const handleSignIn = useCallback(async () => {
    if (!signIn || isAuthenticating) {
      return
    }

    setIsAuthenticating(true)
    posthog.capture('passkey_signin_attempted')

    try {
      const result = await signIn.authenticateWithPasskey({
        flow: 'discoverable',
      })

      if (result.status === 'complete') {
        posthog.capture('passkey_signin_success')
        await setActive({ session: result.createdSessionId })
        return
      }

      posthog.capture('passkey_signin_fallback', { reason: 'incomplete_status' })
      clerk.openSignIn()
    } catch {
      posthog.capture('passkey_signin_fallback', { reason: 'error' })
      clerk.openSignIn()
    } finally {
      setIsAuthenticating(false)
    }
  }, [signIn, setActive, clerk, isAuthenticating])

  if (!isValidElement(children)) {
    return null
  }

  return cloneElement(children, { onClick: handleSignIn })
}
