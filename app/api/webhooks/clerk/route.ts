import type { WebhookEvent } from "@clerk/nextjs/server"
import { fetchMutation } from "convex/nextjs"
import { headers } from "next/headers"
import { Webhook } from "svix"
import { api } from "@/convex/_generated/api"
import { env } from "@/env"

export async function POST(req: Request) {
  const WEBHOOK_SECRET = env.CLERK_WEBHOOK_SECRET

  const headerPayload = await headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  if (!(svix_id && svix_timestamp && svix_signature)) {
    return new Response("Error: Missing svix headers", { status: 400 })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error("Error verifying webhook:", err)
    return new Response("Error: Invalid signature", { status: 400 })
  }

  const eventType = evt.type

  if (eventType === "user.created") {
    const { id } = evt.data

    try {
      await fetchMutation(api.users.getOrCreate, { clerkId: id })
      console.log(`Created user record for clerkId: ${id}`)
    } catch (error) {
      console.error("Error creating user:", error)
      return new Response("Error: Failed to create user", { status: 500 })
    }
  }

  if (eventType === "user.updated") {
    const { id } = evt.data

    try {
      await fetchMutation(api.users.updateProfile, {
        clerkId: id,
      })
      console.log(`Updated user record for clerkId: ${id}`)
    } catch (error) {
      console.error("Error updating user:", error)
      return new Response("Error: Failed to update user", { status: 500 })
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data

    if (id) {
      try {
        await fetchMutation(api.users.deleteByClerkId, { clerkId: id })
        console.log(`Deleted user record for clerkId: ${id}`)
      } catch (error) {
        console.error(`Failed to delete user ${id}:`, error)
      }
    }
  }

  return new Response("Webhook processed", { status: 200 })
}
