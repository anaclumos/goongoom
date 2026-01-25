'use client'

import { useLocale } from 'next-intl'
import { MainContent } from '@/components/layout/main-content'
import ContactKo from '@/content/legal/contact.ko.mdx'
import ContactEn from '@/content/legal/contact.en.mdx'

export default function ContactPage() {
  const locale = useLocale()
  const Content = locale === 'ko' ? ContactKo : ContactEn

  return (
    <MainContent>
      <div className="py-4">
        <Content />
      </div>
    </MainContent>
  )
}
