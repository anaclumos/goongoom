import {
  Share01Icon,
  ShieldKeyIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"

interface LandingFeaturesProps {
  t: (key: string) => string
  tShare: (key: string) => string
}

export function LandingFeatures({ t, tShare }: LandingFeaturesProps) {
  return (
    <div className="border-border/40 border-y bg-muted/30 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <Card className="group hover-lift relative overflow-hidden border-border/50 bg-background/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:bg-background hover:shadow-lg hover:shadow-primary/5">
            <div className="absolute inset-x-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <CardContent className="space-y-6 p-8">
              <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <HugeiconsIcon icon={ShieldKeyIcon} size={28} />
              </div>
              <div className="space-y-3">
                <CardTitle className="font-bold text-xl">
                  {t("safeAnonymity")}
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground/80 leading-relaxed">
                  {t("safeAnonymityDescription")}
                </CardDescription>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover-lift relative overflow-hidden border-border/50 bg-background/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:bg-background hover:shadow-lg hover:shadow-primary/5">
            <div className="absolute inset-x-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <CardContent className="space-y-6 p-8">
              <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <HugeiconsIcon icon={Share01Icon} size={28} />
              </div>
              <div className="space-y-3">
                <CardTitle className="font-bold text-xl">
                  {tShare("easyShare")}
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground/80 leading-relaxed">
                  {tShare("easyShareDescription")}
                </CardDescription>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover-lift relative overflow-hidden border-border/50 bg-background/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:bg-background hover:shadow-lg hover:shadow-primary/5">
            <div className="absolute inset-x-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <CardContent className="space-y-6 p-8">
              <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <HugeiconsIcon icon={SparklesIcon} size={28} />
              </div>
              <div className="space-y-3">
                <CardTitle className="font-bold text-xl">
                  {tShare("instagramShare")}
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground/80 leading-relaxed">
                  {tShare("instagramShareDescription")}
                </CardDescription>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
