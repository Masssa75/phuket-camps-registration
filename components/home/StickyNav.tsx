'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

/* Slim top bar that slides in once the hero is scrolled past.
   Keeps Register reachable from anywhere on the page. */
export default function StickyNav() {
  const [show, setShow] = useState(false)
  const t = useTranslations('nav')
  const locale = useLocale()

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
      <a className="snbrand" href="#top">{t('brand')}</a>
      <div className="snlinks">
        <a href="#programs">{t('programs')}</a>
        <a href="#activities">{t('activities')}</a>
        <a href="#day">{t('day')}</a>
        <a href="#camps">{t('dates')}</a>
      </div>
      {locale === 'en'
        ? <Link className="snlang" href="/zh" lang="zh">中文</Link>
        : <Link className="snlang" href="/" lang="en">English</Link>}
      <a className="snbtn" href="#camps">{t('register')} →</a>
    </nav>
  )
}
