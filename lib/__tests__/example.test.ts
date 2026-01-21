/// <reference types="bun" />
import { describe, expect, test } from "bun:test"

describe("Test infrastructure", () => {
  test("env mocking works (can import modules that depend on @/env)", async () => {
    const schema = await import("@/src/db/schema")
    expect(schema.goongoom).toBeDefined()
  })

  test("next/headers mocking works", async () => {
    const { headers } = await import("next/headers")
    const headersList = await headers()
    expect(headersList.get("user-agent")).toBe("test-agent")
  })

  test("clerk mocking works", async () => {
    const { auth } = await import("@clerk/nextjs/server")
    const { userId } = await auth()
    expect(userId).toBe("test_user_123")
  })
})
