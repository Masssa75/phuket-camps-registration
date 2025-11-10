'use client'

import { useRef } from 'react'

interface FileUploadSectionProps {
  childPassport: File | null
  parentPassport1: File | null
  parentPassport2: File | null
  onChange: (field: string, file: File | null) => void
}

export default function FileUploadSection({
  childPassport,
  parentPassport1,
  parentPassport2,
  onChange
}: FileUploadSectionProps) {
  const childInputRef = useRef<HTMLInputElement>(null)
  const parent1InputRef = useRef<HTMLInputElement>(null)
  const parent2InputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (field: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    onChange(field, file)
  }

  const FileUploadBox = ({
    label,
    file,
    fieldName,
    inputRef,
    required = false
  }: {
    label: string
    file: File | null
    fieldName: string
    inputRef: React.RefObject<HTMLInputElement>
    required?: boolean
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => handleFileChange(fieldName, e)}
          className="hidden"
          required={required}
        />
        {file ? (
          <div className="flex items-center justify-center gap-2 text-green-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">{file.name}</span>
          </div>
        ) : (
          <div className="text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm font-medium">Click to upload</p>
            <p className="text-xs mt-1">Image or PDF</p>
          </div>
        )}
      </div>
      {file && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onChange(fieldName, null)
            if (inputRef.current) inputRef.current.value = ''
          }}
          className="mt-2 text-sm text-red-600 hover:text-red-700"
        >
          Remove file
        </button>
      )}
    </div>
  )

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900">Document Uploads</h2>
      <p className="text-gray-600 text-sm">
        Please upload passport copies for identity verification (optional but recommended)
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FileUploadBox
          label="Child's Passport/ID"
          file={childPassport}
          fieldName="childPassport"
          inputRef={childInputRef}
        />
        <FileUploadBox
          label="Parent 1 Passport/ID"
          file={parentPassport1}
          fieldName="parentPassport1"
          inputRef={parent1InputRef}
        />
      </div>

      <FileUploadBox
        label="Parent 2 Passport/ID (Optional)"
        file={parentPassport2}
        fieldName="parentPassport2"
        inputRef={parent2InputRef}
      />
    </div>
  )
}
