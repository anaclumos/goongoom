import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'
import QADetailPage from './qa-detail'

export async function generateStaticParams() {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)
  const params = await convex.query(api.questions.listAllAnsweredParams, {})
  return params.map(({ username, questionId }) => ({ username, questionId }))
}

export default function Page() {
  return <QADetailPage />
}
