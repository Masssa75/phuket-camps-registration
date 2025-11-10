'use client'

import { useState } from 'react'
import ProgramSelector from './ProgramSelector'
import WeekSelector from './WeekSelector'
import ChildInfoSection from './ChildInfoSection'
import SchoolInfoSection from './SchoolInfoSection'
import HealthInfoSection from './HealthInfoSection'
import FileUploadSection from './FileUploadSection'

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

export interface ChildData {
  id: string
  selectedProgram: string
  selectedWeeks: number[]
  childName: string
  nickName: string
  gender: string
  dateOfBirth: string
  currentSchool: string
  nationalityLanguage: string
  englishLevel: string
  allergies: string
  healthConditions: string
  hasInsurance: boolean
  behavioralDeclaration: boolean
  childPassport: File | null
}

interface ChildFormSectionProps {
  programs: Program[]
  weeks: Week[]
  earlyBirdActive: boolean
  childData: ChildData
  onChange: (data: ChildData) => void
  onSave: () => void
  onCancel: () => void
  errors?: Record<string, string>
}

export default function ChildFormSection({
  programs,
  weeks,
  earlyBirdActive,
  childData,
  onChange,
  onSave,
  onCancel,
  errors = {}
}: ChildFormSectionProps) {
  const [fileError, setFileError] = useState<string | null>(null)

  // 4MB file size limit (Netlify binary payload limit is ~4.5MB after Base64 encoding)
  // Testing GitHub auto-deploy integration
  const MAX_FILE_SIZE = 4 * 1024 * 1024 // 4MB in bytes

  const updateField = (field: string, value: any) => {
    onChange({ ...childData, [field]: value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      setFileError(null)
      updateField('childPassport', null)
      return
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setFileError(`File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum file size is 4MB.`)
      e.target.value = '' // Clear the input
      return
    }

    // File is valid
    setFileError(null)
    updateField('childPassport', file)
  }

  const selectedProgramData = programs.find(p => p.id === childData.selectedProgram)

  return (
    <div className="space-y-6 bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">
          {childData.childName || 'Add Child Information'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg p-6">
          <ProgramSelector
            programs={programs}
            selected={childData.selectedProgram}
            onChange={(programId) => updateField('selectedProgram', programId)}
            earlyBirdActive={earlyBirdActive}
          />
        </div>

        {childData.selectedProgram && (
          <div className="bg-white rounded-lg p-6">
            <WeekSelector
              weeks={weeks}
              selected={childData.selectedWeeks}
              onChange={(weeks) => updateField('selectedWeeks', weeks)}
            />
          </div>
        )}

        <div className="bg-white rounded-lg p-6">
          <ChildInfoSection
            childName={childData.childName}
            nickName={childData.nickName}
            gender={childData.gender}
            dateOfBirth={childData.dateOfBirth}
            onChange={(field, value) => updateField(field, value)}
            errors={errors}
          />
        </div>

        <div className="bg-white rounded-lg p-6">
          <SchoolInfoSection
            currentSchool={childData.currentSchool}
            nationalityLanguage={childData.nationalityLanguage}
            englishLevel={childData.englishLevel}
            onChange={(field, value) => updateField(field, value)}
          />
        </div>

        <div className="bg-white rounded-lg p-6">
          <HealthInfoSection
            allergies={childData.allergies}
            healthConditions={childData.healthConditions}
            hasInsurance={childData.hasInsurance}
            behavioralDeclaration={childData.behavioralDeclaration}
            onChange={(field, value) => updateField(field, value)}
            errors={errors}
          />
        </div>

        <div className="bg-white rounded-lg p-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">Child's Passport/ID</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload passport or ID document (optional)
              </label>
              <div className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                fileError
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 hover:border-green-500 hover:bg-green-50'
              }`}>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id={`child-passport-${childData.id}`}
                />
                <label htmlFor={`child-passport-${childData.id}`} className="cursor-pointer">
                  {childData.childPassport ? (
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-medium">{childData.childPassport.name}</span>
                      <span className="text-sm text-gray-500">({(childData.childPassport.size / 1024 / 1024).toFixed(2)}MB)</span>
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm font-medium">Click to upload</p>
                      <p className="text-xs mt-1">Image or PDF (max 4MB)</p>
                    </div>
                  )}
                </label>
              </div>
              {fileError && (
                <div className="mt-2 p-3 bg-red-50 border border-red-300 rounded-lg flex items-start gap-2">
                  <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-red-800">{fileError}</p>
                    <p className="text-xs text-red-700 mt-1">Please choose a smaller file or compress the image before uploading.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-end pt-4 border-t border-gray-300">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={!childData.childName || !childData.selectedProgram || childData.selectedWeeks.length === 0}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Save Child
        </button>
      </div>
    </div>
  )
}
