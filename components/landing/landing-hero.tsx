import { HeroAuthButtons } from "@/components/auth/auth-buttons"
import { Badge } from "@/components/ui/badge"

interface LandingHeroProps {
  t: (key: string) => string
}

export function LandingHero({ t }: LandingHeroProps) {
  return (
    <div className="relative overflow-hidden pt-16 md:pt-32">
      <div className="relative mx-auto max-w-5xl px-6 pb-24 text-center">
        <Badge
          className="mb-6 gap-2 border border-emerald-200/60 bg-background/60 dark:border-emerald-500/20 dark:bg-background/30"
          variant="secondary"
        >
          <span className="size-2 rounded-full bg-emerald-500" />
          <span className="font-semibold text-emerald-700 text-xs tracking-wide dark:text-emerald-300">
            {t("hotTitle")}
          </span>
        </Badge>

        <h1 className="mb-8 text-balance font-extrabold text-4xl text-foreground leading-tight tracking-tight sm:text-7xl">
          <span className="text-emerald-600 dark:text-emerald-400">
            {t("heroTitle")}
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl whitespace-pre-line text-lg text-muted-foreground leading-relaxed sm:text-xl">
          {t("heroDescription")}
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <HeroAuthButtons />
        </div>
      </div>
    </div>
  )
}
