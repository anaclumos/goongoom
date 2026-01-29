import { internal } from './_generated/api'
import { internalMutation } from './_generated/server'
import type { Doc } from './_generated/dataModel'

export const backfillLanguages = internalMutation({
  args: {},
  handler: async (ctx) => {
    const questions = await ctx.db.query('questions').collect()
    let qScheduled = 0
    for (const q of questions) {
      if (!q.language && !q.deletedAt) {
        await ctx.scheduler.runAfter(0, internal.languageActions.detectQuestionLanguage, {
          questionId: q._id,
          content: q.content,
        })
        qScheduled++
      }
    }

    const answers = await ctx.db.query('answers').collect()
    let aScheduled = 0
    for (const a of answers) {
      if (!a.language && !a.deletedAt) {
        await ctx.scheduler.runAfter(0, internal.languageActions.detectAnswerLanguage, {
          answerId: a._id,
          content: a.content,
        })
        aScheduled++
      }
    }

    return { questionsScheduled: qScheduled, answersScheduled: aScheduled }
  },
})

export const backfillAnswerStats = internalMutation({
  args: {},
  handler: async (ctx) => {
    const answers = await ctx.db
      .query('answers')
      .filter((q) => q.eq(q.field('deletedAt'), undefined))
      .collect()

    const count = answers.length
    const existing = await ctx.db.query('stats').withIndex('by_key', (q) => q.eq('key', 'answers')).first()
    if (existing) {
      await ctx.db.patch(existing._id, { count, updatedAt: Date.now() })
    } else {
      await ctx.db.insert('stats', { key: 'answers', count, updatedAt: Date.now() })
    }

    return { count }
  },
})

export const backfillAnswerNumbers = internalMutation({
  args: {},
  handler: async (ctx) => {
    const questions = await ctx.db
      .query('questions')
      .filter((q) =>
        q.and(
          q.neq(q.field('answerId'), undefined),
          q.neq(q.field('answerId'), null),
          q.eq(q.field('deletedAt'), undefined)
        )
      )
      .collect()

    const answerIds = questions.map((q) => q.answerId).filter((id): id is NonNullable<typeof id> => id != null)
    const answers = await Promise.all(answerIds.map((id) => ctx.db.get(id)))
    const answerMap = new Map(answers.filter(Boolean).map((answer) => [answer!._id, answer!]))

    const byRecipient = new Map<string, Array<{ question: Doc<'questions'>; answeredAt: number }>>()
    for (const question of questions) {
      const answer = question.answerId ? answerMap.get(question.answerId) : undefined
      if (!answer) continue
      const list = byRecipient.get(question.recipientClerkId) ?? []
      list.push({ question, answeredAt: answer._creationTime })
      byRecipient.set(question.recipientClerkId, list)
    }

    let updatedQuestions = 0
    let updatedUsers = 0

    for (const [recipientClerkId, items] of byRecipient.entries()) {
      items.sort((a, b) => a.answeredAt - b.answeredAt)
      let sequence = 0
      for (const { question, answeredAt } of items) {
        sequence += 1
        if (question.answeredAt !== answeredAt || question.answerNumber !== sequence) {
          await ctx.db.patch(question._id, { answeredAt, answerNumber: sequence })
          updatedQuestions += 1
        }
      }

      const user = await ctx.db
        .query('users')
        .withIndex('by_clerk_id', (q) => q.eq('clerkId', recipientClerkId))
        .first()
      if (user && user.answeredSequence !== sequence) {
        await ctx.db.patch(user._id, { answeredSequence: sequence, updatedAt: Date.now() })
        updatedUsers += 1
      }
    }

    return { updatedQuestions, updatedUsers }
  },
})

export const backfillUnansweredAnswerId = internalMutation({
  args: {},
  handler: async (ctx) => {
    const questions = await ctx.db
      .query('questions')
      .filter((q) => q.and(q.eq(q.field('answerId'), undefined), q.eq(q.field('deletedAt'), undefined)))
      .collect()

    let updated = 0
    for (const question of questions) {
      await ctx.db.patch(question._id, { answerId: null, answeredAt: undefined })
      updated += 1
    }

    return { updated }
  },
})
