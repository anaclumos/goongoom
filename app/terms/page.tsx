import type { Metadata } from "next"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { MainContent } from "@/components/layout/main-content"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("legal")
  return {
    title: t("termsTitle"),
    description: t("termsDescription"),
  }
}

export default async function TermsPage() {
  const t = await getTranslations("legal")

  return (
    <MainContent>
      <div className="space-y-8 py-4">
        <header className="space-y-2">
          <h1 className="font-bold text-3xl tracking-tight">
            {t("termsTitle")}
          </h1>
          <p className="text-muted-foreground text-sm">
            {t("effectiveDate", { date: "January 1, 2026" })}
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="font-semibold text-xl">
            {t("terms.acceptance.title")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("terms.acceptance.content")}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-semibold text-xl">
            {t("terms.eligibility.title")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("terms.eligibility.content")}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-semibold text-xl">{t("terms.account.title")}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("terms.account.content")}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-semibold text-xl">
            {t("terms.userContent.title")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("terms.userContent.content")}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-semibold text-xl">
            {t("terms.prohibited.title")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("terms.prohibited.content")}
          </p>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            <li>{t("terms.prohibited.items.harassment")}</li>
            <li>{t("terms.prohibited.items.spam")}</li>
            <li>{t("terms.prohibited.items.impersonation")}</li>
            <li>{t("terms.prohibited.items.illegal")}</li>
            <li>{t("terms.prohibited.items.malware")}</li>
            <li>{t("terms.prohibited.items.scraping")}</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-semibold text-xl">
            {t("terms.intellectualProperty.title")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("terms.intellectualProperty.content")}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-semibold text-xl">
            {t("terms.disclaimer.title")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("terms.disclaimer.content")}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-semibold text-xl">
            {t("terms.limitation.title")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("terms.limitation.content")}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-semibold text-xl">
            {t("terms.indemnification.title")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("terms.indemnification.content")}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-semibold text-xl">
            {t("terms.termination.title")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("terms.termination.content")}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-semibold text-xl">
            {t("terms.governing.title")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("terms.governing.content")}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-semibold text-xl">{t("terms.changes.title")}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("terms.changes.content")}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-semibold text-xl">{t("terms.contact.title")}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {t.rich("terms.contact.content", {
              link: (chunks) => (
                <Link
                  className="text-foreground underline underline-offset-4 hover:text-electric-blue"
                  href="/contact"
                >
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </section>
      </div>
    </MainContent>
  )
}
