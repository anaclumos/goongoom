import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const create = mutation({
  args: {
    recipientClerkId: v.string(),
    senderClerkId: v.optional(v.string()),
    content: v.string(),
    isAnonymous: v.boolean(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("questions", {
      recipientClerkId: args.recipientClerkId,
      senderClerkId: args.senderClerkId,
      content: args.content,
      isAnonymous: args.isAnonymous,
    })
    return await ctx.db.get(id)
  },
})

export const getById = query({
  args: { id: v.id("questions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const getByIdAndRecipient = query({
  args: {
    id: v.id("questions"),
    recipientClerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const question = await ctx.db.get(args.id)
    if (!question || question.recipientClerkId !== args.recipientClerkId) {
      return null
    }

    const answers = await ctx.db
      .query("answers")
      .withIndex("by_question", (q) => q.eq("questionId", args.id))
      .collect()

    return { ...question, answers }
  },
})

export const getByRecipient = query({
  args: {
    recipientClerkId: v.string(),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const questions = await ctx.db
      .query("questions")
      .withIndex("by_recipient", (q) =>
        q.eq("recipientClerkId", args.recipientClerkId)
      )
      .order("desc")
      .take(args.limit ?? 100)

    const questionsWithAnswers = await Promise.all(
      questions.map(async (question) => {
        const answers = await ctx.db
          .query("answers")
          .withIndex("by_question", (q) => q.eq("questionId", question._id))
          .collect()
        return { ...question, answers }
      })
    )

    return questionsWithAnswers
  },
})

export const getUnanswered = query({
  args: { recipientClerkId: v.string() },
  handler: async (ctx, args) => {
    const questions = await ctx.db
      .query("questions")
      .withIndex("by_recipient", (q) =>
        q.eq("recipientClerkId", args.recipientClerkId)
      )
      .order("desc")
      .collect()

    const unanswered = await Promise.all(
      questions.map(async (question) => {
        const answers = await ctx.db
          .query("answers")
          .withIndex("by_question", (q) => q.eq("questionId", question._id))
          .collect()
        return answers.length === 0 ? question : null
      })
    )

    return unanswered.filter(Boolean)
  },
})

export const getAnsweredByRecipient = query({
  args: { recipientClerkId: v.string() },
  handler: async (ctx, args) => {
    const questions = await ctx.db
      .query("questions")
      .withIndex("by_recipient", (q) =>
        q.eq("recipientClerkId", args.recipientClerkId)
      )
      .order("desc")
      .collect()

    const answered = await Promise.all(
      questions.map(async (question) => {
        const answers = await ctx.db
          .query("answers")
          .withIndex("by_question", (q) => q.eq("questionId", question._id))
          .collect()
        return answers.length > 0 ? { ...question, answers } : null
      })
    )

    return answered.filter(Boolean)
  },
})

export const getSentByUser = query({
  args: {
    senderClerkId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const questions = await ctx.db
      .query("questions")
      .filter((q) => q.eq(q.field("senderClerkId"), args.senderClerkId))
      .order("desc")
      .take(args.limit ?? 100)

    const questionsWithAnswers = await Promise.all(
      questions.map(async (question) => {
        const answers = await ctx.db
          .query("answers")
          .withIndex("by_question", (q) => q.eq("questionId", question._id))
          .collect()
        return { ...question, answers }
      })
    )

    return questionsWithAnswers
  },
})

export const getAnsweredNumber = query({
  args: {
    questionId: v.id("questions"),
    recipientClerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const question = await ctx.db.get(args.questionId)
    if (!question) {
      return 0
    }

    const allQuestions = await ctx.db
      .query("questions")
      .withIndex("by_recipient", (q) =>
        q.eq("recipientClerkId", args.recipientClerkId)
      )
      .collect()

    const questionsBeforeOrEqual = allQuestions.filter(
      (q) => q._creationTime <= question._creationTime
    )

    let count = 0
    for (const q of questionsBeforeOrEqual) {
      const answers = await ctx.db
        .query("answers")
        .withIndex("by_question", (qb) => qb.eq("questionId", q._id))
        .collect()
      if (answers.length > 0) {
        count++
      }
    }

    return count
  },
})
