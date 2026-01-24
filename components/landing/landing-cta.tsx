import { SentIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { BottomCTAButton } from "@/components/auth/auth-buttons"

interface LandingCTAProps {
  t: (key: string, values?: Record<string, string | number | Date>) => string
  userCount: number
}

export function LandingCTA({ t, userCount }: LandingCTAProps) {
  return (
    <div className="relative overflow-hidden py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-background/50 p-8 text-center sm:p-16">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
          
          <div className="mb-8 inline-flex items-center justify-center rounded-2xl bg-primary/10 p-4 text-primary ring-1 ring-primary/20">
            <HugeiconsIcon icon={SentIcon} size={32} />
          </div>
          
          <h2 className="mb-6 text-balance font-bold text-3xl text-foreground tracking-tight sm:text-5xl">
            {t("ctaTitle")}
          </h2>
          
          <p className="mx-auto mb-10 max-w-lg text-lg text-muted-foreground leading-relaxed">
            {t("ctaDescription", { userCount })}
          </p>
          
          <BottomCTAButton />
        </div>
      </div>
    </div>
  )
}
