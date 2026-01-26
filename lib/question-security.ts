export const QUESTION_SECURITY_LEVELS = ['anyone', 'verified_anonymous', 'public_only'] as const

export type QuestionSecurityLevel = (typeof QUESTION_SECURITY_LEVELS)[number]

export const DEFAULT_QUESTION_SECURITY_LEVEL: QuestionSecurityLevel = 'anyone'
