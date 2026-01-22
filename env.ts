import { z } from "zod"

const schema = z.object({
  CLERK_SECRET_KEY: z.string().min(1),
  CLERK_WEBHOOK_SECRET: z.string().optional().default(""),
})

export const env = schema.parse(process.env)
