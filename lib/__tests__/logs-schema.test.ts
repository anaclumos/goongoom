import { describe, expect, test } from "bun:test"
import { getTableColumns } from "drizzle-orm"
import { logs } from "@/src/db/schema"

describe("logs schema", () => {
  test("table is exported and defined", () => {
    expect(logs).toBeDefined()
  })

  test("has all required columns", () => {
    const columns = getTableColumns(logs)
    const columnNames = Object.keys(columns)

    const requiredColumns = [
      "id",
      "ipAddress",
      "geoCity",
      "geoCountry",
      "geoRegion",
      "geoLatitude",
      "geoLongitude",
      "userAgent",
      "referer",
      "acceptLanguage",
      "userId",
      "action",
      "payload",
      "success",
      "errorMessage",
      "entityType",
      "entityId",
      "createdAt",
    ]

    for (const col of requiredColumns) {
      expect(columnNames, `Missing column: ${col}`).toContain(col)
    }
  })

  test("id column is auto-generated identity", () => {
    const columns = getTableColumns(logs)
    expect(columns.id).toBeDefined()
    expect(columns.id.hasDefault).toBe(true)
  })

  test("has entityType and entityId columns for entity tracking", () => {
    const columns = getTableColumns(logs)
    expect(columns.entityType).toBeDefined()
    expect(columns.entityId).toBeDefined()
  })
})
