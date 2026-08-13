# DocExpress - Procesador de PDFs 100% Cliente

DocExpress es una aplicación web completa (Micro-SaaS) para procesamiento de documentos PDF que funciona 100% en el navegador del cliente, sin necesidad de backend o servidor central.

## Características

- **100% Client-side**: Todos los archivos se procesan en el navegador del usuario
- **Sin registro obligatorio**: No requiere crear cuenta para usar
- **Seguridad máxima**: Los archivos nunca salen del navegador
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
- **Animaciones**: Framer Motion

## Estructura del Proyecto

```
pdf-express-app/
├── app/
│   ├── globals.css          # Estilos globales de Tailwind
│   ├── layout.tsx           # Layout principal con PayPal Provider
│   └── page.tsx             # Página principal (Hero + Processor)
├── components/
│   ├── PdfProcessor.tsx     # Componente principal de procesamiento
│   └── PaywallModal.tsx     # Modal de pago PayPal
├── .env.local               # Variables de entorno (NO commitear)
├── .env.local.example       # Ejemplo de variables de entorno
├── .gitignore               # Archivos ignorados por Git
├── next.config.js           # Configuración de Next.js
├── package.json             # Dependencias del proyecto
├── postcss.config.js        # Configuración de PostCSS
├── tailwind.config.ts       # Configuración de Tailwind
└── tsconfig.json            # Configuración de TypeScript
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

### 3. Configurar PayPal

1. Ve a [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Crea una aplicación o usa una existente
3. Copia tu **Client ID** (modo Sandbox para pruebas)
4. Abre el archivo `.env.local` y reemplaza el valor:

```env
NEXT_PUBLIC_PAYPAL_CLIENT_ID=tu_client_id_real_aqui
```

**Nota**: Para pruebas, usa el Client ID de Sandbox. Para producción, cambia a tu Client ID de Live.

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 5. Construir para producción

```bash
npm run build
npm run start
```

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

## Límites del Modo Freemium

El sistema detecta automáticamente cuando se superan los límites gratuitos:
- Más de 3 archivos subidos
- Más de 20 MB en total

Al superar estos límites, se abre automáticamente el modal de pago PayPal.

## Almacenamiento de Autorización

Las autorizaciones Pro se guardan en `localStorage` del navegador:
- **Pase de 24h**: Expira en 24 horas desde la compra
- **Membresía mensual**: Expira en 30 días desde la compra

Para testing, puedes eliminar la clave `docexpress_pro` de localStorage para volver al modo gratis.

## Despliegue

### Vercel (Recomendado)

1. Sube el código a GitHub
2. Importa el proyecto en [Vercel](https://vercel.com)
3. Agrega la variable de entorno `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
4. Despliega

### Netlify

1. Sube el código a GitHub
2. Importa el proyecto en [Netlify](https://netlify.com)
3. Configura el comando de build: `npm run build`
4. Directorio de publicación: `.next`
5. Agrega la variable de entorno

## Notas de Producción

1. **PayPal Live**: Cambia el Client ID a tu cuenta de PayPal Live
2. **Verificación de pagos**: Actualmente el pago se simula. En producción, implementa verificación del lado del servidor
3. **Dominios autorizados**: Configura los dominios permitidos en PayPal Developer Dashboard
4. **Webhooks**: Considera implementar webhooks de PayPal para verificar pagos

## Solución de Problemas

### Error: "No se encuentra el módulo..."
```bash
npm install
```

### PayPal no carga
- Verifica que el Client ID sea correcto
- Asegúrate de que el dominio esté autorizado en PayPal
- Revisa la consola del navegador para errores específicos

### PDFs corruptos
- La aplicación valida cada PDF antes de procesarlo
- Si un archivo está corrupto, se mostrará un mensaje de error

## Licencia

© 2024 DocExpress. Todos los derechos reservados.

## Soporte

Para reportar bugs o solicitar características, contacta al equipo de desarrollo.