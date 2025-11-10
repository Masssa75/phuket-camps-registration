'use client'

import { ChildData } from './ChildFormSection'

interface Week {
  id: number
  name: string
  startDate: string
  endDate: string
}

interface Program {
  id: string
  name: string
  ageRange: string
  description: string
  pricing: {
    earlyBird: number
    regular: number
    earlyBirdDeadline: string
  }
}

interface ChildrenListProps {
  childrenList: ChildData[]
  programs: Program[]
  weeks: Week[]
  earlyBirdActive: boolean
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function ChildrenList({
  childrenList,
  programs,
  weeks,
  earlyBirdActive,
  onEdit,
  onDelete
}: ChildrenListProps) {
  if (childrenList.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900">Registered Children ({childrenList.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {childrenList.map((child) => {
          const program = programs.find(p => p.id === child.selectedProgram)
          const selectedWeekNames = weeks.filter(w => child.selectedWeeks.includes(w.id)).map(w => w.name)
          const pricePerWeek = earlyBirdActive ? program?.pricing.earlyBird : program?.pricing.regular
          const totalPrice = (pricePerWeek || 0) * child.selectedWeeks.length

          return (
            <div key={child.id} className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{child.childName}</h3>
                  {child.nickName && (
                    <p className="text-sm text-gray-600">"{child.nickName}"</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(child.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Edit"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(child.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Program:</span>
                  <span className="text-gray-900">{program?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Weeks:</span>
                  <span className="text-gray-900">{child.selectedWeeks.length} week{child.selectedWeeks.length > 1 ? 's' : ''}</span>
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {selectedWeekNames.join(', ')}
                </div>
                <div className="pt-2 mt-2 border-t border-gray-200">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-green-600">{totalPrice.toLocaleString()}฿</span>
                    <span className="text-xs text-gray-500">total</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
