export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
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
