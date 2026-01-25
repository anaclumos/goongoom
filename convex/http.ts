import { httpRouter } from 'convex/server'
import { Webhook } from 'svix'
import { internal } from './_generated/api'
import { httpAction } from './_generated/server'

const CJK_REGEX = /^[\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF\u1100-\u11FF]+$/

function isAllCJK(str: string | null | undefined): boolean {
  if (!str) return false
  return CJK_REGEX.test(str)
}

function buildFullName(firstName: string | null | undefined, lastName: string | null | undefined): string | undefined {
  if (!firstName && !lastName) return undefined
  if (!firstName) return lastName || undefined
  if (!lastName) return firstName

  if (isAllCJK(firstName) && isAllCJK(lastName)) {
    return lastName + firstName
  }
  return firstName + ' ' + lastName
}

const http = httpRouter()

http.route({
  path: '/clerk',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error('CLERK_WEBHOOK_SECRET not configured')
      return new Response('Server configuration error', { status: 500 })
    }

    const svixId = request.headers.get('svix-id')
    const svixTimestamp = request.headers.get('svix-timestamp')
    const svixSignature = request.headers.get('svix-signature')

    if (!(svixId && svixTimestamp && svixSignature)) {
      return new Response('Missing svix headers', { status: 400 })
    }

    const body = await request.text()

    const wh = new Webhook(webhookSecret)
    let evt: {
      type: string
      data: {
        id: string
        username?: string | null
        first_name?: string | null
        last_name?: string | null
        image_url?: string | null
      }
    }

    try {
      evt = wh.verify(body, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as typeof evt
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return new Response('Invalid signature', { status: 400 })
    }

    const { type, data } = evt

    if (type === 'user.created' || type === 'user.updated') {
      const firstName = data.first_name ?? undefined
      const fullName = buildFullName(data.first_name, data.last_name)
      await ctx.runMutation(internal.users.upsertFromWebhook, {
        clerkId: data.id,
        username: data.username ?? undefined,
        firstName,
        fullName,
        avatarUrl: data.image_url ?? undefined,
      })
    } else if (type === 'user.deleted') {
      await ctx.runMutation(internal.users.deleteFromWebhook, {
        clerkId: data.id,
      })
    }

    return new Response('OK', { status: 200 })
  }),
})

export default http
