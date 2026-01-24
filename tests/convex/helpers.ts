import path from "node:path"
import { Glob } from "bun"
import { convexTest } from "convex-test"
import schema from "../../convex/schema"

async function buildConvexModules() {
  const modules: Record<string, () => Promise<unknown>> = {}
  const convexDir = path.resolve(import.meta.dir, "../../convex")
  const glob = new Glob("**/*.{ts,js}")

  for await (const file of glob.scan({ cwd: convexDir })) {
    if (file.includes("__tests__")) {
      continue
    }
    const key = `./${file}`
    const fullPath = path.join(convexDir, file)
    modules[key] = () => import(fullPath)
  }

  return modules
}

let cachedModules: Record<string, () => Promise<unknown>> | null = null

export const createTestContext = async () => {
  if (!cachedModules) {
    cachedModules = await buildConvexModules()
  }
  return convexTest(schema, cachedModules)
}

export const TEST_CLERK_ID = "user_test_123"
export const TEST_CLERK_ID_2 = "user_test_456"

export const createTestUser = async (
  t: Awaited<ReturnType<typeof createTestContext>>,
  clerkId = TEST_CLERK_ID,
  overrides: {
    bio?: string
    questionSecurityLevel?: string
    signatureColor?: string
  } = {}
) => {
  const userId = await t.run(async (ctx) => {
    return await ctx.db.insert("users", {
      clerkId,
      questionSecurityLevel: overrides.questionSecurityLevel ?? "anyone",
      bio: overrides.bio,
      signatureColor: overrides.signatureColor,
      updatedAt: Date.now(),
    })
  })
  return userId
}

export const createTestQuestion = async (
  t: Awaited<ReturnType<typeof createTestContext>>,
  recipientClerkId: string,
  options: {
    senderClerkId?: string
    content?: string
    isAnonymous?: boolean
    anonymousAvatarSeed?: string
  } = {}
) => {
  const questionId = await t.run(async (ctx) => {
    return await ctx.db.insert("questions", {
      recipientClerkId,
      senderClerkId: options.senderClerkId,
      content: options.content ?? "Test question content",
      isAnonymous: options.isAnonymous ?? true,
      anonymousAvatarSeed: options.anonymousAvatarSeed,
    })
  })
  return questionId
}

export const createTestAnswer = async (
  t: Awaited<ReturnType<typeof createTestContext>>,
  questionId: Awaited<ReturnType<typeof createTestQuestion>>,
  content = "Test answer content"
) => {
  const answerId = await t.run(async (ctx) => {
    const id = await ctx.db.insert("answers", {
      questionId,
      content,
    })
    await ctx.db.patch(questionId, { answerId: id })
    return id
  })
  return answerId
}
