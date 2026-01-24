import Link from "next/link"
import { getLocale, getTranslations } from "next-intl/server"
import { AnsweredQuestionCard } from "@/components/questions/answered-question-card"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { getClerkUsersByIds } from "@/lib/clerk"
import { getRecentAnswersLimitPerUser } from "@/lib/db/queries"

export default async function Home() {
  const [recentAnswers, t, tCommon, tAnswers, tMetadata, locale] =
    await Promise.all([
      getRecentAnswersLimitPerUser(30, 2),
      getTranslations("home"),
      getTranslations("common"),
      getTranslations("answers"),
      getTranslations("metadata"),
      getLocale(),
    ])

  const recipientIds = [
    ...new Set(recentAnswers.map((qa) => qa.recipientClerkId)),
  ]
  const senderIds = [
    ...new Set(
      recentAnswers
        .filter((qa) => !qa.question.isAnonymous && qa.question.senderClerkId)
        .map((qa) => qa.question.senderClerkId)
        .filter((id): id is string => Boolean(id))
    ),
  ]

  const [recipientMap, senderMap] = await Promise.all([
    getClerkUsersByIds(recipientIds),
    getClerkUsersByIds(senderIds),
  ])

  const cardLabels = {
    anonymous: tCommon("anonymous"),
    identified: tCommon("identified"),
    question: t("questionLabel"),
    answer: tAnswers("answer"),
  }

  const questionsWithInfo = recentAnswers
    .map((qa) => {
      const recipient = recipientMap.get(qa.recipientClerkId)
      if (!recipient?.username) {
        return null
      }

      const sender =
        !qa.question.isAnonymous && qa.question.senderClerkId
          ? senderMap.get(qa.question.senderClerkId)
          : null

      return {
        ...qa,
        recipientUsername: recipient.username,
        recipientDisplayName:
          recipient.displayName || recipient.username || "User",
        recipientAvatarUrl: recipient.avatarUrl,
        recipientSignatureColor: qa.recipientSignatureColor,
        senderName: sender?.displayName || sender?.username || null,
        senderAvatarUrl: sender?.avatarUrl || null,
      }
    })
    .filter((qa) => qa !== null)

  return (
    <div className="flex min-h-screen flex-col">
      <section className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-indigo-50/50 via-background to-background px-4 text-center dark:from-indigo-950/20">
        <div className="container relative z-10 mx-auto max-w-4xl space-y-8">
          <h1 className="font-bold text-4xl tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {tMetadata("title")}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
            {tMetadata("description")}
          </p>
          <div className="flex justify-center">
            <Link
              className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 font-medium text-lg text-primary-foreground transition-colors hover:bg-primary/90"
              href="/login"
            >
              {tCommon("start")}
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="font-bold text-3xl text-foreground">
            {t("feedTitle")}
          </h2>
        </div>

        {questionsWithInfo.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>{t("feedEmptyTitle")}</EmptyTitle>
              <EmptyDescription>{t("feedEmptyDescription")}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="mx-auto max-w-7xl px-4 md:px-12">
            <Carousel className="w-full" opts={{ align: "start", loop: true }}>
              <CarouselContent>
                {questionsWithInfo.map((qa) => (
                  <CarouselItem
                    className="pl-4 md:basis-1/2 lg:basis-1/3"
                    key={qa.question._id}
                  >
                    <div className="h-full">
                      <AnsweredQuestionCard
                        anonymousAvatarSeed={qa.question.anonymousAvatarSeed}
                        answerContent={qa.answer.content}
                        answerCreatedAt={qa.answer._creationTime}
                        avatarUrl={qa.recipientAvatarUrl}
                        displayName={qa.recipientDisplayName}
                        isAnonymous={qa.question.isAnonymous}
                        labels={cardLabels}
                        locale={locale}
                        questionContent={qa.question.content}
                        questionCreatedAt={qa.question._creationTime}
                        questionId={qa.question._id}
                        senderAvatarUrl={qa.senderAvatarUrl}
                        senderName={qa.senderName || undefined}
                        signatureColor={qa.recipientSignatureColor}
                        username={qa.recipientUsername}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>
        )}
      </section>
    </div>
  )
}
