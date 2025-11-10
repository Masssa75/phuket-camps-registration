'use client'

interface ChildInfoSectionProps {
  childName: string
  nickName: string
  gender: string
  dateOfBirth: string
  onChange: (field: string, value: string) => void
  errors?: Record<string, string>
}

export default function ChildInfoSection({
  childName,
  nickName,
  gender,
  dateOfBirth,
  onChange,
  errors = {}
}: ChildInfoSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900">Child Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="childName" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="childName"
            name="childName"
            value={childName}
            onChange={(e) => onChange('childName', e.target.value)}
            required
            className={`
              w-full px-4 py-3 rounded-lg border-2 transition-colors
              ${errors.childName
                ? 'border-red-500 focus:border-red-600'
                : 'border-gray-300 focus:border-green-500'
              }
              focus:outline-none focus:ring-2 focus:ring-green-200
            `}
            placeholder="Child's full name"
          />
          {errors.childName && (
            <p className="mt-1 text-sm text-red-600">{errors.childName}</p>
          )}
        </div>

        <div>
          <label htmlFor="nickName" className="block text-sm font-medium text-gray-700 mb-2">
            Nickname (Optional)
          </label>
          <input
            type="text"
            id="nickName"
            name="nickName"
            value={nickName}
            onChange={(e) => onChange('nickName', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
            placeholder="Preferred name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            id="gender"
            name="gender"
            value={gender}
            onChange={(e) => onChange('gender', e.target.value)}
            required
            className={`
              w-full px-4 py-3 rounded-lg border-2 transition-colors
              ${errors.gender
                ? 'border-red-500 focus:border-red-600'
                : 'border-gray-300 focus:border-green-500'
              }
              focus:outline-none focus:ring-2 focus:ring-green-200
            `}
          >
            <option value="">Select gender</option>
            <option value="Boy">Boy</option>
            <option value="Girl">Girl</option>
          </select>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
          )}
        </div>

        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={dateOfBirth}
            onChange={(e) => onChange('dateOfBirth', e.target.value)}
            required
            max={new Date().toISOString().split('T')[0]}
            className={`
              w-full px-4 py-3 rounded-lg border-2 transition-colors
              ${errors.dateOfBirth
                ? 'border-red-500 focus:border-red-600'
                : 'border-gray-300 focus:border-green-500'
              }
              focus:outline-none focus:ring-2 focus:ring-green-200
            `}
          />
          {errors.dateOfBirth && (
            <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
          )}
        </div>
      </div>
    </div>
  )
}
