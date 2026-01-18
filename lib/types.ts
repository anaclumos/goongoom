import type { Question as DBQuestion, Answer as DBAnswer, User as DBUser } from '@/src/db/schema'

export type Question = DBQuestion & {
  answers?: Answer[]
}

export type Answer = DBAnswer

export type User = DBUser

export type QuestionWithAnswers = Question & {
  answers: Answer[]
}

export type APIResponse<T> = {
  data?: T
  error?: string
}

export type CreateQuestionRequest = {
  recipientUsername: string
  content: string
  isAnonymous: boolean
}

export type CreateAnswerRequest = {
  questionId: number
  content: string
}
