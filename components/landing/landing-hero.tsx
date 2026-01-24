import { HeroAuthButtons } from "@/components/auth/auth-buttons"
import { Badge } from "@/components/ui/badge"

interface LandingHeroProps {
  t: (key: string) => string
}

export function LandingHero({ t }: LandingHeroProps) {
  return (
    <div className="relative overflow-hidden pt-16 md:pt-32">
      <div className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-sky-400 to-primary opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 pb-24 text-center">
        <Badge
          className="mb-8 gap-2 border-secondary/20 bg-secondary/10 px-4 py-1.5 text-secondary-foreground hover:bg-secondary/20"
          variant="secondary"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-secondary" />
          </span>
          <span className="font-medium text-sm tracking-wide">
            {t("hotTitle")}
          </span>
        </Badge>

        <h1 className="mb-8 text-balance font-extrabold text-5xl text-foreground leading-tight tracking-tight sm:text-7xl">
          <span className="bg-gradient-to-r from-primary to-sky-400 bg-clip-text text-transparent">
            {t("heroTitle")}
          </span>
        </h1>

        <p className="mx-auto mb-12 max-w-2xl whitespace-pre-line text-lg text-muted-foreground leading-relaxed sm:text-xl">
          {t("heroDescription")}
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <HeroAuthButtons />
        </div>
      </div>
    </div>
  )
}
