'use client'

import { useEffect, useState } from 'react'

const IMAGES = Array.from(
  { length: 12 },
  (_, i) => `/images/redesign/gallery-${String(i + 1).padStart(2, '0')}.jpg`
)

/* Masonry photo grid with a click-to-expand lightbox (‹ › navigation, Esc to close) */
export default function PhotoGallery({ alt = 'Camp life at Bamboo Valley' }: { alt?: string }) {
  const [idx, setIdx] = useState<number | null>(null)

  const step = (d: number) =>
    setIdx((prev) => (prev === null ? prev : (prev + d + IMAGES.length) % IMAGES.length))

  useEffect(() => {
    if (idx === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIdx(null)
      else if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [idx])

  return (
    <>
      <div className="galmasonry">
        {IMAGES.map((src, i) => (
          <img key={src} src={src} alt={alt} loading="lazy" decoding="async" onClick={() => setIdx(i)} />
        ))}
      </div>
      {idx !== null && (
        <div
          className="lightbox"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIdx(null)
          }}
        >
          <button className="lb-btn lb-close" aria-label="Close" onClick={() => setIdx(null)}>×</button>
          <button
            className="lb-btn lb-nav lb-prev"
            aria-label="Previous"
            onClick={(e) => { e.stopPropagation(); step(-1) }}
          >‹</button>
          <img src={IMAGES[idx]} alt={alt} />
          <button
            className="lb-btn lb-nav lb-next"
            aria-label="Next"
            onClick={(e) => { e.stopPropagation(); step(1) }}
          >›</button>
        </div>
      )}
    </>
  )
}
