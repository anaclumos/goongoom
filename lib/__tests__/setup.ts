/// <reference types="bun" />
import { mock } from "bun:test"

mock.module("@/env", () => ({
  env: {
    DATABASE_URL: "mock://localhost/test",
    DATABASE_SCHEMA: "test_schema",
    CLERK_SECRET_KEY: "mock_clerk_secret",
    CLERK_WEBHOOK_SECRET: "mock_webhook_secret",
  },
}))

mock.module("next/headers", () => ({
  headers: () =>
    Promise.resolve(
      new Headers({
        "user-agent": "test-agent",
        referer: "http://test.com",
        "accept-language": "en-US",
      })
    ),
}))

mock.module("@vercel/functions", () => ({
  ipAddress: () => "127.0.0.1",
  geolocation: () => ({
    city: "Seoul",
    country: "KR",
    flag: "🇰🇷",
    countryRegion: "11",
    region: "icn1",
    latitude: "37.5665",
    longitude: "126.9780",
    postalCode: "04524",
  }),
}))

mock.module("@clerk/nextjs/server", () => ({
  auth: () => Promise.resolve({ userId: "test_user_123" }),
}))
