'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './toddler.module.css'
import { trackEvent, useScrollTracking } from '@/components/Analytics'

interface Session {
  id: string
  session_date: string
  session_time: string
  capacity: number
  current_bookings: number
  status: string
}

interface Child {
  id: string
  name: string
  dateOfBirth: string
  gender: string
  nationality: string
}

export default function ToddlerRegistrationPage() {
  // Sessions from API
  const [sessions, setSessions] = useState<Session[]>([])
  const [loadingSessions, setLoadingSessions] = useState(true)

  // Form state
  const [parentName, setParentName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [isReturning, setIsReturning] = useState(false)
  const [howDidYouFind, setHowDidYouFind] = useState('')
  const [packageType, setPackageType] = useState<'single' | 'bundle' | 'already_paid'>('single')
  const [selectedSessions, setSelectedSessions] = useState<string[]>([])
  const [photoPermission, setPhotoPermission] = useState(false)
  const [termsAcknowledged, setTermsAcknowledged] = useState(false)

  // Children
  const [children, setChildren] = useState<Child[]>([{
    id: '1',
    name: '',
    dateOfBirth: '',
    gender: '',
    nationality: ''
  }])

  // Submission state
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  // Returning family lookup
  const [lookupEmail, setLookupEmail] = useState('')
  const [lookingUp, setLookingUp] = useState(false)
  const [foundChildren, setFoundChildren] = useState<Child[]>([])
  const [selectedChildIds, setSelectedChildIds] = useState<string[]>([])
  const [lookupDone, setLookupDone] = useState(false)
  const [sessionsRemaining, setSessionsRemaining] = useState(0)
  const [alreadyBookedSessions, setAlreadyBookedSessions] = useState<string[]>([])
  const [registrationId, setRegistrationId] = useState<string>('')

  // Track scroll depth
  useScrollTracking()

  // Track page view on mount
  useEffect(() => {
    trackEvent('page_view', { page: 'register_toddler' })
  }, [])

  // Fetch sessions on mount
  useEffect(() => {
    async function fetchSessions() {
      try {
        const res = await fetch('/api/toddler/sessions')
        const data = await res.json()
        if (data.sessions) {
          setSessions(data.sessions)
        }
      } catch (err) {
        console.error('Failed to fetch sessions:', err)
      } finally {
        setLoadingSessions(false)
      }
    }
    fetchSessions()
  }, [])

  // Add a child
  const addChild = () => {
    setChildren([...children, {
      id: String(Date.now()),
      name: '',
      dateOfBirth: '',
      gender: '',
      nationality: ''
    }])
  }

  // Remove a child
  const removeChild = (id: string) => {
    if (children.length > 1) {
      setChildren(children.filter(c => c.id !== id))
    }
  }

  // Update child field
  const updateChild = (id: string, field: keyof Child, value: string) => {
    setChildren(children.map(c =>
      c.id === id ? { ...c, [field]: value } : c
    ))
  }

  // Toggle session selection
  const toggleSession = (sessionId: string) => {
    if (selectedSessions.includes(sessionId)) {
      setSelectedSessions(selectedSessions.filter(id => id !== sessionId))
    } else {
      setSelectedSessions([...selectedSessions, sessionId])
    }
  }

  // Look up returning family by email
  const handleLookup = async () => {
    if (!lookupEmail) return
    setLookingUp(true)
    setError('')

    try {
      const res = await fetch(`/api/toddler/lookup?email=${encodeURIComponent(lookupEmail)}`)
      const data = await res.json()

      if (data.found) {
        // Map children with IDs for selection
        const childrenWithIds = data.children.map((c: { id: string; name: string; dateOfBirth: string; gender: string; nationality: string }) => ({
          id: c.id,
          name: c.name,
          dateOfBirth: c.dateOfBirth,
          gender: c.gender,
          nationality: c.nationality || ''
        }))
        setFoundChildren(childrenWithIds)
        setSelectedChildIds(childrenWithIds.map((c: Child) => c.id)) // Select all by default
        setSessionsRemaining(data.registration.sessionsRemaining || 0)
        setEmail(data.registration.email)
        setParentName(data.registration.parentName)
        setPhone(data.registration.phone)
        setRegistrationId(data.registration.id)
        // Set already booked sessions and pre-select them
        const booked = data.bookedSessionIds || []
        setAlreadyBookedSessions(booked)
        setSelectedSessions(booked) // Pre-select already booked
        setLookupDone(true)
      } else {
        setError('No registration found for this email. Please register as a new family.')
      }
    } catch (err) {
      console.error('Lookup error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLookingUp(false)
    }
  }

  // Toggle child selection for returning families
  const toggleChildSelection = (childId: string) => {
    if (selectedChildIds.includes(childId)) {
      setSelectedChildIds(selectedChildIds.filter(id => id !== childId))
    } else {
      setSelectedChildIds([...selectedChildIds, childId])
    }
  }

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return {
      day: days[date.getDay()],
      date: `${months[date.getMonth()]} ${date.getDate()}`
    }
  }

  // Calculate price
  const getPrice = () => {
    if (packageType === 'already_paid') return 0
    if (packageType === 'bundle') return 5000
    return selectedSessions.length * 500
  }

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    // Different validation and handling for returning vs new
    if (isReturning) {
      // Returning family validation
      if (selectedChildIds.length === 0) {
        setError('Please select at least one child')
        setSubmitting(false)
        return
      }

      // Calculate changes
      const newBookings = selectedSessions.filter(id => !alreadyBookedSessions.includes(id))
      const cancellations = alreadyBookedSessions.filter(id => !selectedSessions.includes(id))

      if (newBookings.length === 0 && cancellations.length === 0) {
        setError('No changes to save')
        setSubmitting(false)
        return
      }

      // Use update-bookings API for returning families
      try {
        const res = await fetch('/api/toddler/update-bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            registrationId,
            newSessionIds: newBookings,
            cancelSessionIds: cancellations,
            childIds: selectedChildIds
          })
        })

        const data = await res.json()

        if (!res.ok) {
          setError(data.error || 'Update failed')
          setSubmitting(false)
          return
        }

        trackEvent('toddler_registration_complete', { type: 'returning', sessions: selectedSessions.length })
        setSubmitted(true)
        return
      } catch (err) {
        console.error('Update error:', err)
        setError('Something went wrong. Please try again.')
        setSubmitting(false)
        return
      }
    } else {
      // New family validation
      if (!parentName || !phone || !email) {
        setError('Please fill in all parent information')
        setSubmitting(false)
        return
      }

      const validChildren = children.filter(c => c.name && c.dateOfBirth && c.gender)
      if (validChildren.length === 0) {
        setError('Please add at least one child with name, date of birth, and gender')
        setSubmitting(false)
        return
      }

      if (selectedSessions.length === 0) {
        setError('Please select at least one session')
        setSubmitting(false)
        return
      }

      if (!termsAcknowledged) {
        setError('Please acknowledge the terms and conditions')
        setSubmitting(false)
        return
      }
    }

    // Get children data
    const childrenToSubmit = isReturning
      ? foundChildren.filter(c => selectedChildIds.includes(c.id))
      : children.filter(c => c.name && c.dateOfBirth && c.gender)

    try {
      const res = await fetch('/api/toddler/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentName,
          phone,
          email,
          isReturning,
          howDidYouFind: isReturning ? undefined : howDidYouFind,
          packageType: isReturning ? 'already_paid' : packageType,
          children: childrenToSubmit,
          sessionIds: selectedSessions,
          photoPermission: isReturning ? true : photoPermission,
          termsAcknowledged: true
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Registration failed')
        setSubmitting(false)
        return
      }

      trackEvent('toddler_registration_complete', {
        type: 'new',
        sessions: selectedSessions.length,
        package: packageType,
        children_count: children.filter(c => c.name).length
      })
      setSubmitted(true)
    } catch (err) {
      console.error('Registration error:', err)
      setError('Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  // Success screen
  if (submitted) {
    return (
      <div className={styles.container}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>
          <h1>Registration Complete!</h1>
          <p>Thank you for registering for our Parent & Toddler Class.</p>
          {packageType === 'already_paid' ? (
            <p>Your sessions have been booked. See you soon!</p>
          ) : (
            <>
              <p>We will contact you shortly with payment details.</p>
              <div className={styles.priceBox}>
                <span>Amount Due:</span>
                <strong>฿{getPrice().toLocaleString()}</strong>
              </div>
            </>
          )}
          <Link href="/camps" className={styles.backLink}>← Back to Camps</Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/camps">
          <img src="/Logo with text.png" alt="Bamboo Valley" className={styles.logo} />
        </Link>
        <h1>Parent & Toddler Class</h1>
        <p>Bamboo Valley School, Phuket</p>
      </div>

      <div className={styles.infoCard}>
        <h3>📍 Class Information</h3>
        <ul>
          <li>Every Tuesday & Thursday, 10:00 - 11:00 AM</li>
          <li>Ages 1-3 years (parent/guardian must attend)</li>
          <li>Nature play, sensory activities, songs & stories</li>
          <li>Location: Bamboo Valley Campus, Cherngtalay</li>
        </ul>
      </div>

      <form className={styles.formCard} onSubmit={handleSubmit}>
        {/* New or Returning - First Question */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>New or returning?</h2>

          <div className={styles.newReturningOptions}>
            <label className={`${styles.newReturningOption} ${!isReturning ? styles.selected : ''}`}>
              <input
                type="radio"
                name="newReturning"
                checked={!isReturning}
                onChange={() => {
                  setIsReturning(false)
                  setPackageType('single')
                  setLookupDone(false)
                  setFoundChildren([])
                }}
              />
              <span className={styles.optionIcon}>👋</span>
              <span className={styles.optionText}>New Child</span>
            </label>
            <label className={`${styles.newReturningOption} ${isReturning ? styles.selected : ''}`}>
              <input
                type="radio"
                name="newReturning"
                checked={isReturning}
                onChange={() => {
                  setIsReturning(true)
                  setPackageType('already_paid')
                }}
              />
              <span className={styles.optionIcon}>🏠</span>
              <span className={styles.optionText}>Returning Child</span>
            </label>
          </div>
        </div>

        {/* RETURNING FAMILY FLOW - Simple lookup and book */}
        {isReturning && (
          <>
            {/* Step 1: Email Lookup */}
            {!lookupDone ? (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Find your registration</h2>
                <div className={styles.lookupRow}>
                  <input
                    type="email"
                    value={lookupEmail}
                    onChange={e => setLookupEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={styles.lookupInput}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleLookup())}
                  />
                  <button
                    type="button"
                    onClick={handleLookup}
                    disabled={lookingUp || !lookupEmail}
                    className={styles.lookupBtn}
                  >
                    {lookingUp ? 'Looking...' : 'Find'}
                  </button>
                </div>
                {error && <div className={styles.error}>{error}</div>}
              </div>
            ) : (
              <>
                {/* Step 2: Select Children */}
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Who&apos;s coming?</h2>
                  <div className={styles.childButtons}>
                    {foundChildren.map(child => (
                      <button
                        key={child.id}
                        type="button"
                        className={`${styles.childButton} ${selectedChildIds.includes(child.id) ? styles.selected : ''}`}
                        onClick={() => toggleChildSelection(child.id)}
                      >
                        {child.name}
                      </button>
                    ))}
                  </div>
                  {sessionsRemaining > 0 && (
                    <p className={styles.sessionsInfo}>You have {sessionsRemaining} sessions remaining</p>
                  )}
                </div>

                {/* Step 3: Select Sessions */}
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Pick your dates</h2>

                  {loadingSessions ? (
                    <p>Loading...</p>
                  ) : (
                    <div className={styles.sessionsGrid}>
                        {sessions.map(session => {
                          const { day, date } = formatDate(session.session_date)
                          const isSelected = selectedSessions.includes(session.id)
                          const isBooked = alreadyBookedSessions.includes(session.id)
                          return (
                            <label
                              key={session.id}
                              className={`${styles.sessionOption} ${isSelected ? styles.selected : ''} ${isBooked ? styles.booked : ''}`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSession(session.id)}
                              />
                              <div className={styles.sessionDay}>{day}</div>
                              <div className={styles.sessionDate}>{date}</div>
                              {isBooked && <div className={styles.bookedBadge}>Booked</div>}
                            </label>
                          )
                        })}
                    </div>
                  )}
                </div>

                {error && <div className={styles.error}>{error}</div>}

                {(() => {
                  const newBookings = selectedSessions.filter(id => !alreadyBookedSessions.includes(id))
                  const cancellations = alreadyBookedSessions.filter(id => !selectedSessions.includes(id))
                  const hasChanges = newBookings.length > 0 || cancellations.length > 0

                  let buttonText = 'No changes'
                  if (newBookings.length > 0 && cancellations.length > 0) {
                    buttonText = `Book ${newBookings.length} & Cancel ${cancellations.length}`
                  } else if (newBookings.length > 0) {
                    buttonText = `Book ${newBookings.length} Session${newBookings.length !== 1 ? 's' : ''}`
                  } else if (cancellations.length > 0) {
                    buttonText = `Cancel ${cancellations.length} Session${cancellations.length !== 1 ? 's' : ''}`
                  }

                  return (
                    <button
                      type="submit"
                      className={styles.submitBtn}
                      disabled={submitting || selectedChildIds.length === 0 || !hasChanges}
                    >
                      {submitting ? 'Saving...' : buttonText}
                    </button>
                  )
                })()}
              </>
            )}
          </>
        )}

        {/* NEW FAMILY FLOW - Full registration form */}
        {!isReturning && (
          <>
        {/* Parent Information */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Parent/Guardian Information</h2>

          <div className={styles.formGroup}>
            <label>Full Name <span className={styles.required}>*</span></label>
            <input
              type="text"
              value={parentName}
              onChange={e => setParentName(e.target.value)}
              placeholder="Your full name"
              required
            />
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Mobile / WhatsApp <span className={styles.required}>*</span></label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+66 XXX XXX XXXX"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Email <span className={styles.required}>*</span></label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
          </div>
        </div>

        {/* Children */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Child Information</h2>

          {children.map((child, index) => (
            <div key={child.id} className={styles.childCard}>
              <div className={styles.childCardHeader}>
                <span className={styles.childCardTitle}>Child {index + 1}</span>
                {children.length > 1 && (
                  <button
                    type="button"
                    className={styles.removeChild}
                    onClick={() => removeChild(child.id)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Child&apos;s Name <span className={styles.required}>*</span></label>
                <input
                  type="text"
                  value={child.name}
                  onChange={e => updateChild(child.id, 'name', e.target.value)}
                  placeholder="Child's full name"
                />
              </div>

              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label>Date of Birth <span className={styles.required}>*</span></label>
                  <input
                    type="date"
                    value={child.dateOfBirth}
                    onChange={e => updateChild(child.id, 'dateOfBirth', e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Gender <span className={styles.required}>*</span></label>
                  <div className={styles.radioGroup}>
                    <label className={`${styles.radioOption} ${child.gender === 'Boy' ? styles.selected : ''}`}>
                      <input
                        type="radio"
                        name={`gender-${child.id}`}
                        checked={child.gender === 'Boy'}
                        onChange={() => updateChild(child.id, 'gender', 'Boy')}
                      />
                      Boy
                    </label>
                    <label className={`${styles.radioOption} ${child.gender === 'Girl' ? styles.selected : ''}`}>
                      <input
                        type="radio"
                        name={`gender-${child.id}`}
                        checked={child.gender === 'Girl'}
                        onChange={() => updateChild(child.id, 'gender', 'Girl')}
                      />
                      Girl
                    </label>
                  </div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Nationality</label>
                <input
                  type="text"
                  value={child.nationality}
                  onChange={e => updateChild(child.id, 'nationality', e.target.value)}
                  placeholder="e.g., Thai, British, etc."
                />
              </div>
            </div>
          ))}

          <button type="button" className={styles.addChildBtn} onClick={addChild}>
            + Add Another Child
          </button>
        </div>

        {/* Session Selection */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Select Sessions</h2>
          <p className={styles.helperText}>Choose which dates you&apos;d like to attend</p>

          {loadingSessions ? (
            <p>Loading available sessions...</p>
          ) : sessions.length === 0 ? (
            <p>No sessions available at the moment.</p>
          ) : (
            <div className={styles.sessionsGrid}>
              {sessions.map(session => {
                const { day, date } = formatDate(session.session_date)
                const spotsLeft = session.capacity - session.current_bookings
                const isSelected = selectedSessions.includes(session.id)

                return (
                  <label
                    key={session.id}
                    className={`${styles.sessionOption} ${isSelected ? styles.selected : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSession(session.id)}
                    />
                    <div className={styles.sessionDay}>{day}</div>
                    <div className={styles.sessionDate}>{date}</div>
                    <div className={styles.sessionSpots}>{spotsLeft} spots left</div>
                  </label>
                )
              })}
            </div>
          )}
        </div>

        {/* Package Selection */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>{isReturning ? 'Payment' : 'Choose Package'}</h2>

          {isReturning ? (
            // Returning families - Already Paid is selected
            <div className={styles.alreadyPaidInfo}>
              <span className={styles.checkIcon}>✓</span>
              <div>
                <div className={styles.alreadyPaidTitle}>Using existing session credits</div>
                <div className={styles.alreadyPaidDesc}>These sessions will be deducted from your remaining balance</div>
              </div>
            </div>
          ) : (
            // New families - Show package options
            <div className={styles.packageOptions}>
              <label className={`${styles.packageOption} ${packageType === 'single' ? styles.selected : ''}`}>
                <input
                  type="radio"
                  name="package"
                  checked={packageType === 'single'}
                  onChange={() => setPackageType('single')}
                />
                <div className={styles.packageName}>Single Session</div>
                <div className={styles.packagePrice}>฿500 <span>per session</span></div>
              </label>

              <label className={`${styles.packageOption} ${packageType === 'bundle' ? styles.selected : ''}`}>
                <input
                  type="radio"
                  name="package"
                  checked={packageType === 'bundle'}
                  onChange={() => setPackageType('bundle')}
                />
                <div className={styles.packageName}>
                  12 Session Bundle <span className={styles.packageBadge}>2 FREE</span>
                </div>
                <div className={styles.packagePrice}>฿5,000 <span>pay for 10, get 12</span></div>
              </label>
            </div>
          )}
        </div>

        {/* How did you find us - Only for new families */}
        {!isReturning && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>How did you find us?</h2>
            <div className={styles.formGroup}>
              <input
                type="text"
                value={howDidYouFind}
                onChange={e => setHowDidYouFind(e.target.value)}
                placeholder="e.g., Facebook, friend's recommendation, Google..."
              />
            </div>
          </div>
        )}

        {/* Consent */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Consent & Agreement</h2>

          <label className={styles.consentOption}>
            <input
              type="checkbox"
              checked={photoPermission}
              onChange={e => setPhotoPermission(e.target.checked)}
            />
            <span>I grant permission for my child to be photographed/filmed for Bamboo Valley&apos;s promotional materials and social media.</span>
          </label>

          <label className={styles.consentOption}>
            <input
              type="checkbox"
              checked={termsAcknowledged}
              onChange={e => setTermsAcknowledged(e.target.checked)}
              required
            />
            <span>I have read and understood the class information, and I agree to the terms and conditions. I understand that a parent/guardian must remain on premises during the session. <span className={styles.required}>*</span></span>
          </label>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={submitting}
        >
          {submitting ? 'Registering...' : packageType === 'already_paid' ? 'Book Sessions' : `Register Now - ฿${getPrice().toLocaleString()}`}
        </button>
          </>
        )}
      </form>

      <div className={styles.backLinkContainer}>
        <Link href="/camps" className={styles.backLink}>← Back to Camps</Link>
      </div>
    </div>
  )
}
