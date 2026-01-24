"use client"

import { PencilEdit01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslations } from "next-intl"
import { Ultralink } from "@/components/navigation/ultralink"
import { Button } from "@/components/ui/button"

export function EditProfileButton() {
  const t = useTranslations("profile")

  return (
    <Button
      className="flex-1"
      nativeButton={false}
      render={<Ultralink href="/settings/profile" />}
      variant="outline"
    >
      <HugeiconsIcon className="mr-2 size-4" icon={PencilEdit01Icon} />
      {t("edit")}
    </Button>
  )
}
