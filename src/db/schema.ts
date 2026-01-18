import { pgSchema, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const goongoom = pgSchema('goongoom')

export const users = goongoom.table('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  clerkId: text('clerk_id').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const questions = goongoom.table('questions', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  recipientId: text('recipient_id').notNull(),
  senderId: text('sender_id'),
  content: text('content').notNull(),
  isAnonymous: integer('is_anonymous').notNull().default(1),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const answers = goongoom.table('answers', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  questionId: integer('question_id').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  receivedQuestions: many(questions, { relationName: 'recipient' }),
  sentQuestions: many(questions, { relationName: 'sender' }),
}))

export const questionsRelations = relations(questions, ({ one, many }) => ({
  recipient: one(users, {
    fields: [questions.recipientId],
    references: [users.id],
    relationName: 'recipient',
  }),
  sender: one(users, {
    fields: [questions.senderId],
    references: [users.id],
    relationName: 'sender',
  }),
  answers: many(answers),
}))

export const answersRelations = relations(answers, ({ one }) => ({
  question: one(questions, {
    fields: [answers.questionId],
    references: [questions.id],
  }),
}))

export type User = typeof users.$inferSelect
export type Question = typeof questions.$inferSelect
export type Answer = typeof answers.$inferSelect
