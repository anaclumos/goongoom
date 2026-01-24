"use client"

import { useUser } from "@clerk/nextjs"
import { useMutation } from "convex/react"
import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"
import { api } from "@/convex/_generated/api"
import { type Locale, localeNames, locales } from "@/i18n/config"
import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"

export function LocaleSelector() {
  const t = useTranslations("settings")
  const currentLocale = useLocale()
  const { user } = useUser()
  const [selectedLocale, setSelectedLocale] = useState<Locale>(
    currentLocale as Locale
  )
  const [isPending, setIsPending] = useState(false)
  const updateLocale = useMutation(api.users.updateLocale)

  function handleLocaleChange(value: string) {
    const locale = value as Locale
    setSelectedLocale(locale)
    setIsPending(true)
    updateLocale({
      clerkId: user?.id ?? "",
      locale,
    }).finally(() => setIsPending(false))
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="font-semibold text-foreground">
          {t("languageSettings")}
        </h3>
        <p className="text-muted-foreground text-sm">
          {t("languageSettingsDescription")}
        </p>
      </div>

      <RadioGroup
        className="flex w-full gap-2"
        disabled={isPending}
        onValueChange={handleLocaleChange}
        value={selectedLocale}
      >
        {locales.map((locale) => (
          <Label
            className="group flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-border/50 bg-background px-4 py-3 transition-all hover:border-emerald/30 hover:bg-emerald/5 disabled:opacity-50 has-data-checked:border-emerald/50 has-data-checked:bg-emerald/5"
            key={locale}
          >
            <RadioGroupItem id={`locale-${locale}`} value={locale} />
            <span className="font-medium text-muted-foreground text-sm transition-colors group-has-data-checked:text-foreground">
              {localeNames[locale]}
            </span>
          </Label>
        ))}
      </RadioGroup>
    </div>
  )
}
