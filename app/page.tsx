'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Shield, Lock, Zap } from 'lucide-react'

const PdfProcessor = dynamic(() => import('@/components/PdfProcessor'), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4" />
      <p className="text-slate-600 font-medium">Cargando herramientas PDF...</p>
    </div>
  ),
})

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 mb-6">
              DocExpress
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Procesa tus PDFs al instante. 100% en tu navegador, sin subir archivos a servidores.
            </p>

            {/* Security Badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                <Shield className="w-4 h-4" />
                <span>100% Seguro</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                <Lock className="w-4 h-4" />
                <span>Sin registros obligatorios</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                <Zap className="w-4 h-4" />
                <span>Procesamiento ultrarrápido</span>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Content - PDF Processor */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <PdfProcessor />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-center text-slate-500 text-sm">
              © 2024 DocExpress. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="/terms"
                className="text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors"
              >
                Términos de Servicio
              </a>
              <a
                href="/privacy"
                className="text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors"
              >
                Política de Privacidad
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}