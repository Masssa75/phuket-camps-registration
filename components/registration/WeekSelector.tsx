'use client'

interface Week {
  id: number
  name: string
  startDate: string
  endDate: string
}

interface WeekSelectorProps {
  weeks: Week[]
  selected: number[]
  onChange: (weekIds: number[]) => void
}

export default function WeekSelector({ weeks, selected, onChange }: WeekSelectorProps) {
  const toggleWeek = (weekId: number) => {
    if (selected.includes(weekId)) {
      onChange(selected.filter(id => id !== weekId))
    } else {
      onChange([...selected, weekId])
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900">Select Weeks</h2>
      <p className="text-gray-600">Choose one or more weeks to attend</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {weeks.map((week) => {
          const isSelected = selected.includes(week.id)

          return (
            <button
              key={week.id}
              type="button"
              onClick={() => toggleWeek(week.id)}
              className={`
                p-4 rounded-lg border-2 text-left transition-all
                ${isSelected
                  ? 'border-green-500 bg-green-50 shadow-md'
                  : 'border-gray-200 hover:border-green-300 hover:shadow-sm'
                }
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
                      ${isSelected
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300'
                      }
                    `}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{week.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 ml-8">
                    {formatDate(week.startDate)} - {formatDate(week.endDate)}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {selected.length === 0 && (
        <p className="text-red-600 text-sm">Please select at least one week</p>
      )}
    </div>
  )
}
