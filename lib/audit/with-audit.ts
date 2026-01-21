import { auth } from "@clerk/nextjs/server"
import { headers } from "next/headers"
import { logAuditEntry } from "./logger"
import type { AuditRequestData, EntityType, JsonValue } from "./types"

interface WithAuditOptions {
  action: string
  payload: unknown
  entityType?: EntityType
}

function serializePayload(payload: unknown): JsonValue | null {
  if (payload === null || payload === undefined) {
    return null
  }
  try {
    return JSON.parse(JSON.stringify(payload)) as JsonValue
  } catch {
    return { _raw: String(payload), _type: typeof payload }
  }
}

function isSuccessResult(
  result: unknown
): result is { success: boolean; data: unknown } {
  return (
    typeof result === "object" &&
    result !== null &&
    "success" in result &&
    (result as { success: boolean }).success &&
    "data" in result
  )
}

function hasIdProperty(data: unknown): data is { id: unknown } {
  return typeof data === "object" && data !== null && "id" in data
}

function extractEntityId(result: unknown): number | null {
  if (!isSuccessResult(result)) {
    return null
  }

  if (!hasIdProperty(result.data)) {
    return null
  }

  const id = result.data.id
  return typeof id === "number" ? id : null
}

function extractErrorMessage(result: unknown): string | null {
  if (typeof result === "object" && result !== null && "error" in result) {
    return (result as { error: string }).error
  }
  return null
}

function getActionSuccess(result: unknown): boolean {
  if (typeof result === "object" && result !== null && "success" in result) {
    return (result as { success: boolean }).success
  }
  return true
}

export async function withAudit<T>(
  options: WithAuditOptions,
  action: () => Promise<T>
): Promise<T> {
  const { action: actionName, payload, entityType } = options

  const headersList = await headers()
  const requestData: AuditRequestData = {
    ipAddress: headersList.get("x-forwarded-for")?.split(",")[0] || null,
    userAgent: headersList.get("user-agent") || null,
    referer: headersList.get("referer") || null,
    acceptLanguage: headersList.get("accept-language") || null,
    geoCity: headersList.get("x-vercel-ip-city") || null,
    geoCountry: headersList.get("x-vercel-ip-country") || null,
    geoRegion: headersList.get("x-vercel-ip-country-region") || null,
    geoLatitude: headersList.get("x-vercel-ip-latitude") || null,
    geoLongitude: headersList.get("x-vercel-ip-longitude") || null,
  }

  const { userId } = await auth()

  const serializedPayload = serializePayload(payload)

  let success = true
  let errorMessage: string | null = null
  let entityId: number | null = null
  let result: T

  try {
    result = await action()
    success = getActionSuccess(result)
    if (!success) {
      errorMessage = extractErrorMessage(result)
    }
    if (entityType && success) {
      entityId = extractEntityId(result)
    }
  } catch (error) {
    success = false
    errorMessage = error instanceof Error ? error.message : String(error)
    throw error
  } finally {
    await logAuditEntry({
      ...requestData,
      userId: userId || null,
      action: actionName,
      payload: serializedPayload,
      success,
      errorMessage,
      entityType: entityType || null,
      entityId,
    })
  }

  return result
}
