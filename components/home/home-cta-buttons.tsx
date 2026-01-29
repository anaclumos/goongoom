'use client'

import Link from 'next/link'
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { PasskeySignInButton } from '@/components/auth/passkey-sign-in-button'
import { ReferralSignUpButton } from '@/components/auth/referral-signup-button'
import { Button } from '@/components/ui/button'

interface HomeCTAButtonsProps {
  startLabel: string
  loginLabel: string
  isLoggedIn?: boolean
  profileLabel?: string
  profileUrl?: string
}

export function HomeCTAButtons({
  startLabel,
  loginLabel,
  isLoggedIn = false,
  profileLabel,
  profileUrl,
}: HomeCTAButtonsProps) {
  if (isLoggedIn && profileUrl && profileLabel) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-3">
        <Link
          href={profileUrl}
          className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-pink-500 to-orange-500 px-10 text-lg font-medium text-white shadow-lg shadow-pink-500/25 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
        >
          <HugeiconsIcon className="mr-1" icon={ArrowLeft01Icon} size={16} />
          <span>{profileLabel}</span>
          <HugeiconsIcon className="transition-transform duration-300" icon={ArrowRight01Icon} size={20} />
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-3">
      <ReferralSignUpButton mode="modal">
        <button
          type="button"
          className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-pink-500 to-orange-500 px-10 text-lg font-medium text-white shadow-lg shadow-pink-500/25 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
        >
          <span className="mr-2">{startLabel}</span>
          <HugeiconsIcon className="transition-transform duration-300" icon={ArrowRight01Icon} size={20} />
        </button>
      </ReferralSignUpButton>
      <PasskeySignInButton>
        <Button variant="ghost" size="lg" className="h-14 rounded-full px-8 font-medium">
          {loginLabel}
        </Button>
      </PasskeySignInButton>
    </div>
  )
}
