'use client'

interface ContactSectionProps {
  email: string
  onChange: (email: string) => void
  error?: string
}

export default function ContactSection({ email, onChange, error }: ContactSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900">Contact Information</h2>
      <p className="text-gray-600 text-sm">We'll use this email for all camp communications</p>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => onChange(e.target.value)}
          required
          className={`
            w-full px-4 py-3 rounded-lg border-2 transition-colors
            ${error
              ? 'border-red-500 focus:border-red-600'
              : 'border-gray-300 focus:border-green-500'
            }
            focus:outline-none focus:ring-2 focus:ring-green-200
          `}
          placeholder="parent@example.com"
        />
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  )
}
