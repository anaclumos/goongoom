'use client'

import { useAuth } from '@clerk/nextjs'
import { LanguageCircleIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useMutation } from 'convex/react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import posthog from 'posthog-js'
import { api } from '@/convex/_generated/api'
import { type Locale, locales } from '@/i18n/config'
import { localeStore } from '@/i18n/locale-store'
import { Label } from '../ui/label'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'

const localeConfig = {
  ko: { labelKey: 'localeKorean', descriptionKey: 'localeKoreanDescription' },
  en: { labelKey: 'localeEnglish', descriptionKey: 'localeEnglishDescription' },
  ja: { labelKey: 'localeJapanese', descriptionKey: 'localeJapaneseDescription' },
} as const

export function LocaleSelector() {
  const t = useTranslations('settings')
  const currentLocale = useLocale() as Locale
  const { userId } = useAuth()
  const router = useRouter()
  const updateLocale = useMutation(api.users.updateLocale)

  function handleLocaleChange(value: string) {
    const locale = value as Locale
    if (locale === currentLocale) return
    posthog.capture('locale_changed', {
      previous_locale: currentLocale,
      new_locale: locale,
    })
    localeStore.setLocale(locale)
    if (userId) {
      updateLocale({ clerkId: userId, locale })
    }
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="font-semibold text-foreground">{t('languageSettings')}</h3>
        <p className="text-muted-foreground text-sm">{t('languageSettingsDescription')}</p>
      </div>

      <RadioGroup className="w-full space-y-2" onValueChange={handleLocaleChange} value={currentLocale}>
        {locales.map((locale) => {
          const config = localeConfig[locale]
          return (
            <Label
              className="group relative flex cursor-pointer items-start gap-3 rounded-xl border-2 border-transparent bg-muted/30 p-3 transition-all has-data-checked:border-primary/50 has-data-checked:bg-primary/5"
              htmlFor={`locale-${locale}`}
              key={locale}
            >
              <RadioGroupItem
                className="pointer-events-none absolute opacity-0"
                id={`locale-${locale}`}
                value={locale}
              />
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted/80 text-muted-foreground transition-colors group-has-data-checked:bg-primary/20 group-has-data-checked:text-primary">
                <HugeiconsIcon className="size-5" icon={LanguageCircleIcon} strokeWidth={2} />
              </div>
              <div className="flex flex-1 flex-col gap-0.5">
                <p className="font-semibold text-foreground text-sm transition-colors group-has-data-checked:text-foreground">
                  {t(config.labelKey as 'localeKorean' | 'localeEnglish' | 'localeJapanese')}
                </p>
                <p className="text-muted-foreground text-xs leading-relaxed transition-colors group-has-data-checked:text-muted-foreground">
                  {t(config.descriptionKey as 'localeKoreanDescription' | 'localeEnglishDescription' | 'localeJapaneseDescription')}
                </p>
              </div>
            </Label>
          )
        })}
      </RadioGroup>
    </div>
  )
}
