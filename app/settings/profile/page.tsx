import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { MainContent } from "@/components/layout/main-content"
import { ProfileEditForm } from "@/components/settings/profile-edit-form"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { getClerkUserById } from "@/lib/clerk"
import { getOrCreateUser } from "@/lib/db/queries"
import { getQuestionSecurityOptions } from "@/lib/question-security"

export default async function ProfileSettingsPage() {
  const { userId: clerkId } = await auth()
  if (!clerkId) {
    redirect("/")
  }

  const [clerkUser, dbUser, t, securityOptions] = await Promise.all([
    getClerkUserById(clerkId),
    getOrCreateUser(clerkId),
    getTranslations("settings"),
    getQuestionSecurityOptions(),
  ])

  if (!clerkUser) {
    return (
      <MainContent>
        <h1 className="mb-2 font-bold text-3xl text-foreground">
          {t("profileSettings")}
        </h1>
        <Empty>
          <EmptyHeader>
            <EmptyTitle>{t("profileRequired")}</EmptyTitle>
            <EmptyDescription>
              {t("profileRequiredDescription")}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </MainContent>
    )
  }

  const instagramHandle = dbUser?.socialLinks?.instagram || ""
  const twitterHandle = dbUser?.socialLinks?.twitter || ""
  const securityLevel = dbUser?.questionSecurityLevel || "public"

  return (
    <MainContent>
      <div className="mb-8 space-y-2">
        <h1 className="font-bold text-3xl text-foreground">
          {t("profileSettings")}
        </h1>
        <p className="text-muted-foreground text-sm">
          {t("profileSettingsDescription")}
        </p>
      </div>

      <ProfileEditForm
        initialBio={dbUser?.bio || null}
        initialInstagramHandle={instagramHandle}
        initialQuestionSecurityLevel={securityLevel}
        initialTwitterHandle={twitterHandle}
        securityOptions={securityOptions}
      />
    </MainContent>
  )
}
