"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import { CACHE_TAGS } from "./tags"

const CACHE_PROFILE = "default"

export async function invalidateClerkUser(userId: string) {
  await Promise.resolve(
    revalidateTag(CACHE_TAGS.clerkUser(userId), CACHE_PROFILE)
  )
}

export async function invalidateAllClerkUsers() {
  await Promise.resolve(revalidateTag(CACHE_TAGS.clerkUsers, CACHE_PROFILE))
}

export async function invalidateAnswers() {
  await Promise.all([
    revalidateTag(CACHE_TAGS.answers, CACHE_PROFILE),
    revalidateTag(CACHE_TAGS.recentAnswers, CACHE_PROFILE),
  ])
}

export async function invalidateQuestions() {
  await Promise.resolve(revalidateTag(CACHE_TAGS.questions, CACHE_PROFILE))
}

export async function invalidateUserCount() {
  await Promise.resolve(revalidateTag(CACHE_TAGS.userCount, CACHE_PROFILE))
}

export async function invalidateUserPage(username: string) {
  await Promise.resolve(revalidatePath(`/${username}`))
}

export async function invalidateHomePage() {
  await Promise.resolve(revalidatePath("/"))
}

export async function invalidateOgImage(questionId: string) {
  await Promise.resolve(
    revalidateTag(CACHE_TAGS.ogQuestion(questionId), CACHE_PROFILE)
  )
}
