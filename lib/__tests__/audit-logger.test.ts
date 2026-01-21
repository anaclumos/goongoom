import { beforeEach, describe, expect, mock, test } from "bun:test"

// Track what data was passed to .values()
let capturedInsertData: unknown = null

// Create mock chain for Drizzle: db.insert(table).values(data).returning()
const mockReturning = mock(() => Promise.resolve([]))
const mockValues = mock((data: unknown) => {
  capturedInsertData = data
  return { returning: mockReturning }
})
const mockInsert = mock(() => ({ values: mockValues }))

// Mock the db module BEFORE importing logger
mock.module("@/src/db", () => ({
  db: {
    insert: mockInsert,
  },
}))

// Now import after mocking
import { logAuditEntry } from "@/lib/audit/logger"
import { logs } from "@/src/db/schema"

describe("Audit logger", () => {
  beforeEach(() => {
    capturedInsertData = null
    mockInsert.mockClear()
    mockValues.mockClear()
    mockReturning.mockClear()
  })

  test("logs entry to database when in production", async () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = "production"

    try {
      await logAuditEntry({
        ipAddress: "192.168.1.1",
        geoCity: "Seoul",
        geoCountry: "KR",
        geoRegion: "Seoul",
        geoLatitude: "37.5665",
        geoLongitude: "126.9780",
        userAgent: "Mozilla/5.0",
        referer: "https://example.com",
        acceptLanguage: "ko-KR",
        userId: "user_123",
        action: "createQuestion",
        payload: { content: "Test question" },
        success: true,
        errorMessage: null,
        entityType: "question",
        entityId: 42,
      })

      expect(mockInsert).toHaveBeenCalledWith(logs)
      expect(capturedInsertData).toMatchObject({
        ipAddress: "192.168.1.1",
        geoCity: "Seoul",
        userId: "user_123",
        action: "createQuestion",
        success: 1, // boolean → integer conversion
        entityType: "question",
        entityId: 42,
      })
    } finally {
      process.env.NODE_ENV = originalEnv
    }
  })

  test("skips logging when not in production", async () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = "development"

    try {
      await logAuditEntry({
        ipAddress: "127.0.0.1",
        userAgent: "test",
        referer: null,
        acceptLanguage: "en",
        userId: "user_123",
        action: "test",
        payload: null,
        success: true,
        errorMessage: null,
        geoCity: null,
        geoCountry: null,
        geoRegion: null,
        geoLatitude: null,
        geoLongitude: null,
        entityType: null,
        entityId: null,
      })

      expect(mockInsert).not.toHaveBeenCalled()
    } finally {
      process.env.NODE_ENV = originalEnv
    }
  })

  test("handles null values gracefully", async () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = "production"

    try {
      await logAuditEntry({
        ipAddress: null,
        geoCity: null,
        geoCountry: null,
        geoRegion: null,
        geoLatitude: null,
        geoLongitude: null,
        userAgent: null,
        referer: null,
        acceptLanguage: null,
        userId: null,
        action: "testAction",
        payload: null,
        success: false,
        errorMessage: "Test error",
        entityType: null,
        entityId: null,
      })

      expect(mockInsert).toHaveBeenCalled()
      expect(capturedInsertData).toMatchObject({
        ipAddress: null,
        userId: null,
        action: "testAction",
        payload: null,
        success: 0, // false → 0
        errorMessage: "Test error",
        entityType: null,
        entityId: null,
      })
    } finally {
      process.env.NODE_ENV = originalEnv
    }
  })

  test("converts boolean success to integer (true → 1, false → 0)", async () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = "production"

    try {
      // Test true → 1
      await logAuditEntry({
        ipAddress: "1.1.1.1",
        userAgent: "test",
        referer: null,
        acceptLanguage: "en",
        userId: "user_1",
        action: "test1",
        payload: null,
        success: true, // boolean
        errorMessage: null,
        geoCity: null,
        geoCountry: null,
        geoRegion: null,
        geoLatitude: null,
        geoLongitude: null,
        entityType: null,
        entityId: null,
      })

      expect((capturedInsertData as { success: number }).success).toBe(1)

      // Test false → 0
      await logAuditEntry({
        ipAddress: "1.1.1.1",
        userAgent: "test",
        referer: null,
        acceptLanguage: "en",
        userId: "user_2",
        action: "test2",
        payload: null,
        success: false, // boolean
        errorMessage: "Error",
        geoCity: null,
        geoCountry: null,
        geoRegion: null,
        geoLatitude: null,
        geoLongitude: null,
        entityType: null,
        entityId: null,
      })

      expect((capturedInsertData as { success: number }).success).toBe(0)
    } finally {
      process.env.NODE_ENV = originalEnv
    }
  })

  test("does not throw on database errors", async () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = "production"

    // Make mockValues throw an error
    mockValues.mockImplementation(() => {
      throw new Error("Database connection failed")
    })

    try {
      // This should NOT throw - errors are swallowed
      await expect(
        logAuditEntry({
          ipAddress: "1.1.1.1",
          userAgent: "test",
          referer: null,
          acceptLanguage: "en",
          userId: "user_123",
          action: "test",
          payload: null,
          success: true,
          errorMessage: null,
          geoCity: null,
          geoCountry: null,
          geoRegion: null,
          geoLatitude: null,
          geoLongitude: null,
          entityType: null,
          entityId: null,
        })
      ).resolves.toBeUndefined()
    } finally {
      process.env.NODE_ENV = originalEnv
    }
  })
})
