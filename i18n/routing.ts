import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'zh'],
  defaultLocale: 'en',
  // English stays at the existing unprefixed URLs (SEO: nothing indexed moves);
  // only /zh gets a prefix
  localePrefix: 'as-needed',
  // no Accept-Language redirects — visitors switch languages explicitly
  localeDetection: false,
})
