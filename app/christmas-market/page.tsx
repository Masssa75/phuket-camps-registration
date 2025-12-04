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
    child_age: '',
    interest: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  // Capture UTM params from URL
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
          phone: formData.phone,
          child_name: formData.child_name || null,
          child_age: formData.child_age ? parseInt(formData.child_age) : null,
          interest: formData.interest || null,
          ...utmParams
        })

      if (insertError) {
        console.error('Insert error:', insertError)
        setError('Something went wrong. Please try again.')
        setSubmitting(false)
        return
      }

      setSubmitted(true)
    } catch (err) {
      console.error('Submission error:', err)
      setError('Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  const scheduleItems = [
    { time: '4:00 PM', event: 'Market Opens', icon: '🎄' },
    { time: '4:30 PM', event: 'Craft Workshops & Animal Care', icon: '🎨' },
    { time: '5:00 PM', event: 'Sound Healing for Children', icon: '🔔' },
    { time: '5:30 PM', event: 'Sound Healing for Adults', icon: '✨' },
    { time: '6:00 PM', event: 'Live Music Performance', icon: '🎵' },
    { time: '6:15 PM', event: "Children's Christmas Performance", icon: '🌟' },
    { time: '6:30 PM', event: 'Lucky Draw', icon: '🎁' },
  ]

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
      {/* Hero Section */}
      <div className="hero-section">
        <img
          src="/images/christmas-market/hero-illustration.jpg"
          alt="Bamboo Valley Christmas Market - Tropical market scene with families browsing stalls under palm trees"
          className="hero-image"
        />
        <div className="hero-overlay">
          <h1>Bamboo Valley</h1>
          <h2>Christmas Market</h2>
          <div className="hero-date">
            <span className="date-day">Friday, December 6</span>
            <span className="date-time">4 PM - 7 PM</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="content-wrapper">

        {/* Intro Section */}
        <section className="intro-section">
          <p>
            Discover handmade treasures, festive treats, and holiday magic at our first Christmas Market!
            Join us for an afternoon of music, activities, and community spirit in a warm tropical setting.
          </p>
        </section>

        {/* Raffle Entry Section */}
        <section className="raffle-section">
          <div className="raffle-header">
            <h2>Win a Free Trial Day!</h2>
            <p>Enter our raffle for a chance to win a free day at Bamboo Valley Camp (ages 2-9)</p>
          </div>

          <div className="prizes-display">
            <div className="prize-item grand">
              <span className="prize-icon">🏆</span>
              <span className="prize-text">1 FREE Week of Camp</span>
            </div>
            <div className="prize-item">
              <span className="prize-icon">🎁</span>
              <span className="prize-text">3× 50% Off Camp Week</span>
            </div>
            <div className="prize-item">
              <span className="prize-icon">⭐</span>
              <span className="prize-text">10× Free Trial Day</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="raffle-form">
            <div className="form-group">
              <label htmlFor="parent_name">Your Name *</label>
              <input
                type="text"
                id="parent_name"
                required
                value={formData.parent_name}
                onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                placeholder="Full name"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone/WhatsApp</label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+66..."
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="child_name">Child's Name</label>
                <input
                  type="text"
                  id="child_name"
                  value={formData.child_name}
                  onChange={(e) => setFormData({ ...formData, child_name: e.target.value })}
                  placeholder="Optional"
                />
              </div>

              <div className="form-group">
                <label htmlFor="child_age">Child's Age</label>
                <select
                  id="child_age"
                  value={formData.child_age}
                  onChange={(e) => setFormData({ ...formData, child_age: e.target.value })}
                >
                  <option value="">Select</option>
                  {[2, 3, 4, 5, 6, 7, 8, 9].map(age => (
                    <option key={age} value={age}>{age} years</option>
                  ))}
                </select>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="submit-button" disabled={submitting}>
              {submitting ? 'Entering...' : 'Enter Raffle'}
            </button>
          </form>
        </section>

        {/* Schedule Section */}
        <section className="schedule-section">
          <h2>Schedule</h2>
          <div className="schedule-list">
            {scheduleItems.map((item, index) => (
              <div key={index} className="schedule-item">
                <span className="schedule-icon">{item.icon}</span>
                <span className="schedule-time">{item.time}</span>
                <span className="schedule-event">{item.event}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Highlights Section */}
        <section className="highlights-section">
          <h2>What to Expect</h2>
          <div className="highlights-grid">
            <div className="highlight-card">
              <img src="/images/christmas-market/icon-wool.png" alt="" className="highlight-icon-img" />
              <h3>20+ Local Vendors</h3>
              <p>Handmade crafts, unique gifts, and artisan goods</p>
            </div>
            <div className="highlight-card">
              <img src="/images/christmas-market/icon-coffee.png" alt="" className="highlight-icon-img" />
              <h3>Festive Food & Drinks</h3>
              <p>Delicious treats with a tropical twist</p>
            </div>
            <div className="highlight-card">
              <img src="/images/christmas-market/icon-bowl.png" alt="" className="highlight-icon-img" />
              <h3>Sound Healing</h3>
              <p>Relaxing sessions for children and adults</p>
            </div>
            <div className="highlight-card">
              <img src="/images/christmas-market/icon-scissors.png" alt="" className="highlight-icon-img" />
              <h3>Kids Activities</h3>
              <p>Craft workshops and animal care</p>
            </div>
          </div>
        </section>

        {/* Vendors Section - Placeholder */}
        <section className="vendors-section">
          <h2>Our Vendors</h2>
          <p className="vendors-coming">Full vendor list coming soon!</p>
          {/* Vendor grid will go here */}
        </section>

        {/* Location Section */}
        <section className="location-section">
          <h2>Location</h2>
          <div className="location-details">
            <p className="location-name">Bamboo Valley Phuket</p>
            <p className="location-address">3/74 Moo 4, Cherngtalay, Thalang<br/>Phuket 83110, Thailand</p>
            <div className="location-buttons">
              <a
                href="https://maps.app.goo.gl/t1AdeUKvhAx5tJ2h7"
                target="_blank"
                rel="noopener noreferrer"
                className="location-button primary"
              >
                Open in Maps
              </a>
              <a
                href="https://wa.me/66989124218"
                target="_blank"
                rel="noopener noreferrer"
                className="location-button secondary"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="market-footer">
          <p>Bamboo Valley Phuket</p>
          <p>www.bamboovalleyphuket.com</p>
        </footer>
      </div>
    </div>
  )
}
