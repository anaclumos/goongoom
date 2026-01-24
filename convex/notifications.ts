"use node"

import { v } from "convex/values"
import webpush from "web-push"
import { internal } from "./_generated/api"
import { internalAction } from "./_generated/server"

const locales = ["ko", "en"] as const
type Locale = (typeof locales)[number]
const defaultLocale: Locale = "ko"

const messages: Record<Locale, { push: { newQuestionTitle: string } }> = {
  ko: {
    push: {
      newQuestionTitle: "새로운 질문이 왔어요!",
    },
  },
  en: {
    push: {
      newQuestionTitle: "You got a new question!",
    },
  },
}

function getLocaleMessages(locale: string | undefined) {
  const validLocale =
    locale && locales.includes(locale as Locale)
      ? (locale as Locale)
      : defaultLocale
  return messages[validLocale]
}

interface PushSubscriptionData {
  endpoint: string
  p256dh: string
  auth: string
}

interface PushPayload {
  title: string
  body: string
  url?: string
  tag?: string
}

async function sendPushToMany(
  subscriptions: PushSubscriptionData[],
  payload: PushPayload
): Promise<void> {
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY
  const vapidSubject = process.env.VAPID_SUBJECT

  if (!(vapidPublicKey && vapidPrivateKey && vapidSubject)) {
    return
  }

  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey)

  await Promise.allSettled(
    subscriptions.map((sub) =>
      webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        },
        JSON.stringify(payload)
      )
    )
  )
}

export const sendQuestionNotification = internalAction({
  args: {
    recipientClerkId: v.string(),
    content: v.string(),
    questionId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const subscriptions = await ctx.runQuery(
        internal.push.getByClerkIdInternal,
        {
          clerkId: args.recipientClerkId,
        }
      )

      if (subscriptions.length === 0) {
        return
      }

      const user = await ctx.runQuery(internal.users.getByClerkIdInternal, {
        clerkId: args.recipientClerkId,
      })

      const localeMessages = getLocaleMessages(user?.locale)
      const truncatedContent =
        args.content.length > 50
          ? `${args.content.slice(0, 50)}...`
          : args.content

      const pushSubscriptions: PushSubscriptionData[] = subscriptions.map(
        (sub) => ({
          endpoint: sub.endpoint,
          p256dh: sub.p256dh,
          auth: sub.auth,
        })
      )

      await sendPushToMany(pushSubscriptions, {
        title: localeMessages.push.newQuestionTitle,
        body: truncatedContent,
        url: "/inbox",
        tag: `question-${args.questionId}`,
      })
    } catch (error) {
      console.error("Push notification failed:", error)
    }
  },
})

export const sendAnswerNotification = internalAction({
  args: {
    senderClerkId: v.string(),
    answererClerkId: v.string(),
    answererUsername: v.optional(v.string()),
    answerContent: v.string(),
    answerId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const subscriptions = await ctx.runQuery(
        internal.push.getByClerkIdInternal,
        {
          clerkId: args.senderClerkId,
        }
      )

      if (subscriptions.length === 0) {
        return
      }

      const recipientName = args.answererUsername ?? "누군가"
      const truncatedContent =
        args.answerContent.length > 50
          ? `${args.answerContent.slice(0, 50)}...`
          : args.answerContent

      const pushSubscriptions: PushSubscriptionData[] = subscriptions.map(
        (sub) => ({
          endpoint: sub.endpoint,
          p256dh: sub.p256dh,
          auth: sub.auth,
        })
      )

      await sendPushToMany(pushSubscriptions, {
        title: `${recipientName}님이 답변했어요!`,
        body: truncatedContent,
        url: "/sent",
        tag: `answer-${args.answerId}`,
      })
    } catch (error) {
      console.error("Push notification failed:", error)
    }
  },
})
