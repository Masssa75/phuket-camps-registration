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
    interest: '',
    preferred_dates: ''
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
      utm_medium: params.get('utm_medium') || 'qr',
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
          preferred_dates: formData.preferred_dates || null,
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

  if (submitted) {
    return (
      <div className="christmas-market-page">
        <div className="success-container">
          <div className="success-icon">🎄</div>
          <h1>You're In!</h1>
          <p>Thanks for entering our raffle. We'll announce winners at the end of the Christmas Market!</p>

          <div className="prize-reminder">
            <h3>Prize Reminder</h3>
            <ul>
              <li><strong>Grand Prize:</strong> 1 FREE week of camp</li>
              <li><strong>3 Runner-ups:</strong> 50% off camp week</li>
              <li><strong>10 Consolation:</strong> Free trial day</li>
            </ul>
          </div>

          <div className="next-steps">
            <p>While you're here, come visit our booth to:</p>
            <ul>
              <li>Learn about our nature-based programs</li>
              <li>Meet our teachers</li>
              <li>Ask any questions</li>
            </ul>
          </div>

          <a href="https://phuketcamp.com" className="back-link">
            Visit Our Website →
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="christmas-market-page">
      <div className="form-container">
        <div className="header">
          <div className="logo-area">
            <span className="tree-icon">🎄</span>
            <h1>Bamboo Valley</h1>
          </div>
          <h2>Christmas Market Raffle</h2>
          <p className="subtitle">December 6, 2025 • Win a FREE week of camp!</p>
        </div>

        <div className="prizes-banner">
          <div className="prize">
            <span className="prize-emoji">🏆</span>
            <span>1 FREE Week</span>
          </div>
          <div className="prize">
            <span className="prize-emoji">🎁</span>
            <span>50% Off (3x)</span>
          </div>
          <div className="prize">
            <span className="prize-emoji">⭐</span>
            <span>Trial Day (10x)</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
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
              <label htmlFor="phone">Phone/WhatsApp *</label>
              <input
                type="tel"
                id="phone"
                required
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
                <option value="">Select age</option>
                <option value="2">2 years</option>
                <option value="3">3 years</option>
                <option value="4">4 years</option>
                <option value="5">5 years</option>
                <option value="6">6 years</option>
                <option value="7">7 years</option>
                <option value="8">8 years</option>
                <option value="9">9 years</option>
                <option value="10">10+ years</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="interest">What interests you most?</label>
            <select
              id="interest"
              value={formData.interest}
              onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
            >
              <option value="">Select one</option>
              <option value="christmas_camp">Christmas Camp (Dec 15-26)</option>
              <option value="winter_camp">Winter Camp (Jan-Mar 2026)</option>
              <option value="school">Full-time School Enrollment</option>
              <option value="learning_more">Just Learning More</option>
            </select>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="submit-button"
            disabled={submitting}
          >
            {submitting ? 'Entering...' : 'Enter Raffle 🎄'}
          </button>

          <p className="privacy-note">
            We'll only contact you about raffle results and camp information.
          </p>
        </form>

        <div className="market-special">
          <h3>🎁 Christmas Market Special</h3>
          <p><strong>Today only:</strong> 12,000 THB/week (regular: 14,000)</p>
          <p>Ask at our booth to secure your spot!</p>
        </div>
      </div>
    </div>
  )
}
