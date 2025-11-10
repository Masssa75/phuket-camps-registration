'use client'

interface EmergencyContactSectionProps {
  name: string
  phone: string
  onChange: (field: 'name' | 'phone', value: string) => void
  errors?: Record<string, string>
}

export default function EmergencyContactSection({
  name,
  phone,
  onChange,
  errors = {}
}: EmergencyContactSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900">Emergency Contact Information</h2>
      <p className="text-gray-600 text-sm">
        Please provide an emergency contact person who can be reached if we cannot reach the parents.
      </p>

      <div>
        <label htmlFor="emergencyContactName" className="block text-sm font-medium text-gray-700 mb-2">
          Emergency Contact Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="emergencyContactName"
          name="emergencyContactName"
          value={name}
          onChange={(e) => onChange('name', e.target.value)}
          required
          className={`
            w-full px-4 py-3 rounded-lg border-2 transition-colors
            ${errors.emergencyContactName
              ? 'border-red-500 focus:border-red-600'
              : 'border-gray-300 focus:border-green-500'
            }
            focus:outline-none focus:ring-2 focus:ring-green-200
          `}
          placeholder="Emergency contact name"
        />
        {errors.emergencyContactName && (
          <p className="mt-1 text-sm text-red-600">{errors.emergencyContactName}</p>
        )}
      </div>

      <div>
        <label htmlFor="emergencyContactPhone" className="block text-sm font-medium text-gray-700 mb-2">
          Emergency Contact Phone <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="emergencyContactPhone"
          name="emergencyContactPhone"
          value={phone}
          onChange={(e) => onChange('phone', e.target.value)}
          required
          className={`
            w-full px-4 py-3 rounded-lg border-2 transition-colors
            ${errors.emergencyContactPhone
              ? 'border-red-500 focus:border-red-600'
              : 'border-gray-300 focus:border-green-500'
            }
            focus:outline-none focus:ring-2 focus:ring-green-200
          `}
          placeholder="+66 XX XXX XXXX"
        />
        {errors.emergencyContactPhone && (
          <p className="mt-1 text-sm text-red-600">{errors.emergencyContactPhone}</p>
        )}
      </div>
    </div>
  )
}
