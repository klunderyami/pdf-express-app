import Link from 'next/link'
import { FileQuestion, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="w-14 h-14 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center">
          <FileQuestion className="w-7 h-7 text-primary-600" />
        </div>

        <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-2">
          Error 404
        </p>

        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          Página no encontrada
        </h1>

        <p className="text-slate-600 leading-relaxed mb-8">
          La página que estás buscando no existe o ha sido movida. Verifica la URL
          o regresa al inicio para continuar procesando tus documentos.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
        >
          <Home className="w-4 h-4" />
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}