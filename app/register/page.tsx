'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ContactSection from '@/components/registration/ContactSection'
import ParentInfoSection from '@/components/registration/ParentInfoSection'
import EmergencyContactSection from '@/components/registration/EmergencyContactSection'
import PermissionsSection from '@/components/registration/PermissionsSection'
import ChildFormSection, { ChildData } from '@/components/registration/ChildFormSection'
import ChildrenList from '@/components/registration/ChildrenList'
import '../styles/registration.css'

interface Camp {
  id: string
  name: string
  slug: string
  settings: {
    programs: Array<{
      id: string
      name: string
      ageRange: string
      description: string
      pricing: {
        earlyBird: number
        regular: number
        earlyBirdDeadline: string
      }
    }>
    weeks: Array<{
      id: number
      name: string
      startDate: string
      endDate: string
    }>
  }
}

function RegisterContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const campSlug = searchParams.get('camp') || 'summer-2025'

  const [camp, setCamp] = useState<Camp | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const [email, setEmail] = useState('')
  const [parent1Info, setParent1Info] = useState({
    name: '',
    mobilePhone: '',
    wechatWhatsapp: ''
  })
  const [parent2Info, setParent2Info] = useState({
    name: '',
    mobilePhone: '',
    wechatWhatsapp: ''
  })

  const [emergencyContact, setEmergencyContact] = useState({
    name: '',
    phone: ''
  })

  const [children, setChildren] = useState<ChildData[]>([])
  const [showChildForm, setShowChildForm] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const childrenSectionRef = useRef<HTMLDivElement>(null)
  const [editingChildId, setEditingChildId] = useState<string | null>(null)
  const [currentChild, setCurrentChild] = useState<ChildData>({
    id: Date.now().toString(),
    selectedProgram: '',
    selectedWeeks: [],
    childName: '',
    nickName: '',
    gender: '',
    dateOfBirth: '',
    currentSchool: '',
    nationalityLanguage: '',
    englishLevel: '',
    allergies: '',
    healthConditions: '',
    hasInsurance: false,
    behavioralDeclaration: false,
    childPassport: null
  })

  const [permissions, setPermissions] = useState({
    photoPermission: false,  // Required checkbox
    howDidYouFind: '',
    termsAcknowledged: false,
    allStatementsTrue: false
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Component lifecycle logging
  useEffect(() => {
    console.log('🚀 [COMPONENT] RegisterContent mounted')
    return () => {
      console.log('💀 [COMPONENT] RegisterContent unmounting')
    }
  }, [])

  useEffect(() => {
    const fetchCamp = async () => {
      console.log('📡 [API] Fetching camp data for:', campSlug)
      try {
        const response = await fetch(`/api/camps/${campSlug}`)
        if (!response.ok) {
          throw new Error('Camp not found')
        }
        const data = await response.json()
        console.log('✅ [API] Camp data loaded:', data.camp.name)
        setCamp(data.camp)
      } catch (err) {
        console.error('❌ [API] Failed to load camp:', err)
        setError(err instanceof Error ? err.message : 'Failed to load camp')
      } finally {
        setLoading(false)
      }
    }

    fetchCamp()
  }, [campSlug])

  // Log when success state changes (must be before conditional returns)
  useEffect(() => {
    if (submitSuccess) {
      console.log('🎨 [RENDER] Success page rendering triggered')
      console.log('✨ [MOUNTED] Success page DOM should be updating')
      console.log('🖼️ [DOM CHECK] Background:', window.getComputedStyle(document.body).backgroundColor)
      console.log('🖼️ [DOM CHECK] Document state:', document.readyState)
    }
  }, [submitSuccess])

  const checkEarlyBird = () => {
    if (!camp) return false
    const today = new Date()
    const deadline = new Date(camp.settings.programs[0]?.pricing.earlyBirdDeadline || '')
    return today <= deadline
  }

  const handleAddChild = () => {
    setCurrentChild({
      id: Date.now().toString(),
      selectedProgram: '',
      selectedWeeks: [],
      childName: '',
      nickName: '',
      gender: '',
      dateOfBirth: '',
      currentSchool: '',
      nationalityLanguage: '',
      englishLevel: '',
      allergies: '',
      healthConditions: '',
      hasInsurance: false,
      behavioralDeclaration: false,
      childPassport: null
    })
    setEditingChildId(null)
    setShowChildForm(true)
    setShowSuccessMessage(false)
  }

  const handleEditChild = (id: string) => {
    const child = children.find(c => c.id === id)
    if (child) {
      setCurrentChild(child)
      setEditingChildId(id)
      setShowChildForm(true)
    }
  }

  const handleDeleteChild = (id: string) => {
    setChildren(prev => prev.filter(c => c.id !== id))
  }

  const handleSaveChild = () => {
    if (!currentChild.childName || !currentChild.selectedProgram || currentChild.selectedWeeks.length === 0) {
      setFormErrors({ child: 'Please fill in all required fields' })
      return
    }

    if (!currentChild.hasInsurance) {
      setFormErrors({ hasInsurance: 'Health insurance confirmation is required' })
      return
    }

    if (!currentChild.behavioralDeclaration) {
      setFormErrors({ behavioralDeclaration: 'Behavioral & Special Needs Declaration is required' })
      return
    }

    if (editingChildId) {
      setChildren(prev => prev.map(c => c.id === editingChildId ? currentChild : c))
    } else {
      setChildren(prev => [...prev, currentChild])
    }

    setShowChildForm(false)
    setEditingChildId(null)
    setFormErrors({})

    // Show success message
    setShowSuccessMessage(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const submitStartTime = performance.now()
    console.log('🚀 [SUBMIT START]', new Date().toISOString(), 'Browser:', navigator.userAgent)

    setSubmitting(true)
    setFormErrors({})

    if (children.length === 0) {
      console.error('❌ [VALIDATION] No children added')
      setFormErrors({ submit: 'Please add at least one child' })
      setSubmitting(false)
      return
    }

    try {
      const registrations = []
      const errors = []

      console.log('✅ [VALIDATION PASSED] Submitting registrations for', children.length, 'children')

      // Submit all children - don't stop if one fails
      for (const child of children) {
        try {
          const childStartTime = performance.now()
          console.log(`📤 [CHILD ${child.childName}] Starting registration (${performance.now() - submitStartTime}ms since submit)`)

          const formData = new FormData()
          formData.append('campId', camp!.id)
          formData.append('email', email)
          // Map program ID to age_group (database expects 'mini' or 'maxi')
          const ageGroup = child.selectedProgram.toLowerCase().includes('mini') ? 'mini' : 'maxi'

          formData.append('childName', child.childName)
          formData.append('nickName', child.nickName)
          formData.append('gender', child.gender)
          formData.append('dateOfBirth', child.dateOfBirth)
          formData.append('ageGroup', ageGroup)
          formData.append('currentSchool', child.currentSchool)
          formData.append('nationalityLanguage', child.nationalityLanguage)
          formData.append('englishLevel', child.englishLevel)
          formData.append('parentName1', parent1Info.name)
          formData.append('parentName2', parent2Info.name)
          formData.append('mobilePhone1', parent1Info.mobilePhone)
          formData.append('mobilePhone2', parent2Info.mobilePhone)
          formData.append('wechatWhatsapp1', parent1Info.wechatWhatsapp)
          formData.append('wechatWhatsapp2', parent2Info.wechatWhatsapp)
          formData.append('emergencyContactName', emergencyContact.name)
          formData.append('emergencyContactPhone', emergencyContact.phone)
          formData.append('allergies', child.allergies)
          formData.append('healthBehavioralConditions', child.healthConditions)
          formData.append('hasInsurance', child.hasInsurance.toString())
          formData.append('behavioralDeclaration', child.behavioralDeclaration.toString())
          if (child.childPassport) formData.append('childPassport', child.childPassport)
          // Parent passports not implemented yet - send empty
          // formData.append('parentPassport1', parentPassport1File)
          // formData.append('parentPassport2', parentPassport2File)
          formData.append('weeksSelected', JSON.stringify(child.selectedWeeks))
          formData.append('photoPermission', permissions.photoPermission.toString())
          formData.append('howDidYouFind', permissions.howDidYouFind)
          formData.append('termsAcknowledged', permissions.termsAcknowledged.toString())
          formData.append('allStatementsTrue', permissions.allStatementsTrue.toString())

          console.log(`🌐 [CHILD ${child.childName}] Sending API request... (${performance.now() - childStartTime}ms prep time)`)

          const response = await fetch('/api/register', {
            method: 'POST',
            body: formData
          })

          console.log(`📥 [CHILD ${child.childName}] API response received (${performance.now() - childStartTime}ms total)`)

          const result = await response.json()

          console.log(`✅ [CHILD ${child.childName}] Response parsed:`, result)

          if (!response.ok) {
            console.error('Registration failed for', child.childName, ':', result)
            errors.push(`${child.childName}: ${result.details || result.error || 'Registration failed'}`)
          } else {
            registrations.push(result)
          }
        } catch (childError) {
          console.error('Error registering', child.childName, ':', childError)
          errors.push(`${child.childName}: ${childError instanceof Error ? childError.message : 'Unknown error'}`)
        }
      }

      // If at least one succeeded, show success
      if (registrations.length > 0) {
        const totalTime = performance.now() - submitStartTime
        console.log(`🎉 [SUCCESS] All registrations complete (${totalTime}ms total)`)

        // Scroll first, then set state - gives Safari time to process scroll before re-render
        console.log(`📜 [SCROLL] Scrolling to top first`)
        window.scrollTo({ top: 0, behavior: 'instant' }) // Use instant instead of smooth

        // Small delay to let Safari complete scroll before state change
        setTimeout(() => {
          console.log(`🔄 [STATE] Setting submitSuccess = true (after scroll)`)
          setSubmitSuccess(true)
        }, 50) // 50ms delay

        // If some failed, show which ones
        if (errors.length > 0) {
          console.warn('⚠️ [PARTIAL SUCCESS] Some registrations failed:', errors)
          alert(`Warning: ${registrations.length} of ${children.length} children registered successfully. Failed: ${errors.join(', ')}`)
        }
      } else {
        // All failed
        console.error('❌ [ALL FAILED]', errors)
        throw new Error(`All registrations failed: ${errors.join('; ')}`)
      }
    } catch (err) {
      console.error('❌ [ERROR]', err)
      setFormErrors({
        submit: err instanceof Error ? err.message : 'Registration failed. Please try again.'
      })
    } finally {
      console.log('🏁 [FINALLY] Setting submitting = false')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="registration-page">
        <div className="registration-container">
          <div className="registration-header">
            <h1>Loading Camp Information...</h1>
          </div>
        </div>
      </div>
    )
  }

  if (error || !camp) {
    return (
      <div className="registration-page">
        <div className="registration-container">
          <div className="registration-header">
            <h1>Camp Not Found</h1>
            <p className="text-red-600 mt-4">{error || 'The requested camp could not be found.'}</p>
          </div>
        </div>
      </div>
    )
  }

  if (submitSuccess) {
    console.log('🎨 [RENDER] Success page component rendering')

    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-green-600 text-white p-8 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-4">Registration Successful!</h1>
            <p className="text-green-50 mb-2">
              Thank you for registering {children.length} {children.length === 1 ? 'child' : 'children'} for {camp.name}.
            </p>
          </div>
          <div className="p-8 text-center">
            <p className="text-gray-700 mb-8 text-lg">
              We've received your registration and will contact you shortly with payment details and further information.
            </p>
            <button
              onClick={() => window.location.href = 'https://phuketcamp.com'}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-md hover:shadow-lg"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  const earlyBirdActive = checkEarlyBird()

  return (
    <div className="registration-page">
      <div className="registration-container">
        {/* Header - Centered */}
        <div className="text-center mb-8 mt-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{camp.name} Registration</h1>
          <p className="text-gray-600 text-lg">
            {camp.settings.weeks.length} weeks • {new Date(camp.settings.weeks[0].startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} - {new Date(camp.settings.weeks[camp.settings.weeks.length - 1].endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Main Info Box with Table */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-2 border-gray-200">
          {/* Payment Policy */}
          <div className="mb-5">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Payment Policy:</h3>
            <p className="text-gray-700">The camp fee must be paid in advance to secure your spot.</p>
          </div>

          {/* Pricing Table */}
          <div className="mb-5">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{camp.name.toUpperCase()} FEE PER CHILD:</h3>
            <table className="w-full border-collapse mb-5">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left">Program</th>
                  <th className="border border-gray-300 px-4 py-3 text-left">Early Bird (pay by Nov 30th)</th>
                  <th className="border border-gray-300 px-4 py-3 text-left">Regular</th>
                </tr>
              </thead>
              <tbody>
                {camp.settings.programs.map(program => (
                  <tr key={program.id}>
                    <td className="border border-gray-300 px-4 py-3">
                      <strong>{program.name} ({program.ageRange} years)</strong>
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      {program.pricing.earlyBird.toLocaleString()} ฿/week
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      {program.pricing.regular.toLocaleString()} ฿/week
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* What's Included */}
            <p className="text-gray-800">
              💚 <strong>The fee includes a healthy lunch, two snacks per day and all craft materials</strong>
            </p>
          </div>

          {/* Activities */}
          <div className="mb-6">
            <p className="text-gray-800 mb-3">
              <strong>Each day of the week will feature exciting hands-on activities:</strong>
            </p>
            <ul className="list-none space-y-1 ml-0 text-gray-700">
              <li>Arts & crafts</li>
              <li>Animal care and exploration</li>
              <li>Thai food, cooking and baking</li>
              <li>Gardening and Farming</li>
              <li>Yoga & Meditation</li>
            </ul>

            {/* Maxi Camp Field Trips */}
            <p className="text-gray-800 mt-4">
              <strong>Maxi Camp includes field trips twice per week. Transportation cost is included.</strong>
            </p>
          </div>

          {/* Refund Policy */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Refund policy:</h3>
            <ul className="list-none space-y-2 ml-0 text-gray-700">
              <li>a. Minimum 1 month before the child starts the camp – 100% of payment refunded;</li>
              <li>b. Less than 1 month before the child starts the camp – 50% of payment refunded;</li>
              <li>c. Cancellations made less than 7 days before the camp starts or during the camp – no refund made.</li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <p className="text-gray-700">
              For further details, contact us on WhatsApp at <strong>+66 98 912 4218</strong> or via email at{' '}
              <a href="mailto:info@bamboovalleyphuket.com" className="text-green-600 hover:text-green-700 underline">
                info@bamboovalleyphuket.com
              </a>
            </p>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="text-center mb-6">
          <p className="text-gray-700">
            Please read our{' '}
            <a
              href="https://docs.google.com/document/d/1wgchlRHlDmZgy0zp89yQTACKus3h7VKcBB-RizrV_TQ/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 font-medium underline"
            >
              Terms and Conditions
            </a>
            {' '}before filling out the form.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Parent Contact Information</h2>
            <div className="space-y-6">
              <ContactSection
                email={email}
                onChange={setEmail}
                error={formErrors.email}
              />

              <ParentInfoSection
                parentNumber={1}
                parentInfo={parent1Info}
                onChange={(field, value) => {
                  if (field === 'parentName1') setParent1Info(prev => ({ ...prev, name: value as string }))
                  else if (field === 'mobilePhone1') setParent1Info(prev => ({ ...prev, mobilePhone: value as string }))
                  else if (field === 'wechatWhatsapp1') setParent1Info(prev => ({ ...prev, wechatWhatsapp: value as string }))
                }}
                required={true}
                errors={formErrors}
              />

              <ParentInfoSection
                parentNumber={2}
                parentInfo={parent2Info}
                onChange={(field, value) => {
                  if (field === 'parentName2') setParent2Info(prev => ({ ...prev, name: value as string }))
                  else if (field === 'mobilePhone2') setParent2Info(prev => ({ ...prev, mobilePhone: value as string }))
                  else if (field === 'wechatWhatsapp2') setParent2Info(prev => ({ ...prev, wechatWhatsapp: value as string }))
                }}
                required={false}
              />

              <EmergencyContactSection
                name={emergencyContact.name}
                phone={emergencyContact.phone}
                onChange={(field, value) => {
                  setEmergencyContact(prev => ({ ...prev, [field]: value }))
                }}
                errors={formErrors}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6" ref={childrenSectionRef}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Children</h2>
              {!showChildForm && (
                <button
                  type="button"
                  onClick={handleAddChild}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Child
                </button>
              )}
            </div>

            {children.length === 0 && !showChildForm && (
              <p className="text-gray-500 text-center py-8">No children added yet. Click "Add Child" to begin.</p>
            )}

            <ChildrenList
              childrenList={children}
              programs={camp.settings.programs}
              weeks={camp.settings.weeks}
              earlyBirdActive={earlyBirdActive}
              onEdit={handleEditChild}
              onDelete={handleDeleteChild}
            />

            {showChildForm && (
              <div className="mt-6">
                <ChildFormSection
                  programs={camp.settings.programs}
                  weeks={camp.settings.weeks}
                  earlyBirdActive={earlyBirdActive}
                  childData={currentChild}
                  onChange={setCurrentChild}
                  onSave={handleSaveChild}
                  onCancel={() => {
                    setShowChildForm(false)
                    setEditingChildId(null)
                  }}
                  errors={formErrors}
                />
              </div>
            )}
          </div>

          {/* Success Modal */}
          {showSuccessMessage && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 text-center">
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {children[children.length - 1]?.childName} Added Successfully!
                </h3>
                <p className="text-gray-600 mb-8">
                  Would you like to add another child or continue to complete your registration?
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleAddChild}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    Add Another Child
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSuccessMessage(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm p-6">
            <PermissionsSection
              photoPermission={permissions.photoPermission}
              howDidYouFind={permissions.howDidYouFind}
              termsAcknowledged={permissions.termsAcknowledged}
              allStatementsTrue={permissions.allStatementsTrue}
              onChange={(field, value) => {
                setPermissions(prev => {
                  // Only update if value actually changed to prevent double-firing
                  if (prev[field as keyof typeof prev] === value) return prev
                  return { ...prev, [field]: value }
                })
              }}
              errors={formErrors}
            />
          </div>

          {formErrors.submit && (
            <div className="bg-red-50 border border-red-300 rounded-lg p-4">
              <p className="text-red-800">{formErrors.submit}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || children.length === 0}
            className="w-full py-4 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Submitting...' : `Complete Registration (${children.length} ${children.length === 1 ? 'child' : 'children'})`}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="registration-page">
        <div className="registration-container">
          <div className="registration-header">
            <h1>Loading...</h1>
          </div>
        </div>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  )
}
