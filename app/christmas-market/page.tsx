'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import './christmas-market.css'

export default function ChristmasMarketPage() {
  const [formData, setFormData] = useState({
    parent_name: '',
    email: '',
    phone: '',
    child_name: '',
    child_age: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const [utmParams, setUtmParams] = useState({
    utm_source: '',
    utm_medium: '',
    utm_campaign: ''
  })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setUtmParams({
      utm_source: params.get('utm_source') || 'christmas_market',
      utm_medium: params.get('utm_medium') || 'direct',
      utm_campaign: params.get('utm_campaign') || 'dec2025'
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const supabase = createClient()
      const { error: insertError } = await supabase
        .from('christmas_market_leads')
        .insert({
          parent_name: formData.parent_name,
          email: formData.email,
          phone: formData.phone || null,
          child_name: formData.child_name || null,
          child_age: formData.child_age ? parseInt(formData.child_age) : null,
          ...utmParams
        })

      if (insertError) {
        setError('Something went wrong. Please try again.')
        setSubmitting(false)
        return
      }
      setSubmitted(true)
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="christmas-market-page">
        <div className="success-container">
          <div className="success-icon">🎄</div>
          <h1>You're Entered!</h1>
          <p>Thanks for entering our raffle. Winners will be announced at the Lucky Draw at 6:30 PM!</p>
          <div className="success-details">
            <h3>See You Friday!</h3>
            <p><strong>December 6, 2025</strong></p>
            <p>4:00 PM - 7:00 PM</p>
            <p>Bamboo Valley Phuket</p>
          </div>
          <a
            href="https://maps.app.goo.gl/t1AdeUKvhAx5tJ2h7"
            target="_blank"
            rel="noopener noreferrer"
            className="directions-button"
          >
            Get Directions →
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="christmas-market-page">
      {/* Hero Section - Full Impact */}
      <section className="hero">
        <div className="hero-image-container">
          <img
            src="/images/christmas-market/hero-illustration.jpg"
            alt="Bamboo Valley Christmas Market"
            className="hero-img"
          />
          <div className="hero-gradient"></div>
        </div>
        <div className="hero-content">
          <h1>Christmas Market</h1>
          <p className="hero-subtitle">at Bamboo Valley Phuket</p>
          <div className="hero-date-badge">
            <span className="hero-day">Friday, Dec 6</span>
            <span className="hero-time">4 PM - 7 PM</span>
          </div>
        </div>
      </section>

      {/* Quick Highlights - Hook them fast */}
      <section className="highlights">
        <div className="highlight-strip">
          <div className="highlight-item">
            <img src="/images/christmas-market/icon-wool.png" alt="" />
            <span>20+ Vendors</span>
          </div>
          <div className="highlight-item">
            <img src="/images/christmas-market/icon-coffee.png" alt="" />
            <span>Food & Drinks</span>
          </div>
          <div className="highlight-item">
            <img src="/images/christmas-market/icon-bowl.png" alt="" />
            <span>Sound Healing</span>
          </div>
          <div className="highlight-item">
            <img src="/images/christmas-market/icon-scissors.png" alt="" />
            <span>Kids Crafts</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="content">
        {/* Intro text */}
        <p className="intro-text">
          Join us for an afternoon of handmade treasures, festive treats, live music,
          and holiday magic under the palm trees.
        </p>

        {/* Schedule - Visual Timeline */}
        <section className="schedule-card">
          <h2>Schedule</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="time">4:00</div>
              <div className="event">Market Opens</div>
            </div>
            <div className="timeline-item">
              <div className="time">4:30</div>
              <div className="event">Craft Workshops & Animal Care</div>
            </div>
            <div className="timeline-item highlight">
              <div className="time">5:00</div>
              <div className="event">Sound Healing for Children</div>
            </div>
            <div className="timeline-item highlight">
              <div className="time">5:30</div>
              <div className="event">Sound Healing for Adults</div>
            </div>
            <div className="timeline-item">
              <div className="time">6:00</div>
              <div className="event">Live Music Performance</div>
            </div>
            <div className="timeline-item">
              <div className="time">6:15</div>
              <div className="event">Children's Christmas Show</div>
            </div>
            <div className="timeline-item featured">
              <div className="time">6:30</div>
              <div className="event">Lucky Draw 🎁</div>
            </div>
          </div>
        </section>

        {/* Raffle Section */}
        <section className="raffle-card">
          <div className="raffle-badge">FREE ENTRY</div>
          <h2>Win Amazing Prizes!</h2>
          <p className="raffle-subtitle">Enter our lucky draw for a chance to win:</p>

          <div className="prizes">
            <div className="prize grand">
              <span className="prize-label">Grand Prize</span>
              <span className="prize-value">1 FREE Week of Camp</span>
            </div>
            <div className="prize">
              <span className="prize-value">3× 50% Off Camp Week</span>
            </div>
            <div className="prize">
              <span className="prize-value">10× Free Trial Day</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="raffle-form">
            <input
              type="text"
              required
              value={formData.parent_name}
              onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
              placeholder="Your name"
            />
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Email address"
            />
            <div className="form-row">
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Phone (optional)"
              />
              <select
                value={formData.child_age}
                onChange={(e) => setFormData({ ...formData, child_age: e.target.value })}
              >
                <option value="">Child's age</option>
                {[2, 3, 4, 5, 6, 7, 8, 9].map(age => (
                  <option key={age} value={age}>{age} years</option>
                ))}
              </select>
            </div>
            {error && <div className="error">{error}</div>}
            <button type="submit" disabled={submitting}>
              {submitting ? 'Entering...' : 'Enter Lucky Draw'}
            </button>
          </form>
        </section>

        {/* Location */}
        <section className="location-card">
          <h2>Location</h2>
          <p className="location-name">Bamboo Valley Phuket</p>
          <p className="location-address">3/74 Moo 4, Cherngtalay, Thalang</p>
          <div className="location-buttons">
            <a href="https://maps.app.goo.gl/t1AdeUKvhAx5tJ2h7" target="_blank" rel="noopener noreferrer" className="btn-primary">
              Open in Maps
            </a>
            <a href="https://wa.me/66989124218" target="_blank" rel="noopener noreferrer" className="btn-secondary">
              WhatsApp
            </a>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>Bamboo Valley Phuket • bamboovalleyphuket.com</p>
      </footer>
    </div>
  )
}
