import { relations } from "drizzle-orm"
import {
  index,
  integer,
  jsonb,
  pgSchema,
  text,
  timestamp,
} from "drizzle-orm/pg-core"
import { env } from "@/env"
import type { QuestionSecurityLevel } from "../../lib/question-security"

export const goongoom = pgSchema(env.DATABASE_SCHEMA)

export interface SocialLinks {
  instagram?: string
  facebook?: string
  github?: string
  twitter?: string
}

export const users = goongoom.table("users", {
  clerkId: text("clerk_id").primaryKey(),
  bio: text("bio"),
  socialLinks: jsonb("social_links").$type<SocialLinks>(),
  questionSecurityLevel: text("question_security_level")
    .$type<QuestionSecurityLevel>()
    .notNull()
    .default("anyone"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const questions = goongoom.table(
  "questions",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    recipientClerkId: text("recipient_clerk_id").notNull(),
    senderClerkId: text("sender_clerk_id"),
    content: text("content").notNull(),
    isAnonymous: integer("is_anonymous").notNull().default(1),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("questions_recipient_clerk_id_idx").on(table.recipientClerkId),
  ]
)

export const answers = goongoom.table(
  "answers",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    questionId: integer("question_id").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("answers_question_id_idx").on(table.questionId)]
)

// Temporary types until lib/audit/types.ts is created (Task 2)
type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }
type EntityType = "question" | "answer"

export const logs = goongoom.table(
  "logs",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    // Request metadata
    ipAddress: text("ip_address"),
    geoCity: text("geo_city"),
    geoCountry: text("geo_country"),
    geoCountryFlag: text("geo_country_flag"),
    geoRegion: text("geo_region"),
    geoEdgeRegion: text("geo_edge_region"),
    geoLatitude: text("geo_latitude"),
    geoLongitude: text("geo_longitude"),
    geoPostalCode: text("geo_postal_code"),
    userAgent: text("user_agent"),
    referer: text("referer"),
    acceptLanguage: text("accept_language"),
    // Action metadata
    userId: text("user_id"),
    action: text("action").notNull(),
    payload: jsonb("payload").$type<JsonValue | null>(),
    // Entity tracking (links to questions/answers)
    entityType: text("entity_type").$type<EntityType | null>(),
    entityId: integer("entity_id"),
    // Result
    success: integer("success").notNull(),
    errorMessage: text("error_message"),
    // Timestamps
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("logs_user_id_idx").on(table.userId),
    index("logs_created_at_idx").on(table.createdAt),
    index("logs_action_idx").on(table.action),
    index("logs_entity_type_idx").on(table.entityType),
    index("logs_entity_id_idx").on(table.entityId),
  ]
)

export const usersRelations = relations(users, ({ many }) => ({
  receivedQuestions: many(questions, { relationName: "recipient" }),
  sentQuestions: many(questions, { relationName: "sender" }),
}))

export const questionsRelations = relations(questions, ({ one, many }) => ({
  recipient: one(users, {
    fields: [questions.recipientClerkId],
    references: [users.clerkId],
    relationName: "recipient",
  }),
  sender: one(users, {
    fields: [questions.senderClerkId],
    references: [users.clerkId],
    relationName: "sender",
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
