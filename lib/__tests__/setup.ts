/// <reference types="bun" />
// This file is preloaded before all tests via bunfig.toml
import { mock } from "bun:test"

// Mock @/env to prevent required env var errors
mock.module("@/env", () => ({
  env: {
    DATABASE_URL: "mock://localhost/test",
    DATABASE_SCHEMA: "test_schema",
    CLERK_SECRET_KEY: "mock_clerk_secret",
    CLERK_WEBHOOK_SECRET: "mock_webhook_secret",
  },
}))

// Mock next/headers (used by withAudit)
mock.module("next/headers", () => ({
  headers: () =>
    Promise.resolve(
      new Headers({
        "user-agent": "test-agent",
        "x-forwarded-for": "127.0.0.1",
        referer: "http://test.com",
        "accept-language": "en-US",
      })
    ),
}))

// Mock @clerk/nextjs/server (used by withAudit)
mock.module("@clerk/nextjs/server", () => ({
  auth: () => Promise.resolve({ userId: "test_user_123" }),
}))
