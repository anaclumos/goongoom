'use client'

import { useLocale } from 'next-intl'
import { MainContent } from '@/components/layout/main-content'
import PrivacyKo from '@/content/legal/privacy.ko.mdx'
import PrivacyEn from '@/content/legal/privacy.en.mdx'

export default function PrivacyPage() {
  const locale = useLocale()
  const Content = locale === 'ko' ? PrivacyKo : PrivacyEn

  return (
    <MainContent>
      <div className="py-4">
        <Content />
      </div>
    </MainContent>
  )
}
