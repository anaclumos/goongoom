'use client'

import { useClerk } from '@clerk/nextjs'
import type { MouseEvent, PropsWithChildren, ReactElement } from 'react'
import { Children, cloneElement } from 'react'
import { readReferralCookie } from '@/lib/referrals'

type OpenSignUpArgs = NonNullable<Parameters<ReturnType<typeof useClerk>['openSignUp']>[0]>
type RedirectToSignUpArgs = NonNullable<Parameters<ReturnType<typeof useClerk>['redirectToSignUp']>[0]>

type ReferralSignUpButtonProps = PropsWithChildren<{
  children: ReactElement
  unsafeMetadata?: OpenSignUpArgs extends { unsafeMetadata?: infer U } ? U : Record<string, unknown>
  appearance?: OpenSignUpArgs['appearance']
  fallbackRedirectUrl?: string
  forceRedirectUrl?: string
  signInFallbackRedirectUrl?: string
  signInForceRedirectUrl?: string
  mode?: 'modal' | 'redirect'
  initialValues?: OpenSignUpArgs['initialValues']
  oauthFlow?: OpenSignUpArgs['oauthFlow']
}> &
  Omit<RedirectToSignUpArgs, 'signUpFallbackRedirectUrl' | 'signUpForceRedirectUrl'> &
  Record<string, unknown>

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
