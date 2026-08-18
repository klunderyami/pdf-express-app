'use client'

import { useState, useCallback, useEffect } from 'react'
import { PDFDocument } from 'pdf-lib'

interface UsePdfOperationsReturn {
  isLoading: boolean
  error: string | null
  progress: number
  result: Blob | null
  resultUrl: string | null
  mergePdfs: (files: File[]) => Promise<void>
  compressPdf: (file: File) => Promise<void>
  extractPages: (file: File, pages: string) => Promise<void>
  reset: () => void
}

const COMPRESS_MAX_DIMENSION = 800

const createResultUrl = (blob: Blob): string => URL.createObjectURL(blob)

const validatePdf = async (file: File): Promise<boolean> => {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
    return pdfDoc.getPageCount() > 0
  } catch {
    return false
  }
}

export function usePdfOperations(): UsePdfOperationsReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<Blob | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)

  // Limpiar la URL del objeto cuando se genera un nuevo resultado o se desmonta
  useEffect(() => {
    return () => {
      if (resultUrl) {
        URL.revokeObjectURL(resultUrl)
      }
    }
  }, [resultUrl])

  const reset = useCallback(() => {
    setIsLoading(false)
    setError(null)
    setProgress(0)
    setResult(null)
    setResultUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
  }, [])

  const saveResult = useCallback((blob: Blob) => {
    setResult(blob)
    setResultUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return createResultUrl(blob)
    })
  }, [])

  const mergePdfs = useCallback(async (files: File[]) => {
    if (files.length === 0) {
      setError('Por favor, sube al menos un archivo PDF')
      return
    }

    reset()
    setIsLoading(true)
    setError(null)
    setProgress(5)

    try {
      // Validación de todos los archivos
      for (const file of files) {
        const isValid = await validatePdf(file)
        if (!isValid) {
          throw new Error(`El archivo ${file.name} está corrupto o no es un PDF válido`)
        }
      }

      setProgress(25)

      const mergedPdf = await PDFDocument.create()
      const totalFiles = files.length
      let processedFiles = 0

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices() as number[])
        pages.forEach((page) => mergedPdf.addPage(page))

        processedFiles++
        setProgress(25 + Math.round((processedFiles / totalFiles) * 60))
      }

      setProgress(90)
      const pdfBytes = await mergedPdf.save()
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' })
      saveResult(blob)
      setProgress(100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al unir los PDFs')
    } finally {
      setIsLoading(false)
    }
  }, [reset, saveResult])

  const compressPdf = useCallback(async (file: File) => {
    if (!file) {
      setError('Por favor, selecciona un archivo PDF')
      return
    }

    reset()
    setIsLoading(true)
    setError(null)
    setProgress(5)

    try {
      const isValid = await validatePdf(file)
      if (!isValid) {
        throw new Error('El archivo está corrupto o no es un PDF válido')
      }

      setProgress(25)

      const arrayBuffer = await file.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
      const outputPdf = await PDFDocument.create()
      const pageIndices = pdf.getPageIndices() as number[]
      const totalPages = pageIndices.length
      let processedPages = 0

      const pages = await outputPdf.copyPages(pdf, pageIndices)
      for (const page of pages) {
        const { width, height } = page.getSize()
        if (width > COMPRESS_MAX_DIMENSION || height > COMPRESS_MAX_DIMENSION) {
          const scale = Math.min(
            COMPRESS_MAX_DIMENSION / width,
            COMPRESS_MAX_DIMENSION / height
          )
          page.scaleContent(scale, scale)
        }
        outputPdf.addPage(page)

        processedPages++
        setProgress(25 + Math.round((processedPages / totalPages) * 60))
      }

      setProgress(90)
      const pdfBytes = await outputPdf.save()
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' })
      saveResult(blob)
      setProgress(100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al comprimir el PDF')
    } finally {
      setIsLoading(false)
    }
  }, [reset, saveResult])

  const extractPages = useCallback(async (file: File, pages: string) => {
    if (!file) {
      setError('Selecciona un archivo para extraer páginas')
      return
    }

    reset()
    setIsLoading(true)
    setError(null)
    setProgress(5)

    try {
      const isValid = await validatePdf(file)
      if (!isValid) {
        throw new Error('El archivo está corrupto o no es un PDF válido')
      }

      setProgress(25)

      const arrayBuffer = await file.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })

      const pageNumbers = pages
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

      setProgress(45)

      const outputPdf = await PDFDocument.create()
      const pageIndices = validPages.map((n) => n - 1)
      const copiedPages = await outputPdf.copyPages(pdf, pageIndices)
      copiedPages.forEach((page) => outputPdf.addPage(page))

      setProgress(80)
      const pdfBytes = await outputPdf.save()
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' })
      saveResult(blob)
      setProgress(100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al extraer páginas del PDF')
    } finally {
      setIsLoading(false)
    }
  }, [reset, saveResult])

  return {
    isLoading,
    error,
    progress,
    result,
    resultUrl,
    mergePdfs,
    compressPdf,
    extractPages,
    reset,
  }
}