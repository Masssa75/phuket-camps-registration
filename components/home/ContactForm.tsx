'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

/* "Send a message" form in the Visit Us section.
   Posts to /api/contact → Supabase contact_messages + Telegram notification.
   Includes honeypot + form-timing bot protection (same scheme as the school site). */
export default function ContactForm() {
  const t = useTranslations('form')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('') // honeypot — humans never see this field
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [loadedAt] = useState(() => Date.now())

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'sending') return
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus('error')
      setErrorMsg(t('errFill'))
      return
    }
    setStatus('sending')
    setErrorMsg('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, website, formLoadedAt: loadedAt })
      })
      const result = await res.json()
      if (!res.ok) {
        setStatus('error')
        setErrorMsg(result.error || t('errGeneric'))
        return
      }
      setStatus('sent')
    } catch {
      setStatus('error')
      setErrorMsg(t('errNetwork'))
    }
  }

  if (status === 'sent') {
    return (
      <div className="cform">
        <h3 className="subh">{t('title')}</h3>
        <div className="csent">
          <p className="csent-head">{t('thanks', { name: name.trim() })}</p>
          <p>{t('thanksBody')}</p>
        </div>
      </div>
    )
  }

  return (
    <form className="cform" onSubmit={handleSubmit}>
      <h3 className="subh">{t('title')}</h3>
      <div className="field">
        <label htmlFor="cf-name">{t('name')}</label>
        <input id="cf-name" type="text" placeholder={t('namePh')} value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="cf-email">{t('email')}</label>
        <input id="cf-email" type="email" placeholder={t('emailPh')} value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="cf-message">{t('message')}</label>
        <textarea id="cf-message" placeholder={t('messagePh')} value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>
      {/* honeypot — hidden from humans, bots fill it in */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>
      {status === 'error' && <p className="cerr">{errorMsg}</p>}
      <button className="send" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? t('sending') : `${t('send')} →`}
      </button>
    </form>
  )
}
