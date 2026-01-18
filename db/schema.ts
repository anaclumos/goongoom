import { mysqlTable, varchar, text, timestamp, int } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  clerkId: varchar("clerk_id", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const questions = mysqlTable("questions", {
  id: int("id").primaryKey().autoincrement(),
  recipientId: varchar("recipient_id", { length: 255 }).notNull(),
  senderId: varchar("sender_id", { length: 255 }),
  content: text("content").notNull(),
  isAnonymous: int("is_anonymous").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const answers = mysqlTable("answers", {
  id: int("id").primaryKey().autoincrement(),
  questionId: int("question_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
