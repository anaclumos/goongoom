import { db } from '@/src/db'
import { users, questions, answers } from '@/src/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function createUser(data: {
  id: string
  username: string
  clerkId: string
}) {
  return await db.insert(users).values(data).returning()
}

export async function getUser(username: string) {
  return await db.query.users.findFirst({
    where: eq(users.username, username),
  })
}

export async function getUserById(id: string) {
  return await db.query.users.findFirst({
    where: eq(users.id, id),
  })
}

export async function createQuestion(data: {
  recipientId: string
  senderId?: string | null
  content: string
  isAnonymous: number
}) {
  return await db.insert(questions).values(data).returning()
}

export async function getQuestionsByRecipient(recipientId: string) {
  return await db.query.questions.findMany({
    where: eq(questions.recipientId, recipientId),
    orderBy: [desc(questions.createdAt)],
  })
}

export async function getQuestionById(id: number) {
  return await db.query.questions.findFirst({
    where: eq(questions.id, id),
  })
}

export async function createAnswer(data: {
  questionId: number
  content: string
}) {
  return await db.insert(answers).values(data).returning()
}

export async function getAnswersForQuestion(questionId: number) {
  return await db.query.answers.findMany({
    where: eq(answers.questionId, questionId),
    orderBy: [desc(answers.createdAt)],
  })
}

export async function getAllAnsweredQuestions(recipientId: string) {
  const allQuestions = await getQuestionsByRecipient(recipientId)
  
  const questionsWithAnswers = await Promise.all(
    allQuestions.map(async (question) => {
      const questionAnswers = await getAnswersForQuestion(question.id)
      return {
        ...question,
        answers: questionAnswers,
      }
    })
  )
  
  return questionsWithAnswers.filter(q => q.answers.length > 0)
}
