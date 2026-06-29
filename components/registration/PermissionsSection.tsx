'use client'

interface PermissionsSectionProps {
  photoPermission: boolean
  howDidYouFind: string
  termsAcknowledged: boolean
  allStatementsTrue: boolean
  onChange: (field: string, value: boolean | string) => void
  errors?: Record<string, string>
}

export default function PermissionsSection({
  photoPermission,
  howDidYouFind,
  termsAcknowledged,
  allStatementsTrue,
  onChange,
  errors = {}
}: PermissionsSectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Permissions & Agreement</h2>

      <div>
        <label htmlFor="howDidYouFind" className="block text-sm font-medium text-gray-700 mb-2">
          How did you hear about us? <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="howDidYouFind"
          name="howDidYouFind"
          value={howDidYouFind}
          onChange={(e) => onChange('howDidYouFind', e.target.value)}
          required
          className={`
            w-full px-4 py-3 rounded-lg border-2 transition-colors
            ${errors.howDidYouFind
              ? 'border-red-500 focus:border-red-600'
              : 'border-gray-300 focus:border-green-500'
            }
            focus:outline-none focus:ring-2 focus:ring-green-200
          `}
          placeholder="e.g., Google, Facebook, friend recommendation, etc."
        />
        {errors.howDidYouFind && (
          <p className="mt-1 text-sm text-red-600">{errors.howDidYouFind}</p>
        )}
      </div>

      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-start gap-3 p-3 rounded">
          <input
            type="checkbox"
            id="photoPermission"
            name="photoPermission"
            checked={photoPermission}
            onChange={(e) => onChange('photoPermission', e.target.checked)}
            className="w-5 h-5 mt-0.5 rounded border-gray-300 text-green-600 focus:ring-green-500 flex-shrink-0"
          />
          <label htmlFor="photoPermission" className="text-sm text-gray-700 cursor-pointer">
            I grant permission for my child's photos and videos to be used by Bamboo Valley
            for promotional purposes, including on our website, social media, and printed materials.
          </label>
        </div>

        <div className={`flex items-start gap-3 p-3 rounded ${errors.termsAcknowledged ? 'bg-red-50 border border-red-300' : ''}`}>
          <input
            type="checkbox"
            id="termsAcknowledged"
            name="termsAcknowledged"
            checked={termsAcknowledged}
            onChange={(e) => onChange('termsAcknowledged', e.target.checked)}
            required
            className="w-5 h-5 mt-0.5 rounded border-gray-300 text-green-600 focus:ring-green-500 flex-shrink-0"
          />
          <label htmlFor="termsAcknowledged" className="text-sm text-gray-700 cursor-pointer">
            I acknowledge that I have read and understood the{' '}
            <a
              href="/terms-and-conditions-2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 underline font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              terms and conditions
            </a>
            , and I understand that Bamboo Valley does not provide insurance for participants. <span className="text-red-500">*</span>
          </label>
        </div>

        <div className={`flex items-start gap-3 p-3 rounded ${errors.allStatementsTrue ? 'bg-red-50 border border-red-300' : ''}`}>
          <input
            type="checkbox"
            id="allStatementsTrue"
            name="allStatementsTrue"
            checked={allStatementsTrue}
            onChange={(e) => onChange('allStatementsTrue', e.target.checked)}
            required
            className="w-5 h-5 mt-0.5 rounded border-gray-300 text-green-600 focus:ring-green-500 flex-shrink-0"
          />
          <label htmlFor="allStatementsTrue" className="text-sm text-gray-700 cursor-pointer">
            I confirm that all information provided above is true and accurate to the best of my knowledge. <span className="text-red-500">*</span>
          </label>
        </div>
      </div>

      {(errors.termsAcknowledged || errors.allStatementsTrue) && (
        <p className="text-sm text-red-600 font-medium">
          Please check all required boxes to complete registration
        </p>
      )}
    </div>
  )
}
