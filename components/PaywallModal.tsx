'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Zap, Loader2 } from 'lucide-react'
import { PayPalButtons } from '@paypal/react-paypal-js'

interface PaywallModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function PaywallModal({ isOpen, onClose, onSuccess }: PaywallModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'pass' | 'monthly'>('pass')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleApprove = async (data: { orderID: string }) => {
    setProcessing(true)
    setError(null)

    try {
      const response = await fetch('/api/paypal/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: data.orderID,
          planType: selectedPlan,
          expectedAmount: selectedPlan === 'pass' ? '0.99' : '3.99',
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error al verificar el pago')
      }

      if (result.success) {
        onSuccess()
        onClose()
      } else {
        throw new Error(result.error || 'Error en el pago')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el pago')
      console.error('Payment error:', err)
    } finally {
      setProcessing(false)
    }
  }

  const handleError = (err: any) => {
    console.error('PayPal error:', err)
    setError('Error en el sistema de pagos. Por favor, intenta de nuevo.')
    setProcessing(false)
  }

  const handleCancel = () => {
    setProcessing(false)
    setError(null)
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
                disabled={processing}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
                >
                  <p className="text-sm">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Plans */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Urgency Pass */}
                <div
                  onClick={() => !processing && setSelectedPlan('pass')}
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                    selectedPlan === 'pass'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-slate-200 hover:border-slate-300'
                  } ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                  onClick={() => !processing && setSelectedPlan('monthly')}
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                    selectedPlan === 'monthly'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-slate-200 hover:border-slate-300'
                  } ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                {processing ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-600 mr-3" />
                    <span className="text-slate-700 font-medium">Verificando pago...</span>
                  </div>
                ) : (
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
                )}
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