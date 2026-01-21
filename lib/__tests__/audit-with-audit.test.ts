import { beforeEach, describe, expect, mock, test } from "bun:test"

// Track what data was passed to logAuditEntry
let capturedLogData: unknown = null

// Mock logAuditEntry
const mockLogAuditEntry = mock((data: unknown) => {
  capturedLogData = data
  return Promise.resolve()
})

mock.module("@/lib/audit/logger", () => ({
  logAuditEntry: mockLogAuditEntry,
}))

// Import after mocking
import { withAudit } from "@/lib/audit/with-audit"

describe("withAudit wrapper", () => {
  beforeEach(() => {
    capturedLogData = null
    mockLogAuditEntry.mockClear()
  })

  test("captures all request data from headers", async () => {
    await withAudit(
      { action: "testAction", payload: { test: "data" } },
      async () => ({ success: true, data: "result" })
    )

    expect(capturedLogData).toMatchObject({
      ipAddress: "127.0.0.1",
      userAgent: "test-agent",
      referer: "http://test.com",
      acceptLanguage: "en-US",
      userId: "test_user_123",
      action: "testAction",
      payload: { test: "data" },
    })
  })

  test("logs successful actions with result", async () => {
    const result = await withAudit(
      { action: "createQuestion", payload: { content: "Test?" } },
      async () => ({ success: true, data: { id: 42, content: "Test?" } })
    )

    expect(result).toEqual({
      success: true,
      data: { id: 42, content: "Test?" },
    })
    expect(capturedLogData).toMatchObject({
      action: "createQuestion",
      payload: { content: "Test?" },
      success: true,
      errorMessage: null,
    })
  })

  test("logs failed actions with error", async () => {
    const result = await withAudit(
      { action: "createQuestion", payload: { content: "" } },
      async () => ({ success: false, error: "Content required" })
    )

    expect(result).toEqual({ success: false, error: "Content required" })
    expect(capturedLogData).toMatchObject({
      action: "createQuestion",
      success: false,
      errorMessage: "Content required",
    })
  })

  test("preserves original action return type", async () => {
    const result = await withAudit(
      { action: "test", payload: null },
      async () => ({ success: true, data: { customField: "value" } })
    )

    expect(result).toHaveProperty("success")
    expect(result).toHaveProperty("data")
    expect(
      (result as { success: boolean; data: { customField: string } }).data
        .customField
    ).toBe("value")
  })

  test("extracts userId from Clerk auth", async () => {
    await withAudit({ action: "test", payload: null }, async () => ({
      success: true,
    }))

    expect(capturedLogData).toMatchObject({
      userId: "test_user_123",
    })
  })

  test("serializes payload correctly", async () => {
    // Test nested objects
    await withAudit(
      {
        action: "test",
        payload: { nested: { value: 123 }, arr: [1, 2, 3] },
      },
      async () => ({ success: true })
    )

    expect(capturedLogData).toMatchObject({
      payload: { nested: { value: 123 }, arr: [1, 2, 3] },
    })
  })

  test("extracts entityId from action result when entityType is provided", async () => {
    const result = await withAudit(
      {
        action: "createQuestion",
        payload: { content: "Test?" },
        entityType: "question",
      },
      async () => ({ success: true, data: { id: 42, content: "Test?" } })
    )

    expect(result).toEqual({
      success: true,
      data: { id: 42, content: "Test?" },
    })
    expect(capturedLogData).toMatchObject({
      action: "createQuestion",
      entityType: "question",
      entityId: 42,
      success: true,
    })
  })
})
