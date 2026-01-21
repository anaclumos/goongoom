"use client"

import { PencilEdit01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { isEmpty } from "es-toolkit/compat"
import { useTranslations } from "next-intl"
import { useCallback, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useDebouncedCallback } from "@/hooks/use-debounced-callback"
import { updateProfile } from "@/lib/actions/profile"
import { QUESTION_SECURITY_LEVELS } from "@/lib/question-security"
import type { SocialLinks } from "@/lib/types"
import { normalizeHandle } from "@/lib/utils/social-links"

const DEBOUNCE_MS = 500

interface ProfileEditDrawerProps {
  initialBio: string | null
  initialInstagramHandle: string
  initialTwitterHandle: string
  initialQuestionSecurityLevel: string
  securityOptions: Record<string, { label: string; description: string }>
}

export function ProfileEditDrawer({
  initialBio,
  initialInstagramHandle,
  initialTwitterHandle,
  initialQuestionSecurityLevel,
  securityOptions,
}: ProfileEditDrawerProps) {
  const t = useTranslations("settings")
  const tProfile = useTranslations("profile")

  const [bio, setBio] = useState(initialBio || "")
  const [instagram, setInstagram] = useState(initialInstagramHandle)
  const [twitter, setTwitter] = useState(initialTwitterHandle)
  const [securityLevel, setSecurityLevel] = useState(
    initialQuestionSecurityLevel
  )

  const saveProfile = useCallback(
    (data: {
      bio?: string | null
      socialLinks?: SocialLinks | null
      questionSecurityLevel?: string
    }) => {
      toast.promise(updateProfile(data), {
        loading: t("saving"),
        success: t("profileUpdated"),
        error: (err) => err?.message || "Error",
      })
    },
    [t]
  )

  const debouncedSaveBio = useDebouncedCallback((value: string) => {
    saveProfile({ bio: value.trim() || null })
  }, DEBOUNCE_MS)

  const debouncedSaveSocialLinks = useDebouncedCallback(
    (instagramValue: string, twitterValue: string) => {
      const normalizedInstagram = normalizeHandle(instagramValue)
      const normalizedTwitter = normalizeHandle(twitterValue)
      const links: SocialLinks = {}
      if (normalizedInstagram) {
        links.instagram = normalizedInstagram
      }
      if (normalizedTwitter) {
        links.twitter = normalizedTwitter
      }
      saveProfile({
        socialLinks: isEmpty(links) ? null : links,
      })
    },
    DEBOUNCE_MS
  )

  const handleBioChange = useCallback(
    (value: string) => {
      setBio(value)
      debouncedSaveBio(value)
    },
    [debouncedSaveBio]
  )

  const handleInstagramChange = useCallback(
    (value: string) => {
      setInstagram(value)
      debouncedSaveSocialLinks(value, twitter)
    },
    [debouncedSaveSocialLinks, twitter]
  )

  const handleTwitterChange = useCallback(
    (value: string) => {
      setTwitter(value)
      debouncedSaveSocialLinks(instagram, value)
    },
    [debouncedSaveSocialLinks, instagram]
  )

  const handleSecurityLevelChange = useCallback(
    (value: string) => {
      setSecurityLevel(value)
      saveProfile({ questionSecurityLevel: value })
    },
    [saveProfile]
  )

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="flex-1" variant="outline">
          <HugeiconsIcon className="mr-2 size-4" icon={PencilEdit01Icon} />
          {tProfile("edit")}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader>
            <DrawerTitle>{tProfile("edit")}</DrawerTitle>
          </DrawerHeader>
          <div className="max-h-[85vh] space-y-8 overflow-y-auto px-4 pb-8">
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="font-semibold text-base text-foreground">
                  {t("profileSettings")}
                </h3>
              </div>

              <Field>
                <FieldLabel className="font-medium text-sm" htmlFor="bio">
                  {t("bioLabel")}
                </FieldLabel>
                <Textarea
                  className="min-h-12 resize-none rounded-xl"
                  id="bio"
                  name="bio"
                  onChange={(e) => handleBioChange(e.target.value)}
                  placeholder={t("bioPlaceholder")}
                  rows={3}
                  value={bio}
                />
              </Field>

              <div className="space-y-4">
                <p className="font-medium text-muted-foreground text-sm">
                  {t("socialLinks")}
                </p>

                <Field>
                  <FieldLabel
                    className="font-medium text-sm"
                    htmlFor="instagram"
                  >
                    Instagram
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      autoCapitalize="none"
                      autoCorrect="off"
                      className="min-h-12 rounded-xl"
                      id="instagram"
                      name="instagram"
                      onChange={(e) => handleInstagramChange(e.target.value)}
                      placeholder="username"
                      value={instagram}
                    />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel className="font-medium text-sm" htmlFor="twitter">
                    Twitter / X
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      autoCapitalize="none"
                      autoCorrect="off"
                      className="min-h-12 rounded-xl"
                      id="twitter"
                      name="twitter"
                      onChange={(e) => handleTwitterChange(e.target.value)}
                      placeholder="username"
                      value={twitter}
                    />
                  </FieldContent>
                </Field>
              </div>
            </div>

            <div className="space-y-6 pt-8">
              <Field>
                <FieldLabel className="font-medium text-sm">
                  {t("anonymousRestriction")}
                </FieldLabel>
                <FieldContent>
                  <RadioGroup
                    className="w-full space-y-0"
                    onValueChange={handleSecurityLevelChange}
                    value={securityLevel}
                  >
                    {QUESTION_SECURITY_LEVELS.map((level) => {
                      const option = securityOptions[level]
                      if (!option) {
                        return null
                      }
                      return (
                        <Label
                          className="flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border border-border bg-background p-4 transition-all hover:border-lime/30 hover:bg-accent/30 has-[data-checked]:border-lime has-[data-checked]:bg-lime/5 has-[data-checked]:shadow-sm"
                          key={level}
                        >
                          <RadioGroupItem
                            className="mt-0.5"
                            id={`qsl-${level}`}
                            value={level}
                          />
                          <div className="flex flex-1 flex-col gap-1">
                            <p className="font-medium text-foreground text-sm">
                              {option.label}
                            </p>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                              {option.description}
                            </p>
                          </div>
                        </Label>
                      )
                    })}
                  </RadioGroup>
                </FieldContent>
              </Field>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
