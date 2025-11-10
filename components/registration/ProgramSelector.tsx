'use client'

import { useState } from 'react'

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

interface ProgramSelectorProps {
  programs: Program[]
  selected: string | null
  onChange: (programId: string) => void
  earlyBirdActive: boolean
}

export default function ProgramSelector({
  programs,
  selected,
  onChange,
  earlyBirdActive
}: ProgramSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900">Select Program</h2>

      {earlyBirdActive && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 text-sm font-medium">
            🎉 Early Bird Pricing Active! Pay before the deadline to save.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {programs.map((program) => {
          const price = earlyBirdActive ? program.pricing.earlyBird : program.pricing.regular
          const isSelected = selected === program.id

          return (
            <button
              key={program.id}
              type="button"
              onClick={() => onChange(program.id)}
              className={`
                p-6 rounded-lg border-2 text-left transition-all
                ${isSelected
                  ? 'border-green-500 bg-green-50 shadow-lg'
                  : 'border-gray-200 hover:border-green-300 hover:shadow-md'
                }
              `}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{program.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">Ages {program.ageRange}</p>
                </div>
                {isSelected && (
                  <div className="bg-green-500 text-white rounded-full p-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              <p className="text-gray-700 text-sm mb-4">{program.description}</p>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-green-600">{price.toLocaleString()}฿</span>
                <span className="text-sm text-gray-500">per week</span>
              </div>

              {earlyBirdActive && (
                <div className="mt-2 text-xs text-gray-500">
                  Regular price: <span className="line-through">{program.pricing.regular.toLocaleString()}฿</span>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
