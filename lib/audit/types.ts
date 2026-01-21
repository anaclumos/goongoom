// JSON-safe type for payload storage (defined first)
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }

// Entity types that can be tracked
export type EntityType = "question" | "answer"

export interface AuditRequestData {
  ipAddress: string | null
  geoCity: string | null
  geoCountry: string | null
  geoCountryFlag: string | null
  geoRegion: string | null
  geoEdgeRegion: string | null
  geoLatitude: string | null
  geoLongitude: string | null
  geoPostalCode: string | null
  userAgent: string | null
  referer: string | null
  acceptLanguage: string | null
}

// Complete audit log entry (TypeScript representation)
export interface AuditLogEntry extends AuditRequestData {
  userId: string | null
  action: string
  payload: JsonValue | null
  success: boolean
  errorMessage: string | null
  entityType: EntityType | null
  entityId: number | null
}

// For DB insert (converts boolean to integer)
export interface AuditLogInsert extends Omit<AuditLogEntry, "success"> {
  success: number
}
