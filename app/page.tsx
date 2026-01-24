import { getTranslations } from "next-intl/server"
import { LandingCTA } from "@/components/landing/landing-cta"
import { LandingFeatures } from "@/components/landing/landing-features"
import { LandingFooter } from "@/components/landing/landing-footer"
import { LandingHero } from "@/components/landing/landing-hero"
import { getUserCount } from "@/lib/db/queries"

export default async function Home() {
  return <LandingPage />
}

async function LandingPage() {
  const [t, tNav, tFooter, tLegal, tShare, userCount] = await Promise.all([
    getTranslations("home"),
    getTranslations("nav"),
    getTranslations("footer"),
    getTranslations("legal"),
    getTranslations("share"),
    getUserCount(),
  ])

  return (
    <div className="flex-1">
      <LandingHero t={t} />
      <LandingFeatures t={t} tShare={tShare} />
      <LandingCTA t={t} userCount={userCount} />
      <LandingFooter tFooter={tFooter} tLegal={tLegal} tNav={tNav} />
    </div>
  )
}
