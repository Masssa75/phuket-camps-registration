'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function MarketVendorPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    products: '',
    markets: [] as string[]
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleMarketChange = (market: string) => {
    setFormData(prev => ({
      ...prev,
      markets: prev.markets.includes(market)
        ? prev.markets.filter(m => m !== market)
        : [...prev.markets, market]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    try {
      const response = await fetch('/api/vendor-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Registration failed')
      }

      setStatus('success')
      setFormData({ name: '', email: '', phone: '', products: '', markets: [] })
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong')
    }
  }

  if (status === 'success') {
    return (
      <div style={{minHeight: '100vh', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'}}>
        <div style={{background: 'white', borderRadius: '16px', padding: '40px', maxWidth: '500px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}}>
          <div style={{fontSize: '4rem', marginBottom: '20px'}}>🎉</div>
          <h2 style={{color: '#333', marginBottom: '15px'}}>Thank You!</h2>
          <p style={{color: '#666', marginBottom: '30px'}}>We've received your registration. We'll be in touch soon with more details about the market.</p>
          <Link href="/" style={{color: '#7a9a3b', textDecoration: 'none', fontWeight: 600}}>← Back to Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{minHeight: '100vh', background: '#f8f9fa'}}>
      <section style={{padding: '40px 20px 60px', backgroundImage: 'url(/backgrounds/5F1B0766-367A-4892-8D9E-D9006FBB64EB.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', minHeight: '100vh'}}>
        <div style={{position: 'absolute', inset: 0, background: 'rgba(255, 255, 255, 0.9)'}}></div>
        <div style={{position: 'relative', zIndex: 1, maxWidth: '500px', margin: '0 auto'}}>
          {/* Logo */}
          <div style={{display: 'flex', justifyContent: 'center', marginBottom: '30px'}}>
            <Link href="/">
              <img src="/Logo with text.png" alt="Bamboo Valley Phuket" style={{height: '150px'}} />
            </Link>
          </div>

          <h1 style={{fontSize: '2rem', fontWeight: 800, textAlign: 'center', color: '#333', marginBottom: '10px'}}>Market Vendor Registration</h1>
          <p style={{textAlign: 'center', color: '#666', fontSize: '1rem', marginBottom: '30px'}}>
            Register your interest to sell at our school markets
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{background: 'white', borderRadius: '16px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}}>
            {/* Name */}
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', color: '#333', fontWeight: 600, marginBottom: '8px'}}>Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                style={{width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box'}}
                placeholder="Your name or business name"
              />
            </div>

            {/* Email */}
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', color: '#333', fontWeight: 600, marginBottom: '8px'}}>Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                style={{width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box'}}
                placeholder="your@email.com"
              />
            </div>

            {/* Phone */}
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', color: '#333', fontWeight: 600, marginBottom: '8px'}}>Phone *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                style={{width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box'}}
                placeholder="+66..."
              />
            </div>

            {/* Products */}
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', color: '#333', fontWeight: 600, marginBottom: '8px'}}>What do you sell? *</label>
              <textarea
                required
                value={formData.products}
                onChange={e => setFormData(prev => ({ ...prev, products: e.target.value }))}
                style={{width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical'}}
                placeholder="e.g. Handmade jewelry, organic soaps, baked goods..."
              />
            </div>

            {/* Markets */}
            <div style={{marginBottom: '25px'}}>
              <label style={{display: 'block', color: '#333', fontWeight: 600, marginBottom: '12px'}}>Which markets are you interested in?</label>
              <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <label style={{display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer'}}>
                  <input
                    type="checkbox"
                    checked={formData.markets.includes('christmas-2025')}
                    onChange={() => handleMarketChange('christmas-2025')}
                    style={{width: '20px', height: '20px', accentColor: '#7a9a3b'}}
                  />
                  <span style={{color: '#555'}}>🎄 Christmas Market - Saturday, December 6, 2025</span>
                </label>
                <label style={{display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer'}}>
                  <input
                    type="checkbox"
                    checked={formData.markets.includes('easter-2026')}
                    onChange={() => handleMarketChange('easter-2026')}
                    style={{width: '20px', height: '20px', accentColor: '#7a9a3b'}}
                  />
                  <span style={{color: '#555'}}>🐰 Easter Market - Saturday, March 28, 2026</span>
                </label>
              </div>
            </div>

            {/* Error message */}
            {status === 'error' && (
              <div style={{background: '#fee', border: '1px solid #fcc', borderRadius: '8px', padding: '12px', marginBottom: '20px', color: '#c00'}}>
                {errorMessage}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'submitting'}
              style={{
                width: '100%',
                padding: '14px',
                background: status === 'submitting' ? '#aaa' : '#7a9a3b',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                fontSize: '1.1rem',
                fontWeight: 600,
                cursor: status === 'submitting' ? 'not-allowed' : 'pointer'
              }}
            >
              {status === 'submitting' ? 'Submitting...' : 'Register Interest'}
            </button>
          </form>

          {/* Back link */}
          <div style={{textAlign: 'center', marginTop: '30px'}}>
            <Link href="/" style={{color: '#7a9a3b', textDecoration: 'none', fontWeight: 600}}>← Back to Home</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
