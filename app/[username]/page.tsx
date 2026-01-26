import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'
import UserProfilePage from './user-profile'

export async function generateStaticParams() {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)
  const usernames = await convex.query(api.users.listAllUsernames, {})
  return usernames.map((username) => ({ username }))
}

export default function Page() {
  return <UserProfilePage />
}
