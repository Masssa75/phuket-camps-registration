'use client'

import { useState } from 'react'

export default function HeroVideo() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  return (
    <div className="hero-video">
      {/* Poster image that fades out when video loads */}
      <div
        className={`hero-video-poster ${isVideoLoaded ? 'hidden' : ''}`}
        style={{ backgroundImage: 'url(/images/video-poster.png)' }}
      />

      {/* Video that fades in when loaded */}
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
