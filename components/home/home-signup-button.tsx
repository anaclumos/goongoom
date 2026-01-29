'use client'

import { ReferralSignUpButton } from '@/components/auth/referral-signup-button'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface HomeSignUpButtonProps {
  label: string
  className?: string
}

export function HomeSignUpButton({ label, className }: HomeSignUpButtonProps) {
  return (
    <ReferralSignUpButton mode="modal">
      <Button size="lg" className={cn('h-11 rounded-full px-6 bg-primary text-primary-foreground hover:opacity-90', className)}>
        {label}
      </Button>
    </ReferralSignUpButton>
  )
}
