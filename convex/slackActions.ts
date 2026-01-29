'use node'

import { v } from 'convex/values'
import { internalAction } from './_generated/server'

type SlackBlock =
  | { type: 'section'; text: { type: 'mrkdwn'; text: string } }
  | { type: 'context'; elements: Array<{ type: 'mrkdwn'; text: string }> }
  | { type: 'divider' }

interface SlackMessage {
  text: string
  blocks?: SlackBlock[]
}

function formatDisplayName(firstName?: string, username?: string, clerkId?: string): string {
  if (firstName && username) {
    return `${firstName}(${username})`
  }
  if (username) {
    return username
  }
  if (clerkId) {
    return `(${clerkId.slice(0, 8)}...)`
  }
  return '누군가'
}

async function sendSlackMessage(webhookUrl: string, message: SlackMessage): Promise<boolean> {
  try {
    console.log('Sending Slack message to:', webhookUrl.slice(0, 50) + '...')
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    })
    if (!response.ok) {
      const text = await response.text()
      console.error('Slack API error:', response.status, text)
    }
    return response.ok
  } catch (error) {
    console.error('Failed to send Slack message:', error)
    return false
  }
}

export const testSlack = internalAction({
  args: {},
  handler: async (): Promise<{ success: boolean; webhookConfigured: boolean }> => {
    const webhookUrl = process.env.SLACK_ADMIN_WEBHOOK_URL
    console.log('SLACK_ADMIN_WEBHOOK_URL configured:', !!webhookUrl)
    if (!webhookUrl) {
      return { success: false, webhookConfigured: false }
    }

    const success = await sendSlackMessage(webhookUrl, {
      text: 'Test message from Convex',
    })
    return { success, webhookConfigured: true }
  },
})

export const notifyUserSignup = internalAction({
  args: {
    username: v.optional(v.string()),
    firstName: v.optional(v.string()),
    clerkId: v.string(),
    referrerUsername: v.optional(v.string()),
    referrerFirstName: v.optional(v.string()),
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
    utmTerm: v.optional(v.string()),
    utmContent: v.optional(v.string()),
  },
  handler: async (_ctx, args): Promise<void> => {
    const webhookUrl = process.env.SLACK_ADMIN_WEBHOOK_URL
    if (!webhookUrl) {
      return
    }

    const userDisplay = formatDisplayName(args.firstName, args.username, args.clerkId)
    const referrerDisplay = formatDisplayName(args.referrerFirstName, args.referrerUsername)

    let headline: string
    if (args.referrerUsername) {
      headline = `${userDisplay}님이 ${referrerDisplay}님을 통해 가입했어요`
    } else {
      headline = `${userDisplay}님이 가입했어요`
    }

    const profileUrl = args.username ? `https://goongoom.com/${args.username}` : null

    const utmPairs: string[] = []
    if (args.utmSource) utmPairs.push(`source=${args.utmSource}`)
    if (args.utmMedium) utmPairs.push(`medium=${args.utmMedium}`)
    if (args.utmCampaign) utmPairs.push(`campaign=${args.utmCampaign}`)
    if (args.utmTerm) utmPairs.push(`term=${args.utmTerm}`)
    if (args.utmContent) utmPairs.push(`content=${args.utmContent}`)

    const blocks: SlackBlock[] = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: headline,
        },
      },
    ]

    if (utmPairs.length) {
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `UTM: ${utmPairs.join(', ')}`,
        },
      })
    }

    if (profileUrl) {
      blocks.push({
        type: 'context',
        elements: [{ type: 'mrkdwn', text: `<${profileUrl}|goongoom.com>` }],
      })
    }

    await sendSlackMessage(webhookUrl, {
      text: headline,
      blocks,
    })
  },
})

export const notifyUserDeleted = internalAction({
  args: {
    username: v.optional(v.string()),
    firstName: v.optional(v.string()),
    clerkId: v.string(),
    source: v.union(v.literal('webhook'), v.literal('self')),
  },
  handler: async (_ctx, args): Promise<void> => {
    const webhookUrl = process.env.SLACK_ADMIN_WEBHOOK_URL
    if (!webhookUrl) {
      return
    }

    const userDisplay = formatDisplayName(args.firstName, args.username, args.clerkId)
    const sourceText = args.source === 'self' ? '직접 탈퇴' : 'Clerk에서 삭제'
    const headline = `${userDisplay}님이 탈퇴했어요 (${sourceText})`

    await sendSlackMessage(webhookUrl, {
      text: headline,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: headline,
          },
        },
      ],
    })
  },
})

export const notifyNewQuestion = internalAction({
  args: {
    recipientUsername: v.optional(v.string()),
    recipientFirstName: v.optional(v.string()),
    recipientClerkId: v.string(),
    senderUsername: v.optional(v.string()),
    senderFirstName: v.optional(v.string()),
    isAnonymous: v.boolean(),
    questionPreview: v.string(),
    questionId: v.optional(v.string()),
  },
  handler: async (_ctx, args): Promise<void> => {
    const webhookUrl = process.env.SLACK_ADMIN_WEBHOOK_URL
    if (!webhookUrl) {
      return
    }

    const recipientDisplay = formatDisplayName(args.recipientFirstName, args.recipientUsername, args.recipientClerkId)
    const senderDisplay = formatDisplayName(args.senderFirstName, args.senderUsername)
    const preview =
      args.questionPreview.length > 100 ? `${args.questionPreview.slice(0, 100)}...` : args.questionPreview

    let headline: string
    if (args.isAnonymous) {
      headline = `${senderDisplay}가 ${recipientDisplay}에게 익명으로 질문했어요`
    } else {
      headline = `${senderDisplay}가 ${recipientDisplay}에게 질문했어요`
    }

    const questionUrl =
      args.recipientUsername && args.questionId
        ? `https://goongoom.com/${args.recipientUsername}/q/${args.questionId}`
        : null

    const blocks: SlackBlock[] = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: headline,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `> ${preview}`,
        },
      },
    ]

    if (questionUrl) {
      blocks.push({
        type: 'context',
        elements: [{ type: 'mrkdwn', text: `<${questionUrl}|goongoom.com>` }],
      })
    }

    await sendSlackMessage(webhookUrl, {
      text: headline,
      blocks,
    })
  },
})

export const notifyNewAnswer = internalAction({
  args: {
    answererUsername: v.optional(v.string()),
    answererFirstName: v.optional(v.string()),
    answererClerkId: v.string(),
    answerPreview: v.string(),
    senderUsername: v.optional(v.string()),
    senderFirstName: v.optional(v.string()),
    isAnonymous: v.boolean(),
    questionId: v.string(),
  },
  handler: async (_ctx, args): Promise<void> => {
    const webhookUrl = process.env.SLACK_ADMIN_WEBHOOK_URL
    if (!webhookUrl) {
      return
    }

    const answererDisplay = formatDisplayName(args.answererFirstName, args.answererUsername, args.answererClerkId)
    const senderDisplay = formatDisplayName(args.senderFirstName, args.senderUsername)
    const preview = args.answerPreview.length > 100 ? `${args.answerPreview.slice(0, 100)}...` : args.answerPreview

    let headline: string
    if (args.isAnonymous) {
      headline = `${answererDisplay}가 ${senderDisplay}의 익명 질문에 답변했어요`
    } else {
      headline = `${answererDisplay}가 ${senderDisplay}의 질문에 답변했어요`
    }

    const answerUrl = args.answererUsername
      ? `https://goongoom.com/${args.answererUsername}/q/${args.questionId}`
      : null

    const blocks: SlackBlock[] = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: headline,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `> ${preview}`,
        },
      },
    ]

    if (answerUrl) {
      blocks.push({
        type: 'context',
        elements: [{ type: 'mrkdwn', text: `<${answerUrl}|goongoom.com>` }],
      })
    }

    await sendSlackMessage(webhookUrl, {
      text: headline,
      blocks,
    })
  },
})

export const notifyQuestionDeleted = internalAction({
  args: {
    recipientUsername: v.optional(v.string()),
    recipientFirstName: v.optional(v.string()),
    recipientClerkId: v.string(),
  },
  handler: async (_ctx, args): Promise<void> => {
    const webhookUrl = process.env.SLACK_ADMIN_WEBHOOK_URL
    if (!webhookUrl) {
      return
    }

    const userDisplay = formatDisplayName(args.recipientFirstName, args.recipientUsername, args.recipientClerkId)
    const headline = `${userDisplay}님이 질문을 거절했어요`

    await sendSlackMessage(webhookUrl, {
      text: headline,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: headline,
          },
        },
      ],
    })
  },
})

export const notifyAnswerDeleted = internalAction({
  args: {
    answererUsername: v.optional(v.string()),
    answererFirstName: v.optional(v.string()),
    answererClerkId: v.string(),
  },
  handler: async (_ctx, args): Promise<void> => {
    const webhookUrl = process.env.SLACK_ADMIN_WEBHOOK_URL
    if (!webhookUrl) {
      return
    }

    const userDisplay = formatDisplayName(args.answererFirstName, args.answererUsername, args.answererClerkId)
    const headline = `${userDisplay}님이 답변을 삭제했어요`

    await sendSlackMessage(webhookUrl, {
      text: headline,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: headline,
          },
        },
      ],
    })
  },
})
