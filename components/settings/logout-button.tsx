"use client"

import { useClerk } from "@clerk/nextjs"
import { Logout01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"

export function LogoutButton() {
  const t = useTranslations("common")
  const { signOut } = useClerk()

  return (
    <Button
      className="w-full"
      onClick={() => signOut({ redirectUrl: "/" })}
      variant="outline"
    >
      <HugeiconsIcon className="mr-2 size-4" icon={Logout01Icon} />
      {t("logout")}
    </Button>
  )
}
