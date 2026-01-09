export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    })
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: {
  action: string
  category: string
  label: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Camp-specific tracking events
export const trackRegistrationClick = (campType: string) => {
  event({
    action: 'registration_click',
    category: 'Conversion',
    label: campType,
  })
}

export const trackWhatsAppClick = () => {
  event({
    action: 'whatsapp_click',
    category: 'Contact',
    label: 'WhatsApp Button',
  })
}

export const trackVideoComplete = () => {
  event({
    action: 'video_complete',
    category: 'Engagement',
    label: 'Hero Video',
  })
}

// Section visibility tracking
export const trackSectionView = (sectionName: string, page: string) => {
  event({
    action: 'section_view',
    category: 'Engagement',
    label: `${sectionName} | ${page}`,
  })
}

// Section engagement time tracking
export const trackSectionEngagement = (sectionName: string, page: string, timeSpent: number) => {
  event({
    action: 'section_engagement',
    category: 'Engagement',
    label: `${sectionName} | ${page}`,
    value: timeSpent,
  })
}

// Scroll depth tracking (enhanced)
export const trackScrollDepth = (depth: number, page: string) => {
  event({
    action: 'scroll_depth',
    category: 'Engagement',
    label: page,
    value: depth,
  })
}

// CTA click tracking with context
export const trackCTAClick = (buttonText: string, page: string, section: string) => {
  event({
    action: 'cta_click',
    category: 'Engagement',
    label: `${buttonText} | ${page} | ${section}`,
  })
}
