import Link from "next/link"
import { ClampedAnswer } from "@/components/questions/clamped-answer"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { formatRelativeTime } from "@/lib/utils/format-time"

interface AnsweredQuestionCardProps {
  questionId: string
  questionContent: string
  isAnonymous: boolean
  questionCreatedAt: number
  answerContent: string
  answerCreatedAt: number
  username: string
  displayName: string
  avatarUrl: string | null
  locale: string
  labels: {
    anonymous: string
    identified: string
    question: string
    answer: string
  }
}

export function AnsweredQuestionCard({
  questionId,
  questionContent,
  isAnonymous,
  questionCreatedAt,
  answerContent,
  answerCreatedAt,
  username,
  displayName,
  avatarUrl,
  locale,
  labels,
}: AnsweredQuestionCardProps) {
  const anonymityLabel = isAnonymous ? labels.anonymous : labels.identified
  const fallbackInitial = displayName[0] || "?"

  return (
    <Link
      className="block"
      href={`/${username}/q/${questionId}`}
      prefetch={false}
    >
      <Card className="group relative transition-colors hover:bg-muted/50">
        <CardContent className="flex flex-col gap-4">
          <div className="flex w-full items-start gap-3">
            <Avatar className="size-10 flex-shrink-0">
              <AvatarImage
                alt="Avatar"
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=anon_${questionId}`}
              />
              <AvatarFallback>?</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <Card className="max-w-prose bg-muted/40 px-4 py-3">
                <p className="text-foreground leading-relaxed">
                  {questionContent}
                </p>
              </Card>
              <p className="mt-1 ml-1 text-muted-foreground text-xs">
                {anonymityLabel} ·{" "}
                {formatRelativeTime(questionCreatedAt, locale)}{" "}
                {labels.question}
              </p>
            </div>
          </div>
          <div className="flex w-full items-start justify-end gap-3">
            <div className="flex flex-1 flex-col items-end">
              <Card className="max-w-prose border-none bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 text-white">
                <ClampedAnswer content={answerContent} />
              </Card>
              <p className="mt-1 mr-1 text-muted-foreground text-xs">
                {displayName} · {formatRelativeTime(answerCreatedAt, locale)}{" "}
                {labels.answer}
              </p>
            </div>
            <Avatar className="size-10 flex-shrink-0">
              {avatarUrl && <AvatarImage alt={displayName} src={avatarUrl} />}
              <AvatarFallback>{fallbackInitial}</AvatarFallback>
            </Avatar>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
