"use server"

import { revalidateTag } from "next/cache"
import { CACHE_TAGS } from "./tags"

const CACHE_PROFILE = "default"

export async function invalidateAnswers() {
  await Promise.all([
    revalidateTag(CACHE_TAGS.answers, CACHE_PROFILE),
    revalidateTag(CACHE_TAGS.recentAnswers, CACHE_PROFILE),
  ])
}

export async function invalidateQuestions() {
  await Promise.resolve(revalidateTag(CACHE_TAGS.questions, CACHE_PROFILE))
}

export async function invalidateOgImage(questionId: string) {
  await Promise.resolve(
    revalidateTag(CACHE_TAGS.ogQuestion(questionId), CACHE_PROFILE)
  )
}
