'use client'

interface Program {
  id: string
  name: string
  pricing: {
    earlyBird: number
    regular: number
    earlyBirdDeadline: string
  }
}

interface Week {
  id: number
  name: string
}

interface PricingDisplayProps {
  selectedProgram: Program | null
  selectedWeeks: number[]
  weeks: Week[]
  earlyBirdActive: boolean
}

export default function PricingDisplay({
  selectedProgram,
  selectedWeeks,
  weeks,
  earlyBirdActive
}: PricingDisplayProps) {
  if (!selectedProgram || selectedWeeks.length === 0) {
    return null
  }

  const pricePerWeek = earlyBirdActive
    ? selectedProgram.pricing.earlyBird
    : selectedProgram.pricing.regular

  const totalPrice = pricePerWeek * selectedWeeks.length
  const savings = earlyBirdActive
    ? (selectedProgram.pricing.regular - selectedProgram.pricing.earlyBird) * selectedWeeks.length
    : 0

  const selectedWeekNames = weeks
    .filter(w => selectedWeeks.includes(w.id))
    .map(w => w.name)

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-6 sticky top-4">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Registration Summary</h3>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-start">
          <span className="text-gray-700 font-medium">Program:</span>
          <span className="text-gray-900 font-semibold text-right">{selectedProgram.name}</span>
        </div>

        <div className="flex justify-between items-start">
          <span className="text-gray-700 font-medium">Weeks:</span>
          <div className="text-right">
            <span className="text-gray-900 font-semibold">{selectedWeeks.length} week{selectedWeeks.length > 1 ? 's' : ''}</span>
            <div className="text-xs text-gray-600 mt-1">
              {selectedWeekNames.join(', ')}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Price per week:</span>
            <span className="text-gray-900 font-semibold">{pricePerWeek.toLocaleString()}฿</span>
          </div>
        </div>
      </div>

      {earlyBirdActive && savings > 0 && (
        <div className="bg-green-100 border border-green-300 rounded-md p-3 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-green-800 font-semibold text-sm">Early Bird Discount</span>
          </div>
          <p className="text-green-700 text-sm">
            You're saving {savings.toLocaleString()}฿!
          </p>
        </div>
      )}

      <div className="border-t-2 border-gray-300 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">Total Price:</span>
          <span className="text-3xl font-bold text-green-600">{totalPrice.toLocaleString()}฿</span>
        </div>
        {earlyBirdActive && (
          <p className="text-xs text-gray-600 mt-2 text-right">
            Regular price: <span className="line-through">{(selectedProgram.pricing.regular * selectedWeeks.length).toLocaleString()}฿</span>
          </p>
        )}
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-xs text-blue-800">
          <strong>Note:</strong> Payment details will be sent after registration confirmation.
        </p>
      </div>
    </div>
  )
}
