"use client"

import { Dialog } from "@base-ui/react/dialog"
import { Cancel01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { createAnswer } from "@/lib/actions/answers"
import { cn } from "@/lib/utils"

interface QuickAnswerDialogProps {
  question: {
    id: number
    content: string
    senderName?: string
    senderAvatarUrl?: string | null
    isAnonymous?: boolean
  } | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QuickAnswerDialog({
  question,
  open,
  onOpenChange,
}: QuickAnswerDialogProps) {
  const t = useTranslations("answers")
  const tCommon = useTranslations("common")
  const router = useRouter()
  const [answer, setAnswer] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit() {
    if (!(question && answer.trim()) || isSubmitting) {
      return
    }

    setIsSubmitting(true)
    try {
      const result = await createAnswer({
        questionId: question.id,
        content: answer.trim(),
      })

      if (result.success) {
        setAnswer("")
        onOpenChange(false)
        router.refresh()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleClose() {
    setAnswer("")
    onOpenChange(false)
  }

  return (
    <Dialog.Root onOpenChange={onOpenChange} open={open}>
      <Dialog.Portal>
        <Dialog.Backdrop
          className={cn(
            "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
            "data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
            "transition-opacity duration-200"
          )}
        />
        <Dialog.Popup
          className={cn(
            "fixed top-1/2 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2",
            "rounded-2xl border border-border bg-background p-6 shadow-xl",
            "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
            "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
            "transition-all duration-200"
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <Dialog.Title className="font-semibold text-foreground text-lg">
              {t("answerDrawerTitle")}
            </Dialog.Title>
            <Dialog.Close
              render={
                <Button onClick={handleClose} size="icon-sm" variant="ghost" />
              }
            >
              <HugeiconsIcon icon={Cancel01Icon} size={18} />
              <span className="sr-only">{tCommon("cancel")}</span>
            </Dialog.Close>
          </div>

          {question && (
            <div className="mt-4 flex items-start gap-3">
              <Avatar className="size-12 flex-shrink-0">
                {!question.isAnonymous && question.senderAvatarUrl ? (
                  <AvatarImage
                    alt={question.senderName || ""}
                    src={question.senderAvatarUrl}
                  />
                ) : null}
                <AvatarFallback>
                  {question.senderName?.[0] || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 rounded-xl bg-muted/50 p-4">
                <Dialog.Description className="text-foreground leading-relaxed">
                  {question.content}
                </Dialog.Description>
                <p className="mt-2 text-muted-foreground text-xs">
                  {question.isAnonymous
                    ? tCommon("anonymous")
                    : question.senderName || tCommon("user")}
                </p>
              </div>
            </div>
          )}

          <div className="mt-4">
            <Textarea
              className="min-h-28 w-full resize-none"
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={t("answerPlaceholder")}
              value={answer}
            />
          </div>

          <div className="mt-4 flex gap-3">
            <Button
              className="min-h-12 flex-1"
              onClick={handleClose}
              type="button"
              variant="ghost"
            >
              {tCommon("cancel")}
            </Button>
            <Button
              className="min-h-12 flex-1"
              disabled={!answer.trim() || isSubmitting}
              onClick={handleSubmit}
              type="button"
            >
              {isSubmitting ? tCommon("submitting") : t("answerButton")}
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
