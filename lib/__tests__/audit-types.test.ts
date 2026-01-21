import { describe, expect, test } from "bun:test"
import type {
  AuditLogEntry,
  AuditLogInsert,
  AuditRequestData,
  EntityType,
  JsonValue,
} from "@/lib/audit/types"

describe("Audit types", () => {
  test("JsonValue type allows arrays and objects", () => {
    const obj: JsonValue = { key: "value" }
    const arr: JsonValue = [1, 2, 3]
    const nested: JsonValue = { arr: [1, { nested: true }] }
    expect(obj).toBeDefined()
    expect(arr).toBeDefined()
    expect(nested).toBeDefined()
  })

  test("EntityType is literal union", () => {
    const question: EntityType = "question"
    const answer: EntityType = "answer"
    expect(question).toBe("question")
    expect(answer).toBe("answer")
  })

  test("AuditRequestData has all required fields", () => {
    const data: AuditRequestData = {
      ipAddress: null,
      geoCity: null,
      geoCountry: null,
      geoRegion: null,
      geoLatitude: null,
      geoLongitude: null,
      userAgent: null,
      referer: null,
      acceptLanguage: null,
    }
    expect(data).toBeDefined()
  })

  test("AuditLogEntry extends AuditRequestData", () => {
    const entry: AuditLogEntry = {
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
      action: "test",
      payload: null,
      success: true,
      errorMessage: null,
      entityType: null,
      entityId: null,
    }
    expect(entry).toBeDefined()
  })

  test("AuditLogInsert has success as number", () => {
    const insert: AuditLogInsert = {
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
      action: "test",
      payload: null,
      success: 1,
      errorMessage: null,
      entityType: null,
      entityId: null,
    }
    expect(insert.success).toBe(1)
  })

  test("types module is importable", async () => {
    const types = await import("@/lib/audit/types")
    expect(types).toBeDefined()
  })
})
