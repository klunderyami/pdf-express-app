'use client'

import { motion } from 'framer-motion'
import { Upload, Shield, Lock, Zap } from 'lucide-react'
import PdfProcessor from '@/components/PdfProcessor'

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
          <p className="text-center text-slate-500 text-sm">
            © 2024 DocExpress. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}