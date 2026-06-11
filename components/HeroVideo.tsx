'use client'

import { useEffect, useRef, useState } from 'react'

/* Full-viewport fixed background video with an instant poster.
   The poster IS frame 1 of the video, so hiding it is a hard cut, not a fade.
   Content sections (z-index 2, opaque backgrounds) scroll up over the video. */
export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    // Some mobile browsers block autoplay until a user gesture
    const tryPlay = () => {
      const p = v.play()
      if (p && p.catch) p.catch(() => {})
    }
    tryPlay()
    document.addEventListener('click', tryPlay, { once: true })
    document.addEventListener('touchstart', tryPlay, { once: true })
    return () => {
      document.removeEventListener('click', tryPlay)
      document.removeEventListener('touchstart', tryPlay)
    }
  }, [])

  return (
    <>
      <video
        ref={videoRef}
        className="video-bg"
        poster="/images/hero-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onPlaying={() => setIsPlaying(true)}
        onTimeUpdate={(e) => {
          if (e.currentTarget.currentTime > 0) setIsPlaying(true)
        }}
      >
        <source src="/videos/phuket-nature-camp.mp4?v=4" type="video/mp4" />
      </video>
      <div className={`hero-poster${isPlaying ? ' hidden' : ''}`} />
    </>
  )
}
