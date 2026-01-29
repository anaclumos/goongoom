import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { FriendsContent } from './friends-content'

export default async function FriendsPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  return <FriendsContent clerkId={userId} />
}
