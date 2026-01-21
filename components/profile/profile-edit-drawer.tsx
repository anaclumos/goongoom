"use client"

import { useClerk } from "@clerk/nextjs"
import {
  PencilEdit01Icon,
  UserSettings01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslations } from "next-intl"
import { useCallback, useEffect, useRef, useState } from "react"
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
import { updateProfile } from "@/lib/actions/profile"
import { QUESTION_SECURITY_LEVELS } from "@/lib/question-security"
import type { SocialLinks } from "@/lib/types"

const URL_PATTERN_REGEX = /:\/\/|\/|instagram\.com|twitter\.com|x\.com|www\./i
const DEBOUNCE_MS = 500

function normalizeHandle(value: string) {
  const trimmed = value.trim()
  if (!trimmed) {
    return ""
  }
  const looksLikeUrl = URL_PATTERN_REGEX.test(trimmed)

  if (!looksLikeUrl) {
    return trimmed
  }

  try {
    const url = new URL(
      trimmed.startsWith("http") ? trimmed : `https://${trimmed}`
    )
    const parts = url.pathname.split("/").filter(Boolean)
    return parts[0] || ""
  } catch {
    return trimmed.split("/").filter(Boolean)[0] || ""
  }
}

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
  const { openUserProfile } = useClerk()

  const [bio, setBio] = useState(initialBio || "")
  const [instagram, setInstagram] = useState(initialInstagramHandle)
  const [twitter, setTwitter] = useState(initialTwitterHandle)
  const [securityLevel, setSecurityLevel] = useState(
    initialQuestionSecurityLevel
  )

  const bioTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const instagramTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const twitterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  const handleBioChange = useCallback(
    (value: string) => {
      setBio(value)
      if (bioTimeoutRef.current) {
        clearTimeout(bioTimeoutRef.current)
      }
      bioTimeoutRef.current = setTimeout(() => {
        saveProfile({ bio: value.trim() || null })
      }, DEBOUNCE_MS)
    },
    [saveProfile]
  )

  const handleInstagramChange = useCallback(
    (value: string) => {
      setInstagram(value)
      if (instagramTimeoutRef.current) {
        clearTimeout(instagramTimeoutRef.current)
      }
      instagramTimeoutRef.current = setTimeout(() => {
        const normalizedInstagram = normalizeHandle(value)
        const normalizedTwitter = normalizeHandle(twitter)
        const links: SocialLinks = {}
        if (normalizedInstagram) {
          links.instagram = normalizedInstagram
        }
        if (normalizedTwitter) {
          links.twitter = normalizedTwitter
        }
        saveProfile({
          socialLinks: Object.keys(links).length ? links : null,
        })
      }, DEBOUNCE_MS)
    },
    [saveProfile, twitter]
  )

  const handleTwitterChange = useCallback(
    (value: string) => {
      setTwitter(value)
      if (twitterTimeoutRef.current) {
        clearTimeout(twitterTimeoutRef.current)
      }
      twitterTimeoutRef.current = setTimeout(() => {
        const normalizedInstagram = normalizeHandle(instagram)
        const normalizedTwitter = normalizeHandle(value)
        const links: SocialLinks = {}
        if (normalizedInstagram) {
          links.instagram = normalizedInstagram
        }
        if (normalizedTwitter) {
          links.twitter = normalizedTwitter
        }
        saveProfile({
          socialLinks: Object.keys(links).length ? links : null,
        })
      }, DEBOUNCE_MS)
    },
    [saveProfile, instagram]
  )

  const handleSecurityLevelChange = useCallback(
    (value: string) => {
      setSecurityLevel(value)
      saveProfile({ questionSecurityLevel: value })
    },
    [saveProfile]
  )

  useEffect(() => {
    return () => {
      if (bioTimeoutRef.current) {
        clearTimeout(bioTimeoutRef.current)
      }
      if (instagramTimeoutRef.current) {
        clearTimeout(instagramTimeoutRef.current)
      }
      if (twitterTimeoutRef.current) {
        clearTimeout(twitterTimeoutRef.current)
      }
    }
  }, [])

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
                <p className="text-muted-foreground text-sm">
                  {t("profileSettingsDescription")}
                </p>
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

            <div className="space-y-6 border-border border-t pt-8">
              <button
                className="group flex w-full items-center justify-between gap-4 rounded-xl border border-border bg-gradient-to-br from-electric-blue/5 to-purple/5 p-4 text-left transition-all hover:border-electric-blue/30 hover:shadow-md active:scale-[0.99]"
                onClick={() => openUserProfile()}
                type="button"
              >
                <div className="space-y-1">
                  <h3 className="font-semibold text-base text-foreground">
                    {t("accountSettings")}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t("accountSettingsDescription")}
                  </p>
                </div>
                <HugeiconsIcon
                  className="size-5 text-muted-foreground transition-colors group-hover:text-foreground"
                  icon={UserSettings01Icon}
                />
              </button>
            </div>

            <div className="space-y-6 border-border border-t pt-8">
              <div className="space-y-1">
                <h3 className="font-semibold text-base text-foreground">
                  {t("anonymousRestriction")}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t("anonymousRestrictionDescription")}
                </p>
              </div>

              <Field>
                <FieldLabel className="font-medium text-sm">
                  {t("whoCanAsk")}
                </FieldLabel>
                <FieldContent>
                  <RadioGroup
                    className="w-full space-y-3"
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
