'use client'

import { useState, useEffect } from 'react'

export default function HeroVideo() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const videoSrc = isMobile
    ? '/videos/No text flyover.mp4'
    : '/videos/phuketcamp-background-hero-video.mp4'

  return (
    <div className="hero-video">
      {/* Poster image (first frame) - hides instantly when video starts */}
      <div
        className={`hero-video-poster ${isVideoPlaying ? 'hidden' : ''}`}
        style={{ backgroundImage: 'url(/images/video-poster.jpg)' }}
      />

      {/* Video - starts from frame 2, seamless continuation */}
      <video
        key={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        onPlay={() => setIsVideoPlaying(true)}
        preload="metadata"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    </div>
  )
}
