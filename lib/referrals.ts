export type ReferralMetadata = {
  referrerUsername?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
}

const REFERRAL_COOKIE_KEY = 'referral'

export function readReferralCookie(): ReferralMetadata | undefined {
  if (typeof document === 'undefined') return undefined

  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${REFERRAL_COOKIE_KEY}=([^;]*)`))
  if (!match?.[1]) return undefined

  try {
    const data = JSON.parse(decodeURIComponent(match[1])) as Record<string, unknown>

    const metadata: ReferralMetadata = {}
    if (typeof data.u === 'string' && data.u) metadata.referrerUsername = data.u
    if (typeof data.s === 'string' && data.s) metadata.utmSource = data.s
    if (typeof data.m === 'string' && data.m) metadata.utmMedium = data.m
    if (typeof data.c === 'string' && data.c) metadata.utmCampaign = data.c
    if (typeof data.t === 'string' && data.t) metadata.utmTerm = data.t
    if (typeof data.n === 'string' && data.n) metadata.utmContent = data.n

    return Object.keys(metadata).length ? metadata : undefined
  } catch {
    return undefined
  }
}
