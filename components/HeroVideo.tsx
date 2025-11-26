'use client'

import { useState } from 'react'

export default function HeroVideo() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  return (
    <div className="hero-video">
      {/* Poster image (first frame) - hides instantly when video starts */}
      <div
        className={`hero-video-poster ${isVideoPlaying ? 'hidden' : ''}`}
        style={{ backgroundImage: 'url(/images/video-poster.jpg)' }}
      />

      {/* Video - starts from frame 2, seamless continuation */}
      <video
        autoPlay
        muted
        loop
        playsInline
        onPlay={() => setIsVideoPlaying(true)}
        preload="metadata"
      >
        <source src="/videos/No text flyover.mp4" type="video/mp4" />
      </video>
    </div>
  )
}
