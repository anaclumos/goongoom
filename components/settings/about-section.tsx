import {
  ArrowUpRight01Icon,
  Bug02Icon,
  Idea01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { getTranslations } from "next-intl/server"
import { Card, CardContent } from "@/components/ui/card"

const ANACLUMOS_URL = "https://goongoom.com/anaclumos"

export async function AboutSection() {
  const t = await getTranslations("settings")

  return (
    <Card>
      <CardContent className="py-0">
        <div className="divide-y divide-border/30">
          <a
            className="group flex items-center gap-3 py-3 transition-colors hover:text-foreground"
            href={ANACLUMOS_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            <div className="flex size-8 items-center justify-center rounded-full bg-muted/50 transition-colors group-hover:bg-emerald/10">
              <HugeiconsIcon
                className="size-4 text-muted-foreground transition-colors group-hover:text-emerald"
                icon={UserIcon}
                strokeWidth={2}
              />
            </div>
            <span className="flex-1 font-medium text-muted-foreground text-sm transition-colors group-hover:text-foreground">
              {t("madeBy")}
            </span>
            <HugeiconsIcon
              className="size-4 text-muted-foreground/50 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald"
              icon={ArrowUpRight01Icon}
              strokeWidth={2}
            />
          </a>

          <a
            className="group flex items-center gap-3 py-3 transition-colors hover:text-foreground"
            href={ANACLUMOS_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            <div className="flex size-8 items-center justify-center rounded-full bg-muted/50 transition-colors group-hover:bg-rose-500/10">
              <HugeiconsIcon
                className="size-4 text-muted-foreground transition-colors group-hover:text-rose-500"
                icon={Bug02Icon}
                strokeWidth={2}
              />
            </div>
            <span className="flex-1 font-medium text-muted-foreground text-sm transition-colors group-hover:text-foreground">
              {t("reportBug")}
            </span>
            <HugeiconsIcon
              className="size-4 text-muted-foreground/50 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-rose-500"
              icon={ArrowUpRight01Icon}
              strokeWidth={2}
            />
          </a>

          <a
            className="group flex items-center gap-3 py-3 transition-colors hover:text-foreground"
            href={ANACLUMOS_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            <div className="flex size-8 items-center justify-center rounded-full bg-muted/50 transition-colors group-hover:bg-amber-500/10">
              <HugeiconsIcon
                className="size-4 text-muted-foreground transition-colors group-hover:text-amber-500"
                icon={Idea01Icon}
                strokeWidth={2}
              />
            </div>
            <span className="flex-1 font-medium text-muted-foreground text-sm transition-colors group-hover:text-foreground">
              {t("suggestFeature")}
            </span>
            <HugeiconsIcon
              className="size-4 text-muted-foreground/50 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-amber-500"
              icon={ArrowUpRight01Icon}
              strokeWidth={2}
            />
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
