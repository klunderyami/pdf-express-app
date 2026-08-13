'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  FileText,
  Merge,
  Scissors,
  Download,
  X,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'
import { PDFDocument } from 'pdf-lib'
import PaywallModal from './PaywallModal'

interface PdfFile {
  file: File
  id: string
}

type Tool = 'merge' | 'compress' | 'extract'

export default function PdfProcessor() {
  const [files, setFiles] = useState<PdfFile[]>([])
  const [selectedTool, setSelectedTool] = useState<Tool>('merge')
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<Blob | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showPaywall, setShowPaywall] = useState(false)
  const [extractPages, setExtractPages] = useState<string>('')

  const isPro = () => {
    if (typeof window === 'undefined') return false
    const auth = localStorage.getItem('docexpress_pro')
    if (!auth) return false
    try {
      const { expiry } = JSON.parse(auth)
      return expiry > Date.now()
    } catch {
      return false
    }
  }

  const checkFreemiumLimit = useCallback(() => {
    if (isPro()) return true

    const totalSize = files.reduce((sum, f) => sum + f.file.size, 0)
    const maxSize = 20 * 1024 * 1024 // 20 MB

    if (files.length > 3 || totalSize > maxSize) {
      setShowPaywall(true)
      return false
    }
    return true
  }, [files])

  const handleFileUpload = useCallback((uploadedFiles: FileList | null) => {
    if (!uploadedFiles) return

    const pdfFiles = Array.from(uploadedFiles).filter((f) => f.type === 'application/pdf')
    const newFiles: PdfFile[] = pdfFiles.map((file) => ({
      file,
      id: `${file.name}-${Date.now()}-${Math.random()}`,
    }))

    setFiles((prev) => [...prev, ...newFiles])
    setError(null)
    setResult(null)
  }, [])

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
    setResult(null)
  }

  const validatePdf = async (file: File): Promise<boolean> => {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      return pdfDoc.getPageCount() > 0
    } catch {
      return false
    }
  }

  const processPdfs = async () => {
    if (files.length === 0) {
      setError('Por favor, sube al menos un archivo PDF')
      return
    }

    if (!checkFreemiumLimit()) return

    setProcessing(true)
    setError(null)
    setResult(null)

    try {
      // Validate all files
      for (const fileObj of files) {
        const isValid = await validatePdf(fileObj.file)
        if (!isValid) {
          throw new Error(`El archivo ${fileObj.file.name} está corrupto o no es un PDF válido`)
        }
      }

      let outputPdf: PDFDocument

      switch (selectedTool) {
        case 'merge':
          outputPdf = await mergePdfs(files.map((f) => f.file))
          break
        case 'compress':
          outputPdf = await compressPdfs(files.map((f) => f.file))
          break
        case 'extract':
          if (files.length === 0) {
            throw new Error('Selecciona al menos un archivo para extraer páginas')
          }
          outputPdf = await extractPagesFromPdf(files[0].file, extractPages)
          break
        default:
          throw new Error('Herramienta no válida')
      }

      const pdfBytes = await outputPdf.save()
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' })
      setResult(blob)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar los PDFs')
    } finally {
      setProcessing(false)
    }
  }

  const mergePdfs = async (pdfFiles: File[]): Promise<PDFDocument> => {
    const mergedPdf = await PDFDocument.create()

    for (const file of pdfFiles) {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer)
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices() as number[])
      pages.forEach((page) => mergedPdf.addPage(page))
    }

    return mergedPdf
  }

  const compressPdfs = async (pdfFiles: File[]): Promise<PDFDocument> => {
    const mergedPdf = await PDFDocument.create()

    for (const file of pdfFiles) {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer)
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices() as number[])

      pages.forEach((page) => {
        const { width, height } = page.getSize()
        if (width > 800 || height > 800) {
          const scale = Math.min(800 / width, 800 / height)
          page.scaleContent(scale)
        }
        mergedPdf.addPage(page)
      })
    }

    return mergedPdf
  }

  const extractPagesFromPdf = async (file: File, pagesStr: string): Promise<PDFDocument> => {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer)
    const outputPdf = await PDFDocument.create()

    const pageNumbers = pagesStr
      .split(',')
      .map((p) => parseInt(p.trim()))
      .filter((n) => !isNaN(n) && n > 0)

    if (pageNumbers.length === 0) {
      throw new Error('Por favor, ingresa números de página válidos (ej: 1,2,3)')
    }

    const totalPages = pdf.getPageCount()
    const validPages = pageNumbers.filter((n) => n <= totalPages)

    if (validPages.length === 0) {
      throw new Error(`El PDF solo tiene ${totalPages} páginas`)
    }

    const pageIndices = validPages.map((n) => n - 1)
    const pages = await outputPdf.copyPages(pdf, pageIndices)
    pages.forEach((page) => outputPdf.addPage(page))

    return outputPdf
  }

  const downloadResult = () => {
    if (!result) return

    const url = URL.createObjectURL(result)
    const a = document.createElement('a')
    a.href = url
    a.download = `docexpress-${selectedTool}-${Date.now()}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleFileUpload(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Tool Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Selecciona una herramienta</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ToolButton
            icon={<Merge className="w-5 h-5" />}
            label="Unir PDFs"
            active={selectedTool === 'merge'}
            onClick={() => setSelectedTool('merge')}
          />
          <ToolButton
            icon={<Scissors className="w-5 h-5" />}
            label="Comprimir PDF"
            active={selectedTool === 'compress'}
            onClick={() => setSelectedTool('compress')}
          />
          <ToolButton
            icon={<FileText className="w-5 h-5" />}
            label="Extraer Páginas"
            active={selectedTool === 'extract'}
            onClick={() => setSelectedTool('extract')}
          />
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-primary-500 transition-colors cursor-pointer"
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
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors cursor-pointer"
          >
            Seleccionar archivos
          </label>
        </div>

        {/* Extract Pages Input */}
        {selectedTool === 'extract' && files.length > 0 && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Páginas a extraer (ej: 1,2,3)
            </label>
            <input
              type="text"
              value={extractPages}
              onChange={(e) => setExtractPages(e.target.value)}
              placeholder="1,2,3"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        )}
      </div>

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
                    onClick={() => removeFile(fileObj.id)}
                    className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
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
        {result && (
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

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={processPdfs}
          disabled={processing || files.length === 0}
          className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {processing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <Merge className="w-5 h-5" />
              Procesar PDF
            </>
          )}
        </button>

        <button
          onClick={downloadResult}
          disabled={!result}
          className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          Descargar Resultado
        </button>
      </div>

      {/* Paywall Modal */}
      <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />
    </div>
  )
}

function ToolButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
        active
          ? 'border-primary-500 bg-primary-50 text-primary-700'
          : 'border-slate-200 hover:border-slate-300 text-slate-700'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  )
}