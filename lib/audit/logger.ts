import { db } from "@/src/db"
import { logs } from "@/src/db/schema"
import type { AuditLogEntry, AuditLogInsert } from "./types"

/**
 * Logs an audit entry to the database.
 *
 * - Only logs in production environment
 * - Swallows errors to prevent breaking caller
 * - Converts success boolean to integer (1=true, 0=false)
 *
 * @param entry - The audit log entry to persist
 */
export async function logAuditEntry(entry: AuditLogEntry): Promise<void> {
  // Only log in production
  if (process.env.NODE_ENV !== "production") {
    return
  }

  try {
    // Convert AuditLogEntry (boolean success) to AuditLogInsert (integer success)
    const insertData: AuditLogInsert = {
      ...entry,
      success: entry.success ? 1 : 0, // boolean → integer conversion
    }

    // Insert into database
    await db.insert(logs).values(insertData).returning()
  } catch (error) {
    // Swallow errors to prevent breaking mutations
    // In production, consider logging to error tracking service (Sentry, etc.)
    console.error("[Audit Logger] Failed to log audit entry:", error)
  }
}
