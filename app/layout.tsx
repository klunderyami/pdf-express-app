import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import PayPalProvider from '@/components/PayPalProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'DocExpress - Procesador de PDFs Rápido y Seguro',
    template: '%s | DocExpress',
  },
  description:
    'Procesa tus PDFs localmente sin subirlos a la nube. Une, comprime y extrae páginas de forma rápida, segura y 100% privada en tu navegador.',
  keywords: [
    'procesar pdf',
    'unir pdf',
    'comprimir pdf',
    'extraer páginas pdf',
    'pdf online gratis',
    'pdf sin subir a la nube',
    'pdf privado',
    'herramienta pdf',
    'doc express',
    'procesador de documentos',
  ],
  applicationName: 'DocExpress',
  authors: [{ name: 'DocExpress' }],
  creator: 'DocExpress',
  publisher: 'DocExpress',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://docexpress.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://docexpress.app',
    siteName: 'DocExpress',
    title: 'DocExpress - Procesador de PDFs Rápido y Seguro',
    description:
      'Procesa tus PDFs localmente sin subirlos a la nube. Une, comprime y extrae páginas de forma rápida, segura y 100% privada en tu navegador.',
  },
  twitter: {
    card: 'summary',
    title: 'DocExpress - Procesador de PDFs Rápido y Seguro',
    description:
      'Procesa tus PDFs localmente sin subirlos a la nube. Une, comprime y extrae páginas de forma rápida, segura y 100% privada en tu navegador.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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