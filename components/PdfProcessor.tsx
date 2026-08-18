'use client'

import { useState, useCallback, useEffect } from 'react'
import { usePdfOperations } from '@/hooks/usePdfOperations'
import PdfDropzone from '@/components/pdf/PdfDropzone'
import PdfToolbar, { type Tool } from '@/components/pdf/PdfToolbar'
import PdfPreview, { type PdfFile } from '@/components/pdf/PdfPreview'
import PaywallModal from '@/components/PaywallModal'

const FREEMIUM_MAX_FILE_SIZE = 20 * 1024 * 1024 // 20 MB
const FREEMIUM_MAX_FILES = 3

export default function PdfProcessor() {
  const [files, setFiles] = useState<PdfFile[]>([])
  const [selectedTool, setSelectedTool] = useState<Tool>('merge')
  const [showPaywall, setShowPaywall] = useState(false)
  const [extractPages, setExtractPages] = useState<string>('')
  const [isPro, setIsPro] = useState(false)
  const [checkingSubscription, setCheckingSubscription] = useState(true)

  const {
    isLoading,
    error,
    progress,
    result,
    resultUrl,
    mergePdfs,
    compressPdf,
    extractPages: extractPagesOp,
    reset: resetResult,
  } = usePdfOperations()

  const checkSubscription = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/check')
      if (response.ok) {
        const data = await response.json()
        setIsPro(data.isPro)
      } else {
        setIsPro(false)
      }
    } catch (err) {
      console.error('Error checking subscription:', err)
      setIsPro(false)
    } finally {
      setCheckingSubscription(false)
    }
  }, [])

  useEffect(() => {
    checkSubscription()
  }, [checkSubscription])

  const handlePaymentSuccess = useCallback(() => {
    checkSubscription()
  }, [checkSubscription])

  const checkFreemiumLimit = useCallback(() => {
    if (isPro) return true

    const totalSize = files.reduce((sum, f) => sum + f.file.size, 0)

    if (files.length > FREEMIUM_MAX_FILES || totalSize > FREEMIUM_MAX_FILE_SIZE) {
      setShowPaywall(true)
      return false
    }
    return true
  }, [files, isPro])

  const handleFilesSelected = useCallback((uploadedFiles: File[]) => {
    const newFiles: PdfFile[] = uploadedFiles.map((file) => ({
      file,
      id: `${file.name}-${Date.now()}-${Math.random()}`,
    }))

    setFiles((prev) => [...prev, ...newFiles])
    resetResult()
  }, [resetResult])

  const removeFile = useCallback(
    (id: string) => {
      setFiles((prev) => prev.filter((f) => f.id !== id))
      resetResult()
    },
    [resetResult]
  )

  const handleProcess = useCallback(async () => {
    if (files.length === 0) {
      return
    }

    if (!checkFreemiumLimit()) return

    switch (selectedTool) {
      case 'merge':
        await mergePdfs(files.map((f) => f.file))
        break
      case 'compress':
        if (files.length === 0) return
        await compressPdf(files[0].file)
        break
      case 'extract':
        if (files.length === 0) return
        await extractPagesOp(files[0].file, extractPages)
        break
    }
  }, [files, selectedTool, extractPages, checkFreemiumLimit, mergePdfs, compressPdf, extractPagesOp])

  const handleDownload = useCallback(() => {
    if (!resultUrl) return

    const a = document.createElement('a')
    a.href = resultUrl
    a.download = `docexpress-${selectedTool}-${Date.now()}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }, [resultUrl, selectedTool])

  return (
    <div className="max-w-5xl mx-auto">
      <PdfToolbar
        selectedTool={selectedTool}
        onToolChange={setSelectedTool}
        canProcess={files.length > 0}
        canDownload={!!result}
        isProcessing={isLoading}
        isCheckingSubscription={checkingSubscription}
        isPro={isPro}
        extractPages={extractPages}
        onExtractPagesChange={setExtractPages}
        onProcess={handleProcess}
        onDownload={handleDownload}
      />

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <PdfDropzone
          onFilesSelected={handleFilesSelected}
          disabled={isLoading}
        />
      </div>

      <PdfPreview
        files={files}
        onRemoveFile={removeFile}
        isLoading={isLoading}
        progress={progress}
        error={error}
        success={!!result}
      />

      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  )
}