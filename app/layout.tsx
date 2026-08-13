import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import PayPalProvider from '@/components/PayPalProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DocExpress - Procesador de PDFs Rápido y Seguro',
  description: 'Procesa tus documentos PDF 100% en el navegador. Une, comprime y extrae páginas de forma rápida y segura.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ''

  return (
    <html lang="es">
      <body className={inter.className}>
        <PayPalProvider>
          {children}
        </PayPalProvider>
      </body>
    </html>
  )
}