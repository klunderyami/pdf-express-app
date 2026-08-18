# DocExpress - Procesador de PDFs 100% Cliente

DocExpress es una aplicación web completa (Micro-SaaS) para procesamiento de documentos PDF que funciona 100% en el navegador del cliente, con sistema de pagos seguro y verificación backend.

## Características

- **100% Client-side**: Todos los archivos se procesan en el navegador del usuario
- **Sin registro obligatorio**: No requiere crear cuenta para usar
- **Seguridad máxima**: Los archivos nunca salen del navegador
- **Pagos verificados**: Integración segura con PayPal y Supabase
- **Herramientas PDF**:
  - Unir múltiples PDFs en uno solo
  - Comprimir PDFs reduciendo la resolución
  - Extraer páginas específicas de un PDF
- **Modelo Freemium**:
  - Gratis: Hasta 3 archivos o 20 MB totales
  - Pro: Procesamiento ilimitado con PayPal

## Tecnologías

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS + Lucide Icons
- **Procesamiento PDF**: pdf-lib
- **Pagos**: PayPal SDK (@paypal/react-paypal-js)
- **Backend**: Next.js API Routes
- **Base de Datos**: Supabase (PostgreSQL)
- **Animaciones**: Framer Motion

## Arquitectura de Seguridad

### Flujo de Pago Seguro

```
1. Usuario selecciona plan en PaywallModal
2. PayPal SDK crea orden de pago (client-side)
3. Usuario completa pago en PayPal
4. PayPal devuelve orderID al frontend
5. Frontend envía orderID a /api/paypal/verify
6. Backend verifica pago con API de PayPal
7. Backend guarda/actualiza suscripción en Supabase
8. Backend establece cookie HttpOnly con sesión
9. Frontend recibe confirmación y actualiza UI
```

### Componentes de Seguridad

- ✅ Verificación server-side de pagos con PayPal API
- ✅ Cookie HttpOnly para sesión (no accesible desde JavaScript)
- ✅ Base de datos como fuente de verdad (Supabase)
- ✅ Middleware para protección de rutas
- ✅ Webhooks para sincronización de estados
- ✅ Validación de montos y moneda en backend

## Estructura del Proyecto

```
pdf-express-app/
├── app/
│   ├── api/
│   │   ├── paypal/
│   │   │   ├── verify/
│   │   │   │   └── route.ts          # Verificación de pagos PayPal
│   │   │   └── webhook/
│   │   │       └── route.ts          # Webhooks de PayPal
│   │   └── auth/
│   │       └── check/
│   │           └── route.ts          # Verificación de suscripción
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── PdfProcessor.tsx               # Componente principal de procesamiento
│   ├── PaywallModal.tsx               # Modal de pago PayPal
│   └── PayPalProvider.tsx             # Provider de PayPal SDK
├── lib/
│   └── supabase.ts                    # Cliente de Supabase
├── supabase/
│   ├── schema.sql                     # Esquema de base de datos
│   └── IMPLEMENTATION.md              # Documentación de implementación
├── middleware.ts                       # Middleware de Next.js
├── .env.local                         # Variables de entorno (NO commitear)
├── .env.local.example                 # Ejemplo de variables de entorno
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/klunderyami/pdf-express-app.git
cd pdf-express-app
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ve a **SQL Editor** en el dashboard
3. Ejecuta el contenido de `supabase/schema.sql`
4. Ve a **Settings** → **API** y copia:
   - Project URL
   - anon public key
   - service_role secret key

### 4. Configurar PayPal

1. Ve a [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Crea una aplicación
3. Copia tu **Client ID** y **Secret**
4. (Opcional) Configura webhooks para sincronización automática

### 5. Configurar variables de entorno

Crea un archivo `.env.local` basado en `.env.local.example`:

```env
# PayPal Credentials
NEXT_PUBLIC_PAYPAL_CLIENT_ID=tu_client_id
PAYPAL_CLIENT_SECRET=tu_client_secret
PAYPAL_WEBHOOK_ID=tu_webhook_id

# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

### 6. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Uso de la Aplicación

### Modo Gratis (Freemium)
- Hasta 3 archivos PDF por sesión
- Máximo 20 MB totales
- Acceso a todas las herramientas

### Modo Pro (Pago)
- **Pase de 24 horas**: $0.99 USD
- **Membresía mensual**: $3.99 USD/mes
- Procesamiento ilimitado
- Sin restricciones de archivos o tamaño

## API Endpoints

### POST /api/paypal/verify
Verifica un pago de PayPal y crea/actualiza suscripción en Supabase.

**Request:**
```json
{
  "orderId": "5O190127TN364715T",
  "planType": "pass",
  "expectedAmount": "0.99"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "email": "usuario@ejemplo.com",
    "planType": "pass",
    "expiresAt": "2024-01-15T10:30:00.000Z",
    "orderId": "5O190127TN364715T",
    "captureId": "2GG279541U471931P"
  }
}
```

**Cookies Set:**
- `docexpress_session` (HttpOnly, Secure en producción)

### GET /api/auth/check
Verifica si el usuario tiene suscripción activa.

**Response:**
```json
{
  "isPro": true,
  "data": {
    "email": "usuario@ejemplo.com",
    "planType": "monthly",
    "expiresAt": "2024-02-15T10:30:00.000Z",
    "orderId": "5O190127TN364715T"
  }
}
```

### POST /api/paypal/webhook
Recibe eventos de PayPal para sincronización de estados.

**Eventos soportados:**
- `PAYMENT.CAPTURE.COMPLETED`
- `PAYMENT.CAPTURE.DENIED`
- `PAYMENT.CAPTURE.REFUNDED`
- `PAYMENT.CAPTURE.REVERSED`

## Configuración de Webhooks de PayPal

Para sincronización automática de pagos, configura webhooks en PayPal Developer Dashboard:

**URL del Webhook:**
```
https://tu-dominio.com/api/paypal/webhook
```

**Eventos a suscribir:**
- `PAYMENT.CAPTURE.COMPLETED` - Pago completado
- `PAYMENT.CAPTURE.DENIED` - Pago denegado
- `PAYMENT.CAPTURE.REFUNDED` - Reembolso
- `PAYMENT.CAPTURE.REVERSED` - Reversión

## Despliegue

### Vercel (Recomendado)

1. Sube el código a GitHub
2. Importa el proyecto en [Vercel](https://vercel.com)
3. Agrega las variables de entorno:
   - `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
   - `PAYPAL_CLIENT_SECRET`
   - `PAYPAL_WEBHOOK_ID`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Despliega

### Netlify

1. Sube el código a GitHub
2. Importa el proyecto en [Netlify](https://netlify.com)
3. Configura:
   - Build command: `npm run build`
   - Directorio de publicación: `.next`
4. Agrega las variables de entorno

### Railway / Render

1. Conecta repositorio de GitHub
2. Configura variables de entorno
3. Deploy automático en push

## Notas de Producción

1. **PayPal Live**: Cambia el Client ID y Secret a tu cuenta de PayPal Live
2. **HTTPS**: Asegúrate de que el sitio use HTTPS en producción
3. **Webhooks**: Configura webhooks en PayPal para sincronización automática
4. **Dominios autorizados**: Configura los dominios permitidos en PayPal Developer Dashboard
5. **Backup**: Configura backups automáticos de Supabase

## Solución de Problemas

### Error: "PayPal credentials not configured"
- Verifica que `PAYPAL_CLIENT_ID` y `PAYPAL_CLIENT_SECRET` estén en `.env.local`

### Error: "Database error"
- Verifica que `SUPABASE_SERVICE_ROLE_KEY` sea correcta
- Asegúrate de haber ejecutado `schema.sql` en Supabase

### Cookie no se establece
- Verifica que el dominio coincida
- En desarrollo usa `http://localhost:3000`
- En producción usa `https://tu-dominio.com`

### Webhook no funciona
- Verifica que la URL del webhook sea accesible públicamente
- Asegúrate de que `PAYPAL_WEBHOOK_ID` esté configurado
- Verifica los logs del servidor para errores

## Licencia

© 2024 DocExpress. Todos los derechos reservados.

## Soporte

Para reportar bugs o solicitar características, contacta al equipo de desarrollo.