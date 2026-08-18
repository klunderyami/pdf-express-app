'use client'

import { Merge, Scissors, FileText, Download, Lock, Loader2 } from 'lucide-react'

export type Tool = 'merge' | 'compress' | 'extract'

interface PdfToolbarProps {
  selectedTool: Tool
  onToolChange: (tool: Tool) => void
  canProcess: boolean
  canDownload: boolean
  isProcessing: boolean
  isCheckingSubscription: boolean
  isPro: boolean
  extractPages: string
  onExtractPagesChange: (value: string) => void
  onProcess: () => void
  onDownload: () => void
}

interface ToolOption {
  id: Tool
  label: string
  icon: React.ReactNode
}

const TOOLS: ToolOption[] = [
  { id: 'merge', label: 'Unir PDFs', icon: <Merge className="w-5 h-5" /> },
  { id: 'compress', label: 'Comprimir PDF', icon: <Scissors className="w-5 h-5" /> },
  { id: 'extract', label: 'Extraer Páginas', icon: <FileText className="w-5 h-5" /> },
]

export default function PdfToolbar({
  selectedTool,
  onToolChange,
  canProcess,
  canDownload,
  isProcessing,
  isCheckingSubscription,
  isPro,
  extractPages,
  onExtractPagesChange,
  onProcess,
  onDownload,
}: PdfToolbarProps) {
  return (
    <>
      {/* Tool Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Selecciona una herramienta</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TOOLS.map((tool) => {
            const isActive = selectedTool === tool.id
            return (
              <button
                key={tool.id}
                onClick={() => onToolChange(tool.id)}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                  isActive
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                {tool.icon}
                <span className="font-medium">{tool.label}</span>
                {!isPro && (
                  <Lock className="w-4 h-4 text-slate-400 ml-auto" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Extract Pages Input */}
      {selectedTool === 'extract' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Páginas a extraer (ej: 1,2,3)
          </label>
          <input
            type="text"
            value={extractPages}
            onChange={(e) => onExtractPagesChange(e.target.value)}
            placeholder="1,2,3"
            disabled={isProcessing}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onProcess}
          disabled={!canProcess || isProcessing || isCheckingSubscription}
          className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Procesando...
            </>
          ) : isCheckingSubscription ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Verificando acceso...
            </>
          ) : (
            <>
              <Merge className="w-5 h-5" />
              Procesar PDF
            </>
          )}
        </button>

        <button
          onClick={onDownload}
          disabled={!canDownload || isProcessing}
          className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          Descargar Resultado
        </button>
      </div>
    </>
  )
}