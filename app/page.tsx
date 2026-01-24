import { auth } from "@clerk/nextjs/server"
import {
  Message01Icon,
  SentIcon,
  Share01Icon,
  ShieldKeyIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { revalidatePath } from "next/cache"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getLocale, getTranslations } from "next-intl/server"
import {
  BottomCTAButton,
  HeroAuthButtons,
} from "@/components/auth/auth-buttons"
import { MainContent } from "@/components/layout/main-content"
import { EditProfileButton } from "@/components/profile/edit-profile-button"
import { ProfileActions } from "@/components/profile/profile-actions"
import { AnsweredQuestionCard } from "@/components/questions/answered-question-card"
import { QuestionDrawer } from "@/components/questions/question-drawer"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import { Empty, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { ToastOnMount } from "@/components/ui/toast-on-mount"
import { createQuestion } from "@/lib/actions/questions"
import { getClerkUserById } from "@/lib/clerk"
import {
  getOrCreateUser,
  getUserCount,
  getUserWithAnsweredQuestions,
} from "@/lib/db/queries"
import { DEFAULT_QUESTION_SECURITY_LEVEL } from "@/lib/question-security"
import { buildSocialLinks, getPageStatus } from "@/lib/utils/social-links"

interface HomePageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function Home({ searchParams }: HomePageProps) {
  const { userId: clerkId } = await auth()

  if (clerkId) {
    return <MyProfile clerkId={clerkId} searchParams={searchParams} />
  }

  return <LandingPage />
}

async function LandingPage() {
  const [t, tNav, tFooter, tShare, userCount] = await Promise.all([
    getTranslations("home"),
    getTranslations("nav"),
    getTranslations("footer"),
    getTranslations("share"),
    getUserCount(),
  ])

  return (
    <div className="flex-1">
      <div className="relative overflow-hidden pt-16 md:pt-32">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/60 via-sky-50/40 to-transparent dark:from-emerald-950/30 dark:via-sky-950/20 dark:to-transparent" />

        <div className="fade-in absolute -top-24 -right-24 h-96 w-96 animate-in rounded-full bg-emerald-300/25 blur-3xl filter duration-700 dark:bg-emerald-400/15" />
        <div className="fade-in absolute top-48 -left-24 h-72 w-72 animate-in rounded-full bg-sky-300/25 blur-3xl filter delay-150 duration-700 dark:bg-sky-400/15" />
        <div className="fade-in absolute top-24 left-1/2 h-64 w-64 -translate-x-1/2 animate-in rounded-full bg-violet-300/20 blur-3xl filter delay-300 duration-700 dark:bg-violet-400/10" />

        <div className="relative mx-auto max-w-5xl px-6 pb-24 text-center">
          <Badge
            className="hover-lift mb-6 gap-2 border border-emerald-200/60 bg-background/60 transition-all duration-200 dark:border-emerald-500/20 dark:bg-background/30"
            variant="secondary"
          >
            <span className="size-2 rounded-full bg-gradient-to-r from-emerald-500 via-sky-500 to-violet-500" />
            <span className="font-semibold text-emerald-700 text-xs tracking-wide dark:text-emerald-300">
              {t("hotTitle")}
            </span>
          </Badge>

          <h1 className="mb-8 text-balance font-extrabold text-4xl text-foreground leading-tight tracking-tight sm:text-7xl">
            <span className="bg-gradient-to-r from-emerald-600 via-sky-600 to-violet-600 bg-clip-text text-transparent dark:from-emerald-400 dark:via-sky-400 dark:to-violet-400">
              {t("heroTitle")}
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl whitespace-pre-line text-lg text-muted-foreground leading-relaxed sm:text-xl">
            {t("heroDescription")}
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <HeroAuthButtons />
          </div>
        </div>

        <div className="border-border border-y bg-muted/40 py-24">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid gap-8 sm:grid-cols-3">
              <Card className="hover-lift bg-emerald-50/40 transition-all duration-200 dark:bg-emerald-950/20">
                <div className="h-1 w-full rounded-full bg-emerald-500/60" />
                <CardContent className="space-y-4">
                  <div className="inline-flex size-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                    <HugeiconsIcon icon={ShieldKeyIcon} size={24} />
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-xl">
                      {t("safeAnonymity")}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {t("safeAnonymityDescription")}
                    </CardDescription>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-lift bg-sky-50/40 transition-all duration-200 dark:bg-sky-950/20">
                <div className="h-1 w-full rounded-full bg-sky-500/60" />
                <CardContent className="space-y-4">
                  <div className="inline-flex size-12 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                    <HugeiconsIcon icon={Share01Icon} size={24} />
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-xl">
                      {tShare("easyShare")}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {tShare("easyShareDescription")}
                    </CardDescription>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-lift bg-violet-50/40 transition-all duration-200 dark:bg-violet-950/20">
                <div className="h-1 w-full rounded-full bg-violet-500/60" />
                <CardContent className="space-y-4">
                  <div className="inline-flex size-12 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                    <HugeiconsIcon icon={SparklesIcon} size={24} />
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-xl">
                      {tShare("instagramShare")}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {tShare("instagramShareDescription")}
                    </CardDescription>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden py-24">
          <div className="mx-auto max-w-5xl px-6">
            <div className="rounded-2xl border border-border/60 bg-gradient-to-r from-emerald-50 via-sky-50 to-violet-50 p-8 text-center sm:p-12 dark:from-emerald-950/30 dark:via-sky-950/20 dark:to-violet-950/20">
              <div className="mb-8 inline-flex items-center justify-center rounded-full border border-emerald-200/60 bg-white/60 p-3 text-emerald-700 dark:border-emerald-500/20 dark:bg-background/30 dark:text-emerald-300">
                <HugeiconsIcon icon={SentIcon} size={24} />
              </div>
              <h2 className="mb-6 font-bold text-3xl text-foreground sm:text-4xl">
                {t("ctaTitle")}
              </h2>
              <p className="mb-10 text-lg text-muted-foreground">
                {t("ctaDescription", { userCount })}
              </p>
              <BottomCTAButton />
            </div>
          </div>
        </div>
      </div>

      <footer className="border-border border-t bg-background py-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-muted text-muted-foreground">
              <HugeiconsIcon icon={Message01Icon} size={14} strokeWidth={3} />
            </div>
            <span className="font-semibold text-muted-foreground text-sm">
              {tNav("appName")}
            </span>
          </div>
          <div className="flex gap-6 text-muted-foreground text-sm">
            <Link
              className="inline-flex min-h-11 items-center rounded transition-colors hover:text-foreground hover:underline focus-visible:text-foreground focus-visible:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              href="/terms"
            >
              {tFooter("terms")}
            </Link>
            <Link
              className="inline-flex min-h-11 items-center rounded transition-colors hover:text-foreground hover:underline focus-visible:text-foreground focus-visible:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              href="/privacy"
            >
              {tFooter("privacy")}
            </Link>
            <Link
              className="inline-flex min-h-11 items-center rounded transition-colors hover:text-foreground hover:underline focus-visible:text-foreground focus-visible:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              href="/contact"
            >
              {tFooter("contact")}
            </Link>
          </div>
          <div className="text-muted-foreground text-sm">
            © 2026 궁금닷컴. 모든 권리 보유.
          </div>
        </div>
      </footer>
    </div>
  )
}

interface MyProfileProps {
  clerkId: string
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

async function MyProfile({ clerkId, searchParams }: MyProfileProps) {
  const [clerkUser, query] = await Promise.all([
    getClerkUserById(clerkId),
    searchParams,
  ])

  if (!clerkUser?.username) {
    redirect("/settings")
  }

  const [
    dbUser,
    { answeredQuestions },
    t,
    tCommon,
    tAnswers,
    tProfile,
    locale,
  ] = await Promise.all([
    getOrCreateUser(clerkId),
    getUserWithAnsweredQuestions(clerkId),
    getTranslations("questions"),
    getTranslations("common"),
    getTranslations("answers"),
    getTranslations("profile"),
    getLocale(),
  ])

  const displayName =
    clerkUser.displayName?.split(" ")[0] ||
    clerkUser.displayName ||
    clerkUser.username

  const error =
    typeof query?.error === "string" ? decodeURIComponent(query.error) : null
  const sent = query?.sent === "1"

  const status = getPageStatus(error, sent, t("questionSent"))
  const socialLinks = buildSocialLinks(dbUser?.socialLinks)

  const securityLevel =
    dbUser?.questionSecurityLevel || DEFAULT_QUESTION_SECURITY_LEVEL

  const questionsWithAnswers = answeredQuestions
    .map((qa) => (qa.answer ? { ...qa, firstAnswer: qa.answer } : null))
    .filter((qa) => qa !== null)

  const cardLabels = {
    anonymous: tCommon("anonymous"),
    identified: tCommon("identified"),
    question: t("questionLabel"),
    answer: tAnswers("answer"),
  }

  const recipientClerkId = clerkId

  async function submitQuestion(formData: FormData) {
    "use server"
    const tErrors = await getTranslations("errors")
    const content = String(formData.get("question") || "").trim()
    const questionType = String(formData.get("questionType") || "anonymous")

    if (!content) {
      redirect(`/?error=${encodeURIComponent(tErrors("pleaseEnterQuestion"))}`)
    }

    const result = await createQuestion({
      recipientClerkId,
      content,
      isAnonymous: questionType !== "public",
    })

    if (!result.success) {
      redirect(`/?error=${encodeURIComponent(result.error)}`)
    }

    revalidatePath("/")
    redirect("/?sent=1")
  }

  return (
    <MainContent>
      <Card className="mb-6">
        <CardContent className="flex items-center gap-6">
          <Avatar className="size-24 ring-2 ring-primary/30">
            {clerkUser.avatarUrl ? (
              <AvatarImage alt={displayName} src={clerkUser.avatarUrl} />
            ) : null}
            <AvatarFallback>{displayName[0] || "?"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col gap-1">
            <h1 className="font-semibold text-foreground text-xl">
              {displayName}
            </h1>
            <p className="text-muted-foreground text-sm">
              @{clerkUser.username}
            </p>
            <p className="mt-1 text-sm">
              {dbUser?.bio || (
                <span className="text-muted-foreground">
                  {tProfile("noBio")}
                </span>
              )}
            </p>
          </div>
        </CardContent>
        {socialLinks.length > 0 && (
          <CardContent className="flex flex-wrap gap-4 pt-0">
            {socialLinks.map((link) => (
              <Button
                aria-label={link.label}
                className="rounded-full"
                key={link.key}
                render={
                  <Link
                    href={link.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  />
                }
                size="icon"
                variant="outline"
              >
                <HugeiconsIcon className="size-4" icon={link.icon} />
              </Button>
            ))}
          </CardContent>
        )}
        <CardContent className="pt-0">
          <ProfileActions
            editButton={<EditProfileButton />}
            username={clerkUser.username}
          />
        </CardContent>
      </Card>

      {status && <ToastOnMount message={status.message} type={status.type} />}

      {questionsWithAnswers.length > 0 ? (
        <div className="space-y-6 pb-24">
          {questionsWithAnswers.map((qa) => (
            <AnsweredQuestionCard
              answerContent={qa.firstAnswer.content}
              answerCreatedAt={qa.firstAnswer._creationTime}
              avatarUrl={clerkUser.avatarUrl}
              displayName={displayName}
              isAnonymous={qa.isAnonymous}
              key={qa._id}
              labels={cardLabels}
              locale={locale}
              questionContent={qa.content}
              questionCreatedAt={qa._creationTime}
              questionId={qa._id}
              username={clerkUser.username as string}
            />
          ))}
        </div>
      ) : (
        <Empty className="pb-24">
          <EmptyHeader>
            <EmptyTitle className="text-muted-foreground">
              {tAnswers("noAnswersYet")}
            </EmptyTitle>
          </EmptyHeader>
        </Empty>
      )}

      <QuestionDrawer
        canAskAnonymously={securityLevel !== "public_only"}
        canAskPublic={true}
        recipientClerkId={recipientClerkId}
        recipientName={displayName}
        requiresSignIn={false}
        submitAction={submitQuestion}
      />
    </MainContent>
  )
}
