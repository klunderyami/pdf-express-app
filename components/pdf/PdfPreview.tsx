'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FileText, X, AlertTriangle, CheckCircle2 } from 'lucide-react'

export interface PdfFile {
  file: File
  id: string
}

interface PdfPreviewProps {
  files: PdfFile[]
  onRemoveFile: (id: string) => void
  isLoading: boolean
  progress: number
  error: string | null
  success: boolean
}

export default function PdfPreview({
  files,
  onRemoveFile,
  isLoading,
  progress,
  error,
  success,
}: PdfPreviewProps) {
  const totalSizeMB = files.reduce((sum, f) => sum + f.file.size, 0) / (1024 * 1024)

  return (
    <>
      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6"
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Archivos seleccionados ({files.length})
            </h3>
            <div className="space-y-2">
              {files.map((fileObj) => (
                <div
                  key={fileObj.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="font-medium text-slate-900">{fileObj.file.name}</p>
                      <p className="text-sm text-slate-500">
                        {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveFile(fileObj.id)}
                    disabled={isLoading}
                    className="p-2 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-500 mt-3">
              Tamaño total: {totalSizeMB.toFixed(2)} MB
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Procesando PDF...</span>
              <span className="text-sm font-semibold text-primary-600">{progress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
              <div
                className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-3"
          >
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {success && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-3"
          >
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>¡PDF procesado exitosamente! Ahora puedes descargarlo.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}