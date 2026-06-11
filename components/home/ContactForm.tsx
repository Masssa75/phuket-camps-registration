'use client'

import { useState } from 'react'

/* "Send a message" form in the Visit Us section.
   Posts to /api/contact → Supabase contact_messages + Telegram notification.
   Includes honeypot + form-timing bot protection (same scheme as the school site). */
export default function ContactForm() {
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
      setErrorMsg('Please fill in your name, email, and message.')
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
        setErrorMsg(result.error || 'Something went wrong — please try again.')
        return
      }
      setStatus('sent')
    } catch {
      setStatus('error')
      setErrorMsg('Could not send your message — please check your connection and try again.')
    }
  }

  if (status === 'sent') {
    return (
      <div className="cform">
        <h3 className="subh">Send a message</h3>
        <div className="csent">
          <p className="csent-head">Thank you, {name.trim()}!</p>
          <p>Your message is on its way — we usually reply within a day. If it is urgent, WhatsApp is the fastest way to reach us.</p>
        </div>
      </div>
    )
  }

  return (
    <form className="cform" onSubmit={handleSubmit}>
      <h3 className="subh">Send a message</h3>
      <div className="field">
        <label htmlFor="cf-name">Name</label>
        <input id="cf-name" type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="cf-email">Email</label>
        <input id="cf-email" type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="cf-message">Message</label>
        <textarea id="cf-message" placeholder="How can we help?" value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>
      {/* honeypot — hidden from humans, bots fill it in */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>
      {status === 'error' && <p className="cerr">{errorMsg}</p>}
      <button className="send" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send message →'}
      </button>
    </form>
  )
}
