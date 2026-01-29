'use client'

import { useClerk } from '@clerk/nextjs'
import type { SignUpButtonProps } from '@clerk/shared/types'
import type { MouseEvent, PropsWithChildren, ReactElement } from 'react'
import { Children, cloneElement } from 'react'
import { readReferralCookie } from '@/lib/referrals'

type ReferralSignUpButtonProps = PropsWithChildren<SignUpButtonProps> & {
  children: ReactElement
}

export function ReferralSignUpButton({
  children,
  unsafeMetadata,
  appearance,
  fallbackRedirectUrl,
  forceRedirectUrl,
  signInFallbackRedirectUrl,
  signInForceRedirectUrl,
  mode,
  initialValues,
  oauthFlow,
  ...rest
}: ReferralSignUpButtonProps) {
  const clerk = useClerk()
  const child = Children.only(children) as ReactElement<{ onClick?: (event: MouseEvent) => void }>

  const clickHandler = () => {
    const referralMetadata = readReferralCookie()
    const mergedUnsafeMetadata =
      referralMetadata && unsafeMetadata ? { ...unsafeMetadata, ...referralMetadata } : referralMetadata ?? unsafeMetadata

    const redirectOptions = {
      fallbackRedirectUrl,
      forceRedirectUrl,
      signInFallbackRedirectUrl,
      signInForceRedirectUrl,
      initialValues,
      oauthFlow,
    }

    if (mode === 'modal') {
      return clerk.openSignUp({
        ...redirectOptions,
        appearance,
        unsafeMetadata: mergedUnsafeMetadata,
      })
    }

    return clerk.redirectToSignUp({
      ...redirectOptions,
      signUpFallbackRedirectUrl: fallbackRedirectUrl,
      signUpForceRedirectUrl: forceRedirectUrl,
    })
  }

  const wrappedChildClickHandler = async (event: MouseEvent) => {
    await child.props.onClick?.(event)
    return clickHandler()
  }

  return cloneElement(child, { ...rest, onClick: wrappedChildClickHandler })
}
