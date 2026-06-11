'use client'

import { useEffect } from 'react'

/* The root layout (shared with non-localized routes) hardcodes <html lang="en">;
   this corrects the attribute for /zh. hreflang tags carry the SEO signal. */
export default function SetHtmlLang({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])
  return null
}
