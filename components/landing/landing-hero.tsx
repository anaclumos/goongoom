import { HeroAuthButtons } from "@/components/auth/auth-buttons"
import { Badge } from "@/components/ui/badge"

interface LandingHeroProps {
  t: (key: string) => string
}

export function LandingHero({ t }: LandingHeroProps) {
  return (
    <div className="relative overflow-hidden pt-16 md:pt-32">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/60 via-sky-50/40 to-transparent dark:from-emerald-950/30 dark:via-sky-950/20 dark:to-transparent" />

      <div className="fade-in absolute -top-24 -right-24 h-96 w-96 animate-in rounded-full bg-emerald-300/25 blur-3xl filter duration-700 dark:bg-emerald-400/15" />
      <div className="fade-in absolute top-48 -left-24 h-72 w-72 animate-in rounded-full bg-sky-300/25 blur-3xl filter delay-150 duration-700 dark:bg-sky-400/15" />
      <div className="fade-in absolute top-24 left-1/2 h-64 w-64 -translate-x-1/2 animate-in rounded-full bg-violet-300/20 blur-3xl filter delay-300 duration-700 dark:bg-violet-400/10" />

      <div className="relative mx-auto max-w-5xl px-6 pb-24 text-center">
        <Badge
          className="hover-lift mb-6 gap-2 border border-emerald-200/60 bg-background/60 transition-all duration-200 dark:border-emerald-500/20 dark:bg-background/30"
          variant="secondary"
        >
          <span className="size-2 rounded-full bg-gradient-to-r from-emerald-500 via-sky-500 to-violet-500" />
          <span className="font-semibold text-emerald-700 text-xs tracking-wide dark:text-emerald-300">
            {t("hotTitle")}
          </span>
        </Badge>

        <h1 className="mb-8 text-balance font-extrabold text-4xl text-foreground leading-tight tracking-tight sm:text-7xl">
          <span className="bg-gradient-to-r from-emerald-600 via-sky-600 to-violet-600 bg-clip-text text-transparent dark:from-emerald-400 dark:via-sky-400 dark:to-violet-400">
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
