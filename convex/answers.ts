import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const create = mutation({
  args: {
    questionId: v.id("questions"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("answers", {
      questionId: args.questionId,
      content: args.content,
    })
    return await ctx.db.get(id)
  },
})

export const getRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const answers = await ctx.db
      .query("answers")
      .order("desc")
      .take(args.limit ?? 20)

    const result = await Promise.all(
      answers.map(async (answer) => {
        const question = await ctx.db.get(answer.questionId)
        return {
          question,
          answer,
          recipientClerkId: question?.recipientClerkId ?? "",
        }
      })
    )

    return result.filter((r) => r.question !== null)
  },
})
