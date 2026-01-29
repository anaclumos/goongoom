'use client'

import { ComputerIcon, Moon02Icon, Sun03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import posthog from 'posthog-js'
import { useIsClient } from 'usehooks-ts'
import { Label } from '../ui/label'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'

const themes = [
  { value: 'light', icon: Sun03Icon, labelKey: 'themeLight', descriptionKey: 'themeLightDescription' },
  { value: 'dark', icon: Moon02Icon, labelKey: 'themeDark', descriptionKey: 'themeDarkDescription' },
  { value: 'system', icon: ComputerIcon, labelKey: 'themeSystem', descriptionKey: 'themeSystemDescription' },
] as const

type Theme = (typeof themes)[number]['value']

export function ThemeSelector() {
  const t = useTranslations('settings')
  const { theme, setTheme } = useTheme()
  const isClient = useIsClient()

  if (!isClient) {
    return (
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="font-semibold text-foreground">{t('themeSettings')}</h3>
          <p className="text-muted-foreground text-sm">{t('themeSettingsDescription')}</p>
        </div>
        <div className="w-full space-y-2">
          {themes.map((themeOption) => (
            <div
              className="flex items-start gap-3 rounded-xl border-2 border-transparent bg-muted/30 p-3"
              key={themeOption.value}
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted/80 text-muted-foreground">
                <HugeiconsIcon className="size-5" icon={themeOption.icon} strokeWidth={2} />
              </div>
              <div className="flex flex-1 flex-col gap-0.5">
                <p className="font-semibold text-foreground text-sm">
                  {t(themeOption.labelKey as 'themeLight' | 'themeDark' | 'themeSystem')}
                </p>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {t(themeOption.descriptionKey as 'themeLightDescription' | 'themeDarkDescription' | 'themeSystemDescription')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="font-semibold text-foreground">{t('themeSettings')}</h3>
        <p className="text-muted-foreground text-sm">{t('themeSettingsDescription')}</p>
      </div>

      <RadioGroup
        className="w-full space-y-2"
        onValueChange={(value) => {
          setTheme(value as Theme)
          posthog.capture('theme_changed', {
            previous_theme: theme,
            new_theme: value,
          })
        }}
        value={theme}
      >
        {themes.map((themeOption) => (
          <Label
            className="group relative flex cursor-pointer items-start gap-3 rounded-xl border-2 border-transparent bg-muted/30 p-3 transition-all has-data-checked:border-primary/50 has-data-checked:bg-primary/5"
            key={themeOption.value}
          >
            <RadioGroupItem
              className="pointer-events-none absolute opacity-0"
              id={`theme-${themeOption.value}`}
              value={themeOption.value}
            />
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted/80 text-muted-foreground transition-colors group-has-data-checked:bg-primary/20 group-has-data-checked:text-primary">
              <HugeiconsIcon className="size-5" icon={themeOption.icon} strokeWidth={2} />
            </div>
            <div className="flex flex-1 flex-col gap-0.5">
              <p className="font-semibold text-foreground text-sm transition-colors group-has-data-checked:text-foreground">
                {t(themeOption.labelKey as 'themeLight' | 'themeDark' | 'themeSystem')}
              </p>
              <p className="text-muted-foreground text-xs leading-relaxed transition-colors group-has-data-checked:text-muted-foreground">
                {t(themeOption.descriptionKey as 'themeLightDescription' | 'themeDarkDescription' | 'themeSystemDescription')}
              </p>
            </div>
          </Label>
        ))}
      </RadioGroup>
    </div>
  )
}
