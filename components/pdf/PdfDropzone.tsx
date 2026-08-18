'use client'

import { useCallback, useState } from 'react'
import { Upload } from 'lucide-react'

interface PdfDropzoneProps {
  onFilesSelected: (files: File[]) => void
  disabled?: boolean
}

export default function PdfDropzone({ onFilesSelected, disabled = false }: PdfDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragActive(false)
      if (disabled) return

      const pdfFiles = Array.from(e.dataTransfer.files).filter(
        (f) => f.type === 'application/pdf'
      )
      if (pdfFiles.length > 0) {
        onFilesSelected(pdfFiles)
      }
    },
    [disabled, onFilesSelected]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) setIsDragActive(true)
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragActive(false)
  }, [])

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []).filter(
        (f) => f.type === 'application/pdf'
      )
      if (selectedFiles.length > 0) {
        onFilesSelected(selectedFiles)
      }
      e.target.value = ''
    },
    [onFilesSelected]
  )

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
        isDragActive
          ? 'border-primary-500 bg-primary-50'
          : 'border-slate-300 hover:border-primary-500'
      } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
      <p className="text-lg font-medium text-slate-700 mb-2">
        Arrastra y suelta tus archivos PDF aquí
      </p>
      <p className="text-sm text-slate-500 mb-4">o haz clic para seleccionar archivos</p>
      <input
        type="file"
        multiple
        accept="application/pdf"
        onChange={handleFileInput}
        disabled={disabled}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className={`inline-block bg-primary-600 text-white px-6 py-2 rounded-lg font-medium transition-colors ${
          disabled
            ? 'bg-slate-400 cursor-not-allowed'
            : 'hover:bg-primary-700 cursor-pointer'
        }`}
      >
        Seleccionar archivos
      </label>
    </div>
  )
}