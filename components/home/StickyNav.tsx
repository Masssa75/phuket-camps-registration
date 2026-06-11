'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

/* Page chrome:
   - fixed top-right cluster: language switcher + hamburger (white over the
     hero video, dark once the sticky bar appears)
   - slim sticky bar (brand + Register) that slides in past the hero
   - full-screen menu opened by the hamburger */
export default function StickyNav() {
  const [show, setShow] = useState(false)
  const [open, setOpen] = useState(false)
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

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <>
      <nav className={`stickynav${show ? ' show' : ''}`}>
        <a className="snbrand" href="#top">{t('brand')}</a>
        <a className="snbtn" href="#camps">{t('register')} →</a>
      </nav>

      <div className={`topctl${show ? ' dark' : ''}`}>
        {locale === 'en'
          ? <Link className="tlang" href="/zh" lang="zh">中文</Link>
          : <Link className="tlang" href="/" lang="en">English</Link>}
        <button
          className="tburger"
          aria-label={t('menuAria')}
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <span /><span /><span />
        </button>
      </div>

      <div className={`sitemenu${open ? ' open' : ''}`}>
        <button className="mclose" aria-label={t('closeAria')} onClick={close}>×</button>
        <a href="#programs" onClick={close}>{t('programs')}</a>
        <a href="#activities" onClick={close}>{t('activities')}</a>
        <a href="#day" onClick={close}>{t('day')}</a>
        <a href="#camps" onClick={close}>{t('camps')}</a>
        <a href="#visit" onClick={close}>{t('visit')}</a>
        <a className="mreg" href="#camps" onClick={close}>{t('register')} →</a>
      </div>
    </>
  )
}
