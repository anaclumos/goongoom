import { beforeEach, describe, expect, mock, test } from "bun:test"

// Track what data was passed to .values()
let capturedInsertData: unknown = null

// Create mock chain for Drizzle
const mockReturning = mock(() => Promise.resolve([]))
const mockValues = mock((data: unknown) => {
  capturedInsertData = data
  return { returning: mockReturning }
})
const mockInsert = mock(() => ({ values: mockValues }))

// Mock the db module BEFORE importing modules that use it
mock.module("@/src/db", () => ({
  db: {
    insert: mockInsert,
  },
}))

// Now import the modules under test (AFTER mocking)
// Note: headers() and auth() are already mocked in setup.ts preload
import { withAudit } from "@/lib/audit/with-audit"
import { logs } from "@/src/db/schema"

describe("Logs integration (full chain)", () => {
  beforeEach(() => {
    capturedInsertData = null
    mockInsert.mockClear()
    mockValues.mockClear()
    mockReturning.mockClear()
  })

  test("withAudit captures all geo data points through full chain", async () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = "production"

    try {
      const result = await withAudit(
        {
          action: "testAction",
          payload: { inputData: "test", nested: { value: 123 } },
        },
        async () => ({ success: true, data: "mock result" })
      )

      expect(result).toEqual({ success: true, data: "mock result" })
      expect(mockInsert).toHaveBeenCalledWith(logs)

      expect(capturedInsertData).toMatchObject({
        ipAddress: "127.0.0.1",
        userAgent: "test-agent",
        referer: "http://test.com",
        acceptLanguage: "en-US",
        geoCity: "Seoul",
        geoCountry: "KR",
        geoCountryFlag: "🇰🇷",
        geoRegion: "11",
        geoEdgeRegion: "icn1",
        geoLatitude: "37.5665",
        geoLongitude: "126.9780",
        geoPostalCode: "04524",
        userId: "test_user_123",
        action: "testAction",
        payload: { inputData: "test", nested: { value: 123 } },
        success: 1,
        errorMessage: null,
        entityType: null,
        entityId: null,
      })
    } finally {
      process.env.NODE_ENV = originalEnv
    }
  })

  test("withAudit extracts entityId when entityType is provided", async () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = "production"

    try {
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

      expect(capturedInsertData).toMatchObject({
        action: "createQuestion",
        entityType: "question",
        entityId: 42, // Extracted from result.data.id
        success: 1,
      })
    } finally {
      process.env.NODE_ENV = originalEnv
    }
  })

  test("withAudit does not extract entityId on failure", async () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = "production"

    try {
      await withAudit(
        {
          action: "createQuestion",
          payload: { content: "" },
          entityType: "question",
        },
        async () => ({ success: false, error: "Content required" })
      )

      expect(capturedInsertData).toMatchObject({
        action: "createQuestion",
        entityType: "question",
        entityId: null, // Not extracted because action failed
        success: 0,
        errorMessage: "Content required",
      })
    } finally {
      process.env.NODE_ENV = originalEnv
    }
  })

  test("withAudit captures error when action throws", async () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = "production"

    try {
      await expect(
        withAudit({ action: "throwingAction", payload: {} }, () => {
          throw new Error("Unexpected error")
        })
      ).rejects.toThrow("Unexpected error")

      expect(capturedInsertData).toMatchObject({
        action: "throwingAction",
        success: 0,
        errorMessage: "Unexpected error",
      })
    } finally {
      process.env.NODE_ENV = originalEnv
    }
  })
})
