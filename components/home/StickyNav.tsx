'use client'

import { useEffect, useState } from 'react'

/* Slim top bar that slides in once the hero is scrolled past.
   Keeps Register reachable from anywhere on the page. */
export default function StickyNav() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('top')
    if (!hero) return
    const observer = new IntersectionObserver(
      (entries) => setShow(entries[0].intersectionRatio < 0.08),
      { threshold: [0, 0.08, 0.25] }
    )
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  return (
    <nav className={`stickynav${show ? ' show' : ''}`}>
      <a className="snbrand" href="#top">Phuket Nature Camp</a>
      <div className="snlinks">
        <a href="#programs">Programs</a>
        <a href="#activities">Activities</a>
        <a href="#day">A day at camp</a>
        <a href="#camps">Dates</a>
      </div>
      <a className="snbtn" href="#camps">Register →</a>
    </nav>
  )
}
