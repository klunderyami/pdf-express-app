'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Zap } from 'lucide-react'
import { PayPalButtons } from '@paypal/react-paypal-js'

interface PaywallModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PaywallModal({ isOpen, onClose }: PaywallModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'pass' | 'monthly'>('pass')
  const [processing, setProcessing] = useState(false)

  const handleApprove = async (data: any) => {
    // Simulación de aprobación de pago
    // En producción, aquí verificarías el pago con tu backend
    console.log('Pago aprobado:', data)

    // Guardar autorización en localStorage
    const auth = {
      expiry: Date.now() + (selectedPlan === 'pass' ? 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000),
      plan: selectedPlan,
    }

    localStorage.setItem('docexpress_pro', JSON.stringify(auth))
    setProcessing(false)
    onClose()
  }

  const handleError = (err: any) => {
    console.error('Error en el pago:', err)
    setProcessing(false)
  }

  const handleCancel = () => {
    setProcessing(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Desbloquea DocExpress Pro</h2>
                <p className="text-slate-600 mt-1">Procesa archivos sin límites</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Plans */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Urgency Pass */}
                <div
                  onClick={() => setSelectedPlan('pass')}
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                    selectedPlan === 'pass'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Pase de Urgencia</h3>
                      <p className="text-sm text-slate-600 mt-1">24 horas de acceso</p>
                    </div>
                    <Zap className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-slate-900">$0.99</span>
                    <span className="text-slate-600 ml-2">USD</span>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-slate-700">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Procesamiento ilimitado</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-700">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Sin límite de archivos</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-700">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Acceso 24 horas</span>
                    </li>
                  </ul>
                </div>

                {/* Monthly Plan */}
                <div
                  onClick={() => setSelectedPlan('monthly')}
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                    selectedPlan === 'monthly'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Membresía Pro</h3>
                      <p className="text-sm text-slate-600 mt-1">Acceso mensual</p>
                    </div>
                    <div className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                      POPULAR
                    </div>
                  </div>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-slate-900">$3.99</span>
                    <span className="text-slate-600 ml-2">USD/mes</span>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-slate-700">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Procesamiento ilimitado</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-700">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Sin límite de archivos</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-700">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Acceso 30 días</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-700">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Soporte prioritario</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* PayPal Buttons */}
              <div className="border-t border-slate-200 pt-6">
                <PayPalButtons
                    style={{
                      layout: 'vertical',
                      color: 'blue',
                      shape: 'rect',
                      label: 'pay',
                    }}
                    disabled={processing}
                    forceReRender={[selectedPlan, processing]}
                    fundingSource={undefined}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        intent: 'CAPTURE',
                        purchase_units: [
                          {
                            description:
                              selectedPlan === 'pass'
                                ? 'DocExpress - Pase de 24 horas'
                                : 'DocExpress Pro - Membresía mensual',
                            amount: {
                              currency_code: 'USD',
                              value: selectedPlan === 'pass' ? '0.99' : '3.99',
                            },
                          },
                        ],
                      })
                    }}
                    onApprove={handleApprove}
                    onError={handleError}
                    onCancel={handleCancel}
                  />
              </div>

              {/* Security Note */}
              <p className="text-xs text-slate-500 text-center mt-4">
                Pago seguro procesado por PayPal. Tus datos están protegidos.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}