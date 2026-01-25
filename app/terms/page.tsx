'use client'

import { useLocale } from 'next-intl'
import { MainContent } from '@/components/layout/main-content'
import TermsKo from '@/content/legal/terms.ko.mdx'
import TermsEn from '@/content/legal/terms.en.mdx'

export default function TermsPage() {
  const locale = useLocale()
  const Content = locale === 'ko' ? TermsKo : TermsEn

  return (
    <MainContent>
      <div className="py-4">
        <Content />
      </div>
    </MainContent>
  )
}
