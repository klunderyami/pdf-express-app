'use client'

import { useEffect } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Registrar el error en la consola para diagnóstico en producción
    console.error('Error global capturado:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="w-14 h-14 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-red-600" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-3">
          Algo salió mal al procesar tu solicitud
        </h1>

        <p className="text-slate-600 leading-relaxed mb-6">
          Ocurrió un error inesperado. No te preocupes, tus documentos no se han
          visto afectados. Intenta nuevamente o vuelve a la página principal.
        </p>

        {error.digest && (
          <p className="text-xs text-slate-400 mb-6 font-mono">
            Código de referencia: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reintentar
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  )
}