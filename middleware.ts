import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Only the homepage is localized. /api, /register, /blog, /camps etc.
  // bypass the middleware entirely and keep their existing behavior.
  // '/en' is matched so it redirects to '/' (no duplicate content).
  matcher: ['/', '/en', '/zh', '/zh/:path*'],
}
