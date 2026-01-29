'use client'

import { usePaginatedQuery } from 'convex/react'
import { useLocale, useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { MainContent } from '@/components/layout/main-content'
import { AnsweredQuestionCard } from '@/components/questions/answered-question-card'
import { usePrefetchQuestionRoutes } from '@/components/navigation/use-prefetch-question-routes'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'
import { Spinner } from '@/components/ui/spinner'
import { api } from '@/convex/_generated/api'
import type { FunctionReturnType } from 'convex/server'

type FriendsAnswer = NonNullable<FunctionReturnType<typeof api.answers.getFriendsAnswersPaginated>['page']>[number]

interface FriendsContentProps {
  clerkId: string
}

const INITIAL_NUM_ITEMS = 15
const LOAD_MORE_NUM_ITEMS = 10

export function FriendsContent({ clerkId }: FriendsContentProps) {
  const locale = useLocale()
  const t = useTranslations('friends')
  const tCommon = useTranslations('common')

  const { results, status, loadMore } = usePaginatedQuery(
    api.answers.getFriendsAnswersPaginated,
    { clerkId },
    { initialNumItems: INITIAL_NUM_ITEMS }
  )

  const isLoadingFirstPage = status === 'LoadingFirstPage'
  const canLoadMore = status === 'CanLoadMore'
  const isLoadingMore = status === 'LoadingMore'

  const sentinelRef = useInfiniteScroll({
    onLoadMore: () => loadMore(LOAD_MORE_NUM_ITEMS),
    hasMore: canLoadMore,
    isLoading: isLoadingMore,
  })

  const cardLabels = useMemo(
    () => ({
      anonymous: tCommon('anonymous'),
      public: tCommon('public'),
    }),
    [tCommon]
  )

  const prefetchQuestionRoutes = useMemo(() => {
    if (!results || results.length === 0) return []
    return results
      .slice(0, 6)
      .map((qa: FriendsAnswer) => `/${qa.recipientUsername || qa.recipientClerkId}/q/${qa.question._id}`)
  }, [results])

  usePrefetchQuestionRoutes(prefetchQuestionRoutes, !isLoadingFirstPage)

  if (isLoadingFirstPage) {
    return (
      <MainContent>
        <div className="mb-8 space-y-2">
          <h1 className="font-bold text-3xl text-foreground">{t('title')}</h1>
          <p className="text-muted-foreground text-sm">{t('description')}</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Spinner className="size-6 text-muted-foreground" />
        </div>
      </MainContent>
    )
  }

  return (
    <MainContent>
      <div className="mb-8 space-y-2">
        <h1 className="font-bold text-3xl text-foreground">{t('title')}</h1>
        <p className="text-muted-foreground text-sm">{t('description')}</p>
      </div>

      {results.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>{t('emptyTitle')}</EmptyTitle>
            <EmptyDescription>{t('emptyDescription')}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="space-y-6 pb-24">
          {results.map((qa: FriendsAnswer) => (
            <AnsweredQuestionCard
              anonymousAvatarSeed={qa.question.anonymousAvatarSeed}
              answerContent={qa.answer.content}
              answerCreatedAt={qa.answer._creationTime}
              avatarUrl={qa.recipientAvatarUrl ?? null}
              firstName={qa.recipientFirstName || qa.recipientUsername || tCommon('user')}
              isAnonymous={qa.question.isAnonymous}
              key={qa.question._id}
              labels={cardLabels}
              locale={locale}
              questionContent={qa.question.content}
              questionCreatedAt={qa.question._creationTime}
              questionId={qa.question._id}
              senderAvatarUrl={qa.senderAvatarUrl}
              senderName={qa.question.isAnonymous ? undefined : qa.senderFirstName}
              senderSignatureColor={qa.senderSignatureColor}
              signatureColor={qa.recipientSignatureColor}
              username={qa.recipientUsername || qa.recipientClerkId}
            />
          ))}

          <div ref={sentinelRef} className="flex items-center justify-center py-4">
            {isLoadingMore && <Spinner className="size-5 text-muted-foreground" />}
          </div>
        </div>
      )}
    </MainContent>
  )
}
