import { beforeEach, describe, expect, test } from "bun:test"
import { api } from "../../convex/_generated/api"
import {
  createTestAnswer,
  createTestContext,
  createTestQuestion,
  TEST_CLERK_ID,
  TEST_CLERK_ID_2,
} from "./helpers"

describe("answers", () => {
  let t: Awaited<ReturnType<typeof createTestContext>>

  beforeEach(async () => {
    t = await createTestContext()
  })

  describe("create", () => {
    test("creates answer and links to question", async () => {
      const questionId = await createTestQuestion(t, TEST_CLERK_ID, {
        content: "Test question",
      })

      const answer = await t.mutation(api.answers.create, {
        questionId,
        content: "This is my answer",
      })

      expect(answer).toBeDefined()
      expect(answer?.content).toBe("This is my answer")
      expect(answer?.questionId).toBe(questionId)

      const question = await t.query(api.questions.getById, { id: questionId })
      expect(question?.answerId).toBe(answer?._id)
    })

    test("throws error if question already answered", async () => {
      const questionId = await createTestQuestion(t, TEST_CLERK_ID)
      await createTestAnswer(t, questionId, "First answer")

      await expect(
        t.mutation(api.answers.create, {
          questionId,
          content: "Second answer",
        })
      ).rejects.toThrow("Question already answered")
    })

    test("throws error if question not found", async () => {
      await expect(
        t.mutation(api.answers.create, {
          questionId: "invalid_id" as never,
          content: "Answer to nothing",
        })
      ).rejects.toThrow()
    })
  })

  describe("getRecent", () => {
    test("returns recent answers with questions", async () => {
      const q1 = await createTestQuestion(t, TEST_CLERK_ID, {
        content: "Question 1",
      })
      const q2 = await createTestQuestion(t, TEST_CLERK_ID_2, {
        content: "Question 2",
      })

      await createTestAnswer(t, q1, "Answer 1")
      await createTestAnswer(t, q2, "Answer 2")

      const recent = await t.query(api.answers.getRecent, { limit: 10 })

      expect(recent.length).toBe(2)
      expect(recent[0]?.answer.content).toBe("Answer 2")
      expect(recent[0]?.question.content).toBe("Question 2")
    })

    test("respects limit parameter", async () => {
      for (let i = 0; i < 5; i++) {
        const qId = await createTestQuestion(t, TEST_CLERK_ID, {
          content: `Q${i}`,
        })
        await createTestAnswer(t, qId, `A${i}`)
      }

      const recent = await t.query(api.answers.getRecent, { limit: 3 })
      expect(recent.length).toBe(3)
    })
  })
})
