import { beforeEach, describe, expect, test } from "bun:test"
import { api } from "../../convex/_generated/api"
import {
  createTestAnswer,
  createTestContext,
  createTestQuestion,
  TEST_CLERK_ID,
  TEST_CLERK_ID_2,
} from "./helpers"

describe("questions", () => {
  let t: Awaited<ReturnType<typeof createTestContext>>

  beforeEach(async () => {
    t = await createTestContext()
  })

  describe("create", () => {
    test("creates anonymous question", async () => {
      const question = await t.mutation(api.questions.create, {
        recipientClerkId: TEST_CLERK_ID,
        content: "What is your favorite color?",
        isAnonymous: true,
        anonymousAvatarSeed: "abc123",
      })

      expect(question).toBeDefined()
      expect(question?.content).toBe("What is your favorite color?")
      expect(question?.isAnonymous).toBe(true)
      expect(question?.senderClerkId).toBeUndefined()
      expect(question?.anonymousAvatarSeed).toBe("abc123")
    })

    test("creates identified question with sender", async () => {
      const question = await t.mutation(api.questions.create, {
        recipientClerkId: TEST_CLERK_ID,
        senderClerkId: TEST_CLERK_ID_2,
        content: "Hello, how are you?",
        isAnonymous: false,
      })

      expect(question).toBeDefined()
      expect(question?.senderClerkId).toBe(TEST_CLERK_ID_2)
      expect(question?.isAnonymous).toBe(false)
    })
  })

  describe("getUnanswered", () => {
    test("returns only unanswered questions", async () => {
      await createTestQuestion(t, TEST_CLERK_ID, {
        content: "Unanswered 1",
      })
      const answeredQ = await createTestQuestion(t, TEST_CLERK_ID, {
        content: "Answered",
      })
      await createTestQuestion(t, TEST_CLERK_ID, { content: "Unanswered 2" })

      await createTestAnswer(t, answeredQ, "This is answered")

      const unanswered = await t.query(api.questions.getUnanswered, {
        recipientClerkId: TEST_CLERK_ID,
      })

      expect(unanswered.length).toBe(2)
      expect(unanswered.some((q) => q.content === "Answered")).toBe(false)
    })
  })

  describe("getAnsweredByRecipient", () => {
    test("returns questions with answers sorted by answer time", async () => {
      const q1 = await createTestQuestion(t, TEST_CLERK_ID, {
        content: "First question",
      })
      const q2 = await createTestQuestion(t, TEST_CLERK_ID, {
        content: "Second question",
      })

      await createTestAnswer(t, q1, "First answer")
      await new Promise((r) => setTimeout(r, 10))
      await createTestAnswer(t, q2, "Second answer")

      const answered = await t.query(api.questions.getAnsweredByRecipient, {
        recipientClerkId: TEST_CLERK_ID,
      })

      expect(answered.length).toBe(2)
      expect(answered[0]?.content).toBe("Second question")
    })
  })

  describe("getSentByUser", () => {
    test("returns questions sent by user", async () => {
      await createTestQuestion(t, TEST_CLERK_ID, {
        senderClerkId: TEST_CLERK_ID_2,
        content: "From user 2",
        isAnonymous: false,
      })

      await createTestQuestion(t, TEST_CLERK_ID_2, {
        senderClerkId: TEST_CLERK_ID,
        content: "From user 1",
        isAnonymous: false,
      })

      const sent = await t.query(api.questions.getSentByUser, {
        senderClerkId: TEST_CLERK_ID,
      })

      expect(sent.length).toBe(1)
      expect(sent[0]?.content).toBe("From user 1")
    })
  })

  describe("getFriends", () => {
    test("computes friend relationships from interactions", async () => {
      const q1 = await createTestQuestion(t, TEST_CLERK_ID, {
        senderClerkId: TEST_CLERK_ID_2,
        content: "Question from friend",
        isAnonymous: false,
      })
      await createTestAnswer(t, q1, "Answer to friend")

      const friends = await t.query(api.questions.getFriends, {
        clerkId: TEST_CLERK_ID,
      })

      expect(friends.length).toBe(1)
      expect(friends[0]?.clerkId).toBe(TEST_CLERK_ID_2)
      expect(friends[0]?.questionsReceived).toBe(1)
    })
  })

  describe("getAnsweredNumber", () => {
    test("returns chronological position of answered question", async () => {
      const firstQ = await createTestQuestion(t, TEST_CLERK_ID)
      await createTestQuestion(t, TEST_CLERK_ID)
      const thirdQ = await createTestQuestion(t, TEST_CLERK_ID)

      await createTestAnswer(t, firstQ, "Answer 1")
      await createTestAnswer(t, thirdQ, "Answer 3")

      const number = await t.query(api.questions.getAnsweredNumber, {
        questionId: thirdQ,
        recipientClerkId: TEST_CLERK_ID,
      })

      expect(number).toBe(2)
    })
  })
})
