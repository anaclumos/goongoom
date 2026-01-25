export type {
  Answer,
  AnswerId,
  Doc,
  Id,
  Log,
  LogId,
  PushSubscription,
  PushSubscriptionId,
  QAItem,
  Question,
  QuestionId,
  QuestionWithAnswer,
  SocialLinkEntry,
  SocialLinks,
  User,
  UserId,
} from '@/convex/types'

export type { QuestionSecurityLevel } from '@/lib/question-security'

export interface UserProfile {
  clerkId: string
  username: string | null
  firstName: string | null
  fullName: string | null
  avatarUrl: string | null
  bio: string | null
  socialLinks: import('@/convex/types').SocialLinks | null
  questionSecurityLevel: import('@/lib/question-security').QuestionSecurityLevel
}

export interface APIResponse<T> {
  data?: T
  error?: string
}

export interface CreateQuestionRequest {
  recipientClerkId: string
  content: string
  isAnonymous: boolean
}

export interface CreateAnswerRequest {
  questionId: string
  content: string
}
