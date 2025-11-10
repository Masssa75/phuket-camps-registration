'use client'

interface ParentInfo {
  name: string
  mobilePhone: string
  wechatWhatsapp: string
}

interface ParentInfoSectionProps {
  parentNumber: 1 | 2
  parentInfo: ParentInfo
  onChange: (field: string, value: string) => void
  required: boolean
  errors?: Record<string, string>
}

export default function ParentInfoSection({
  parentNumber,
  parentInfo,
  onChange,
  required,
  errors = {}
}: ParentInfoSectionProps) {
  const fieldPrefix = `parent${parentNumber}`
  const title = `Parent ${parentNumber} Information`

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900">
        {title} {!required && <span className="text-sm font-normal text-gray-500">(Optional)</span>}
      </h2>

      <div>
        <label htmlFor={`${fieldPrefix}Name`} className="block text-sm font-medium text-gray-700 mb-2">
          Full Name {required && <span className="text-red-500">*</span>}
        </label>
        <input
          type="text"
          id={`${fieldPrefix}Name`}
          name={`parentName${parentNumber}`}
          value={parentInfo.name}
          onChange={(e) => onChange(`parentName${parentNumber}`, e.target.value)}
          required={required}
          className={`
            w-full px-4 py-3 rounded-lg border-2 transition-colors
            ${errors[`parentName${parentNumber}`]
              ? 'border-red-500 focus:border-red-600'
              : 'border-gray-300 focus:border-green-500'
            }
            focus:outline-none focus:ring-2 focus:ring-green-200
          `}
          placeholder="Parent's full name"
        />
        {errors[`parentName${parentNumber}`] && (
          <p className="mt-1 text-sm text-red-600">{errors[`parentName${parentNumber}`]}</p>
        )}
      </div>

      <div>
        <label htmlFor={`${fieldPrefix}Phone`} className="block text-sm font-medium text-gray-700 mb-2">
          Mobile Phone {required && <span className="text-red-500">*</span>}
        </label>
        <input
          type="tel"
          id={`${fieldPrefix}Phone`}
          name={`mobilePhone${parentNumber}`}
          value={parentInfo.mobilePhone}
          onChange={(e) => onChange(`mobilePhone${parentNumber}`, e.target.value)}
          required={required}
          className={`
            w-full px-4 py-3 rounded-lg border-2 transition-colors
            ${errors[`mobilePhone${parentNumber}`]
              ? 'border-red-500 focus:border-red-600'
              : 'border-gray-300 focus:border-green-500'
            }
            focus:outline-none focus:ring-2 focus:ring-green-200
          `}
          placeholder="+66 XX XXX XXXX"
        />
        {errors[`mobilePhone${parentNumber}`] && (
          <p className="mt-1 text-sm text-red-600">{errors[`mobilePhone${parentNumber}`]}</p>
        )}
      </div>

      <div>
        <label htmlFor={`${fieldPrefix}Contact`} className="block text-sm font-medium text-gray-700 mb-2">
          WeChat / WhatsApp ID (Optional)
        </label>
        <input
          type="text"
          id={`${fieldPrefix}Contact`}
          name={`wechatWhatsapp${parentNumber}`}
          value={parentInfo.wechatWhatsapp}
          onChange={(e) => onChange(`wechatWhatsapp${parentNumber}`, e.target.value)}
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
          placeholder="WeChat or WhatsApp ID"
        />
      </div>
    </div>
  )
}
