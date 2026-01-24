import { beforeEach, describe, expect, test } from "bun:test"
import { api } from "../../convex/_generated/api"
import { createTestContext, TEST_CLERK_ID, TEST_CLERK_ID_2 } from "./helpers"

describe("users", () => {
  let t: Awaited<ReturnType<typeof createTestContext>>

  beforeEach(async () => {
    t = await createTestContext()
  })

  describe("getOrCreate", () => {
    test("creates new user with default values", async () => {
      const user = await t.mutation(api.users.getOrCreate, {
        clerkId: TEST_CLERK_ID,
      })

      expect(user).toBeDefined()
      expect(user?.clerkId).toBe(TEST_CLERK_ID)
      expect(user?.questionSecurityLevel).toBe("anyone")
      expect(user?.bio).toBeUndefined()
    })

    test("returns existing user without modification", async () => {
      await t.run(async (ctx) => {
        await ctx.db.insert("users", {
          clerkId: TEST_CLERK_ID,
          questionSecurityLevel: "login",
          bio: "Original bio",
          updatedAt: Date.now(),
        })
      })

      const user = await t.mutation(api.users.getOrCreate, {
        clerkId: TEST_CLERK_ID,
      })

      expect(user?.bio).toBe("Original bio")
      expect(user?.questionSecurityLevel).toBe("login")
    })
  })

  describe("getByClerkId", () => {
    test("finds user by clerk ID", async () => {
      await t.run(async (ctx) => {
        await ctx.db.insert("users", {
          clerkId: TEST_CLERK_ID,
          questionSecurityLevel: "anyone",
          bio: "Test bio",
          updatedAt: Date.now(),
        })
      })

      const user = await t.query(api.users.getByClerkId, {
        clerkId: TEST_CLERK_ID,
      })

      expect(user).toBeDefined()
      expect(user?.bio).toBe("Test bio")
    })

    test("returns null for non-existent user", async () => {
      const user = await t.query(api.users.getByClerkId, {
        clerkId: "non_existent_id",
      })

      expect(user).toBeNull()
    })
  })

  describe("updateProfile", () => {
    test("updates bio successfully", async () => {
      await t.run(async (ctx) => {
        await ctx.db.insert("users", {
          clerkId: TEST_CLERK_ID,
          questionSecurityLevel: "anyone",
          updatedAt: Date.now(),
        })
      })

      const updated = await t.mutation(api.users.updateProfile, {
        clerkId: TEST_CLERK_ID,
        bio: "New bio",
      })

      expect(updated?.bio).toBe("New bio")
    })

    test("updates social links", async () => {
      await t.run(async (ctx) => {
        await ctx.db.insert("users", {
          clerkId: TEST_CLERK_ID,
          questionSecurityLevel: "anyone",
          updatedAt: Date.now(),
        })
      })

      const updated = await t.mutation(api.users.updateProfile, {
        clerkId: TEST_CLERK_ID,
        socialLinks: {
          instagram: "testuser",
          twitter: "testuser",
        },
      })

      expect(updated?.socialLinks?.instagram).toBe("testuser")
      expect(updated?.socialLinks?.twitter).toBe("testuser")
    })

    test("updates question security level", async () => {
      await t.run(async (ctx) => {
        await ctx.db.insert("users", {
          clerkId: TEST_CLERK_ID,
          questionSecurityLevel: "anyone",
          updatedAt: Date.now(),
        })
      })

      const updated = await t.mutation(api.users.updateProfile, {
        clerkId: TEST_CLERK_ID,
        questionSecurityLevel: "login",
      })

      expect(updated?.questionSecurityLevel).toBe("login")
    })
  })

  describe("deleteByClerkId", () => {
    test("removes user from database", async () => {
      await t.run(async (ctx) => {
        await ctx.db.insert("users", {
          clerkId: TEST_CLERK_ID,
          questionSecurityLevel: "anyone",
          updatedAt: Date.now(),
        })
      })

      await t.mutation(api.users.deleteByClerkId, { clerkId: TEST_CLERK_ID })

      const user = await t.query(api.users.getByClerkId, {
        clerkId: TEST_CLERK_ID,
      })
      expect(user).toBeNull()
    })
  })

  describe("count", () => {
    test("returns correct user count", async () => {
      await t.run(async (ctx) => {
        await ctx.db.insert("users", {
          clerkId: TEST_CLERK_ID,
          questionSecurityLevel: "anyone",
          updatedAt: Date.now(),
        })
        await ctx.db.insert("users", {
          clerkId: TEST_CLERK_ID_2,
          questionSecurityLevel: "anyone",
          updatedAt: Date.now(),
        })
      })

      const count = await t.query(api.users.count, {})
      expect(count).toBe(2)
    })
  })
})
