'use client'

import { useState, useEffect } from 'react'

export default function HeroVideo() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [hidePoster, setHidePoster] = useState(false)

  useEffect(() => {
    if (isVideoLoaded) {
      // Wait for video fade-in to complete before hiding poster
      const timer = setTimeout(() => setHidePoster(true), 1200)
      return () => clearTimeout(timer)
    }
  }, [isVideoLoaded])

  return (
    <div className="hero-video">
      {/* Poster image - stays visible until video fully faded in */}
      <div
        className={`hero-video-poster ${hidePoster ? 'hidden' : ''}`}
        style={{ backgroundImage: 'url(/images/video-poster.jpg)' }}
      />

      {/* Video that fades in on top */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className={isVideoLoaded ? 'loaded' : ''}
        onLoadedData={() => setIsVideoLoaded(true)}
        preload="metadata"
      >
        <source src="/videos/No text flyover.mp4" type="video/mp4" />
      </video>
    </div>
  )
}
