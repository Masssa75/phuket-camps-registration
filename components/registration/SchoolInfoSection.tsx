'use client'

interface SchoolInfoSectionProps {
  currentSchool: string
  nationalityLanguage: string
  englishLevel: string
  onChange: (field: string, value: string) => void
}

export default function SchoolInfoSection({
  currentSchool,
  nationalityLanguage,
  englishLevel,
  onChange
}: SchoolInfoSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900">School & Language</h2>

      <div>
        <label htmlFor="currentSchool" className="block text-sm font-medium text-gray-700 mb-2">
          Current School (Optional)
        </label>
        <input
          type="text"
          id="currentSchool"
          name="currentSchool"
          value={currentSchool}
          onChange={(e) => onChange('currentSchool', e.target.value)}
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
          placeholder="School name"
        />
      </div>

      <div>
        <label htmlFor="nationalityLanguage" className="block text-sm font-medium text-gray-700 mb-2">
          Nationality / Primary Language <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="nationalityLanguage"
          name="nationalityLanguage"
          value={nationalityLanguage}
          onChange={(e) => onChange('nationalityLanguage', e.target.value)}
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
          placeholder="e.g., Thai, English, Chinese"
          required
        />
      </div>

      <div>
        <label htmlFor="englishLevel" className="block text-sm font-medium text-gray-700 mb-2">
          English Level <span className="text-red-500">*</span>
        </label>
        <select
          id="englishLevel"
          name="englishLevel"
          value={englishLevel}
          onChange={(e) => onChange('englishLevel', e.target.value)}
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
          required
        >
          <option value="">Select level</option>
          <option value="native">Native Speaker</option>
          <option value="fluent">Fluent</option>
          <option value="intermediate">Intermediate</option>
          <option value="beginner">Beginner</option>
          <option value="none">No English</option>
        </select>
      </div>
    </div>
  )
}
