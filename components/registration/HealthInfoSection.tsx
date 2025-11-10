'use client'

interface HealthInfoSectionProps {
  allergies: string
  healthConditions: string
  hasInsurance: boolean
  behavioralDeclaration: boolean
  onChange: (field: string, value: string | boolean) => void
  errors?: Record<string, string>
}

export default function HealthInfoSection({
  allergies,
  healthConditions,
  hasInsurance,
  behavioralDeclaration,
  onChange,
  errors = {}
}: HealthInfoSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900">Health & Behavioral Information</h2>

      <div>
        <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-2">
          Medical Information & Allergies <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-600 mb-2">
          Please list any allergies, dietary restrictions, or medical conditions we should be aware of.
        </p>
        <textarea
          id="allergies"
          name="allergies"
          value={allergies}
          onChange={(e) => onChange('allergies', e.target.value)}
          required
          rows={3}
          className={`
            w-full px-4 py-3 rounded-lg border-2 transition-colors
            ${errors.allergies
              ? 'border-red-500 focus:border-red-600'
              : 'border-gray-300 focus:border-green-500'
            }
            focus:outline-none focus:ring-2 focus:ring-green-200
          `}
          placeholder="Write 'None' if not applicable"
        />
        {errors.allergies && (
          <p className="mt-1 text-sm text-red-600">{errors.allergies}</p>
        )}
      </div>

      <div className="space-y-4 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
        <div className={`flex items-start gap-3 p-3 rounded ${errors.hasInsurance ? 'bg-red-50 border border-red-300' : ''}`}>
          <input
            type="checkbox"
            id="hasInsurance"
            name="hasInsurance"
            checked={hasInsurance}
            onChange={(e) => onChange('hasInsurance', e.target.checked)}
            required
            className="w-5 h-5 mt-0.5 rounded border-gray-300 text-green-600 focus:ring-green-500 flex-shrink-0"
          />
          <label htmlFor="hasInsurance" className="text-sm text-gray-700 cursor-pointer">
            <span className="font-medium">Health Insurance Confirmation <span className="text-red-500">*</span></span>
            <p className="text-gray-600 mt-1">My child has valid international health insurance or travel medical insurance for the duration of the camp period, as required by Bamboo Valley.</p>
          </label>
        </div>

        <div className={`flex items-start gap-3 p-3 rounded ${errors.behavioralDeclaration ? 'bg-red-50 border border-red-300' : ''}`}>
          <input
            type="checkbox"
            id="behavioralDeclaration"
            name="behavioralDeclaration"
            checked={behavioralDeclaration}
            onChange={(e) => onChange('behavioralDeclaration', e.target.checked)}
            required
            className="w-5 h-5 mt-0.5 rounded border-gray-300 text-green-600 focus:ring-green-500 flex-shrink-0"
          />
          <label htmlFor="behavioralDeclaration" className="text-sm text-gray-700 cursor-pointer">
            <span className="font-medium">Program Fit & Behavioral Declaration <span className="text-red-500">*</span></span>
            <div className="text-gray-700 mt-2 space-y-2">
              <p className="font-medium">I certify that my child:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Has NOT been expelled or suspended from school due to behavioral issues</li>
                <li>Does NOT require one-on-one supervision or specialized learning support</li>
                <li>Does NOT have severe behavioral challenges (aggression, harm to others)</li>
              </ul>
              <p className="font-medium mt-3">I understand that:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Bamboo Valley is a small outdoor program without specialized support services</li>
                <li>The school reserves the right to decline enrollment or remove a child if we cannot meet their needs</li>
                <li>Non-disclosure may result in immediate withdrawal with no refund</li>
              </ul>
              <p className="text-sm text-gray-600 mt-3 italic">
                Parents with questions should contact info@bamboovalleyphuket.com before submitting.
              </p>
            </div>
          </label>
        </div>
      </div>
    </div>
  )
}
