'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Track custom events
export function trackEvent(eventName: string, params?: Record<string, string | number>) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, {
      event_category: 'engagement',
      page_path: window.location.pathname,
      ...params
    })
  }
}

// Hook to track scroll depth
export function useScrollTracking() {
  useEffect(() => {
    const thresholds = [25, 50, 75, 100]
    const tracked = new Set<number>()

    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      )

      thresholds.forEach(threshold => {
        if (scrollPercent >= threshold && !tracked.has(threshold)) {
          tracked.add(threshold)
          trackEvent(`scroll_depth_${threshold}`, { depth: threshold })
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
}

// Component to add click tracking to elements
export function TrackClick({
  children,
  eventName,
  params,
  className,
  style,
  href,
  target,
  rel
}: {
  children: React.ReactNode
  eventName: string
  params?: Record<string, string | number>
  className?: string
  style?: React.CSSProperties
  href?: string
  target?: string
  rel?: string
}) {
  const handleClick = () => {
    trackEvent(eventName, params)
  }

  if (href) {
    return (
      <a href={href} onClick={handleClick} className={className} style={style} target={target} rel={rel}>
        {children}
      </a>
    )
  }

  return (
    <div onClick={handleClick} className={className} style={style}>
      {children}
    </div>
  )
}

// Homepage tracking component
export function HomePageTracking() {
  useScrollTracking()

  useEffect(() => {
    // Track video play
    const video = document.querySelector('.hero-video video')
    if (video) {
      video.addEventListener('play', () => trackEvent('video_play', { video: 'hero' }))
    }

    // Track WhatsApp clicks
    document.querySelectorAll('a[href*="wa.me"]').forEach(el => {
      el.addEventListener('click', () => trackEvent('whatsapp_click', { page: 'home' }))
    })

    // Track register button clicks
    document.querySelectorAll('a[href*="/register"]').forEach(el => {
      el.addEventListener('click', (e) => {
        const href = (e.currentTarget as HTMLAnchorElement).href
        const camp = new URL(href).searchParams.get('camp') || 'unknown'
        trackEvent('register_click', { camp, page: 'home' })
      })
    })

    // Track blog link clicks
    document.querySelectorAll('a[href*="/blog"]').forEach(el => {
      el.addEventListener('click', () => trackEvent('blog_click', { page: 'home' }))
    })

    // Track program card clicks
    document.querySelectorAll('.program-card .cta-btn').forEach(el => {
      el.addEventListener('click', () => {
        const card = el.closest('.program-card')
        const program = card?.querySelector('h3')?.textContent || 'unknown'
        trackEvent('program_click', { program })
      })
    })

  }, [])

  return null
}

// Register page tracking component
export function RegisterPageTracking() {
  useScrollTracking()

  useEffect(() => {
    // Track form interactions
    const form = document.querySelector('form')
    if (form) {
      // Track form start (first input focus)
      let formStarted = false
      form.querySelectorAll('input, select, textarea').forEach(el => {
        el.addEventListener('focus', () => {
          if (!formStarted) {
            formStarted = true
            trackEvent('form_start', { form: 'registration' })
          }
        })
      })

      // Track form submission
      form.addEventListener('submit', () => {
        trackEvent('form_submit', { form: 'registration' })
      })
    }

    // Track WhatsApp clicks
    document.querySelectorAll('a[href*="wa.me"]').forEach(el => {
      el.addEventListener('click', () => trackEvent('whatsapp_click', { page: 'register' }))
    })

  }, [])

  return null
}

// Camps page tracking component
export function CampsPageTracking() {
  useScrollTracking()

  useEffect(() => {
    // Track camp card clicks
    document.querySelectorAll('[data-camp]').forEach(el => {
      el.addEventListener('click', () => {
        const camp = el.getAttribute('data-camp') || 'unknown'
        trackEvent('camp_click', { camp })
      })
    })

    // Track register button clicks
    document.querySelectorAll('a[href*="/register"]').forEach(el => {
      el.addEventListener('click', (e) => {
        const href = (e.currentTarget as HTMLAnchorElement).href
        const camp = new URL(href).searchParams.get('camp') || 'unknown'
        trackEvent('register_click', { camp, page: 'camps' })
      })
    })

    // Track WhatsApp clicks
    document.querySelectorAll('a[href*="wa.me"]').forEach(el => {
      el.addEventListener('click', () => trackEvent('whatsapp_click', { page: 'camps' }))
    })

  }, [])

  return null
}
