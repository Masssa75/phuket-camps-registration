/**
 * Traffic Source Tracking Utility
 * Captures UTM parameters, referrer, and landing page on first visit
 * and persists them in sessionStorage for form submissions.
 */

export interface TrafficSource {
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  utm_term: string | null
  referrer: string | null
  landing_page: string | null
}

const STORAGE_KEY = 'bv_traffic_source'

/**
 * Captures traffic source data on first page load.
 * Should be called once when user first lands on the site.
 */
export function captureTrafficSource(): TrafficSource {
  // Check if we already captured (only capture on first visit in session)
  if (typeof window === 'undefined') {
    return getEmptyTrafficSource()
  }

  const stored = sessionStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      // Continue to capture fresh
    }
  }

  // Capture fresh traffic source data
  const params = new URLSearchParams(window.location.search)

  const trafficSource: TrafficSource = {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
    utm_content: params.get('utm_content'),
    utm_term: params.get('utm_term'),
    referrer: document.referrer || null,
    landing_page: window.location.pathname + window.location.search,
  }

  // Infer source from referrer if no UTM params
  if (!trafficSource.utm_source && trafficSource.referrer) {
    const inferredSource = inferSourceFromReferrer(trafficSource.referrer)
    if (inferredSource) {
      trafficSource.utm_source = inferredSource.source
      trafficSource.utm_medium = inferredSource.medium
    }
  }

  // Store for later form submissions
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(trafficSource))

  return trafficSource
}

/**
 * Gets stored traffic source data (doesn't capture new)
 */
export function getTrafficSource(): TrafficSource {
  if (typeof window === 'undefined') {
    return getEmptyTrafficSource()
  }

  const stored = sessionStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return getEmptyTrafficSource()
    }
  }

  // If not stored yet, capture now
  return captureTrafficSource()
}

function getEmptyTrafficSource(): TrafficSource {
  return {
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_content: null,
    utm_term: null,
    referrer: null,
    landing_page: null,
  }
}

/**
 * Infers traffic source from referrer URL
 */
function inferSourceFromReferrer(referrer: string): { source: string; medium: string } | null {
  try {
    const url = new URL(referrer)
    const hostname = url.hostname.toLowerCase()

    // Search engines
    if (hostname.includes('google.')) return { source: 'google', medium: 'organic' }
    if (hostname.includes('bing.')) return { source: 'bing', medium: 'organic' }
    if (hostname.includes('yahoo.')) return { source: 'yahoo', medium: 'organic' }
    if (hostname.includes('duckduckgo.')) return { source: 'duckduckgo', medium: 'organic' }
    if (hostname.includes('baidu.')) return { source: 'baidu', medium: 'organic' }
    if (hostname.includes('yandex.')) return { source: 'yandex', medium: 'organic' }

    // Social media
    if (hostname.includes('facebook.') || hostname.includes('fb.')) return { source: 'facebook', medium: 'social' }
    if (hostname.includes('instagram.') || hostname === 'l.instagram.com') return { source: 'instagram', medium: 'social' }
    if (hostname.includes('twitter.') || hostname.includes('t.co')) return { source: 'twitter', medium: 'social' }
    if (hostname.includes('linkedin.')) return { source: 'linkedin', medium: 'social' }
    if (hostname.includes('telegram.') || hostname.includes('t.me')) return { source: 'telegram', medium: 'social' }
    if (hostname.includes('whatsapp.')) return { source: 'whatsapp', medium: 'social' }
    if (hostname.includes('wechat.') || hostname.includes('weixin.')) return { source: 'wechat', medium: 'social' }
    if (hostname.includes('tiktok.')) return { source: 'tiktok', medium: 'social' }

    // AI referrals
    if (hostname.includes('chatgpt.') || hostname.includes('chat.openai.')) return { source: 'chatgpt', medium: 'ai' }
    if (hostname.includes('claude.ai')) return { source: 'claude', medium: 'ai' }
    if (hostname.includes('perplexity.')) return { source: 'perplexity', medium: 'ai' }

    // Email providers (indicates email marketing)
    if (hostname.includes('mail.google.') || hostname.includes('gmail.')) return { source: 'gmail', medium: 'email' }
    if (hostname.includes('outlook.') || hostname.includes('live.')) return { source: 'outlook', medium: 'email' }

    // Default: use hostname as source
    return { source: hostname.replace('www.', '').split('.')[0], medium: 'referral' }
  } catch {
    return null
  }
}
