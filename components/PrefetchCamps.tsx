'use client'

import { useEffect } from 'react'

// Warms /api/camps (browser + CDN cache) while the visitor is on the homepage,
// so the register page's data fetch is instant when they click Register.
export default function PrefetchCamps() {
  useEffect(() => {
    const run = () => {
      fetch('/api/camps').catch(() => {})
    }
    const w = window as unknown as {
      requestIdleCallback?: (cb: () => void) => number
      cancelIdleCallback?: (id: number) => void
    }
    const id = w.requestIdleCallback ? w.requestIdleCallback(run) : setTimeout(run, 2000)
    return () => {
      if (w.cancelIdleCallback && w.requestIdleCallback) w.cancelIdleCallback(id as number)
      else clearTimeout(id as ReturnType<typeof setTimeout>)
    }
  }, [])
  return null
}
