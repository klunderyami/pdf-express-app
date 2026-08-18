# Implementación de Backend - DocExpress

## Arquitectura de Seguridad

Este documento describe la implementación completa del backend para validación de pagos y gestión de suscripciones.

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

## Estructura de Archivos

```
pdf-express-app/
├── app/
│   └── api/
│       ├── paypal/
│       │   └── verify/
│       │       └── route.ts          # Verificación de pagos PayPal
│       └── auth/
│           └── check/
│               └── route.ts          # Verificación de suscripción activa
├── components/
│   ├── PaywallModal.tsx               # Modal de pago actualizado
│   └── PdfProcessor.tsx               # Procesador con verificación backend
├── lib/
│   └── supabase.ts                    # Cliente de Supabase
└── supabase/
    └── schema.sql                     # Esquema de base de datos
```

## Configuración de Variables de Entorno

### Archivo `.env.local`

```env
# PayPal Credentials
NEXT_PUBLIC_PAYPAL_CLIENT_ID=tu_client_id_sandbox_o_live
PAYPAL_CLIENT_SECRET=tu_client_secret

# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_publica
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_secreta
```

**Importante:**
- `NEXT_PUBLIC_*` - Variables públicas disponibles en el cliente
- `SUPABASE_SERVICE_ROLE_KEY` - Secreto, solo para backend (nunca exponer al cliente)

## Configuración de Supabase

### Paso 1: Ejecutar Schema SQL

1. Ve a tu proyecto en Supabase Dashboard
2. Navega a **SQL Editor**
3. Copia y ejecuta el contenido de `supabase/schema.sql`

Esto creará:
- Tabla `subscriptions` con RLS habilitado
- Índices para optimización
- Vista `active_subscriptions` para consultas rápidas
- Función `check_active_subscription()` para validación

### Paso 2: Obtener Credenciales

1. En Supabase Dashboard, ve a **Settings** → **API**
2. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY` (mantener en secreto)

## Configuración de PayPal

### Paso 1: Crear App en PayPal Developer

1. Ve a https://developer.paypal.com/dashboard/
2. Crea una nueva app o usa una existente
3. Copia:
   - **Client ID** → `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
   - **Secret** → `PAYPAL_CLIENT_SECRET`

### Paso 2: Configurar Webhooks (Opcional pero Recomendado)

Para mayor seguridad, configura webhooks en PayPal Developer Dashboard:

**URL del Webhook:**
```
https://tu-dominio.com/api/paypal/webhook
```

**Eventos a suscribir:**
- `PAYMENT.CAPTURE.COMPLETED`
- `PAYMENT.CAPTURE.DENIED`
- `PAYMENT.CAPTURE.REFUNDED`
- `PAYMENT.CAPTURE.REVERSED`

## Endpoints de API

### POST /api/paypal/verify

Verifica un pago de PayPal y crea/actualiza suscripción.

**Request:**
```json
{
  "orderId": "5O190127TN364715T",
  "planType": "pass",
  "expectedAmount": "0.99"
}
```

**Response Success (200):**
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

**Response Error (400/500):**
```json
{
  "error": "Amount mismatch",
  "expected": "0.99",
  "received": "1.99"
}
```

**Cookies Set:**
- `docexpress_session` (HttpOnly, Secure en producción)
  - Contiene: email, planType, expiresAt, orderId
  - Expira: 30 días

### GET /api/auth/check

Verifica si el usuario tiene suscripción activa.

**Response Success (200):**
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

**Response No Session (401):**
```json
{
  "isPro": false,
  "error": "No session found"
}
```

## Seguridad Implementada

### 1. Verificación de Pagos en Backend
- ✅ Validación de orden con API de PayPal
- ✅ Verificación de monto y moneda
- ✅ Confirmación de estado COMPLETED
- ✅ Comparación contra expectedAmount

### 2. Gestión de Sesiones
- ✅ Cookie HttpOnly (no accesible desde JavaScript)
- ✅ Cookie Secure en producción
- ✅ SameSite: lax para prevenir CSRF
- ✅ Validación de expiración en cada request
- ✅ Verificación contra base de datos

### 3. Base de Datos
- ✅ RLS (Row Level Security) habilitado
- ✅ Índices para consultas optimizadas
- ✅ Validación de constraints en SQL
- ✅ Trigger para updated_at automático

### 4. Prevención de Fraude
- ✅ No se confía en datos del cliente
- ✅ Verificación server-side de todos los pagos
- ✅ Monto esperado validado contra monto real
- ✅ orderID único (no se puede reutilizar)

## Despliegue

### Vercel (Recomendado)

1. **Variables de Entorno:**
   ```bash
   vercel env add NEXT_PUBLIC_PAYPAL_CLIENT_ID
   vercel env add PAYPAL_CLIENT_SECRET
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add SUPABASE_SERVICE_ROLE_KEY
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

### Netlify

1. Configura variables de entorno en dashboard
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Funciones serverless: `/app/api/*`

### Railway / Render

1. Conecta repositorio de GitHub
2. Configura variables de entorno
3. Deploy automático en push

## Testing

### Probar en Modo Sandbox

1. Usa credenciales de Sandbox de PayPal
2. Crea cuentas de prueba en https://developer.paypal.com/dashboard/
3. Realiza pagos de prueba ($0.99 y $3.99)
4. Verifica en Supabase que se guarde la suscripción

### Verificar en Supabase

```sql
-- Ver todas las suscripciones
SELECT * FROM subscriptions ORDER BY created_at DESC;

-- Ver suscripciones activas
SELECT * FROM active_subscriptions;

-- Verificar función de validación
SELECT check_active_subscription('usuario@ejemplo.com');
```

## Monitoreo

### Logs a Implementar

1. **PayPal Verification:**
   - Log de intentos de verificación
   - Errores de autenticación con PayPal
   - Montos recibidos vs esperados

2. **Suscripciones:**
   - Creación de nuevas suscripciones
   - Actualizaciones de estado
   - Expiración de accesos

3. **Errores:**
   - Fallos de base de datos
   - Timeouts en API de PayPal
   - Cookies inválidas

### Métricas a Trackear

- Tasa de conversión (visitas → pagos)
- Pago promedio
- Tasa de cancelación
- Tiempo de verificación de pago
- Errores de API

## Mantenimiento

### Tareas Periódicas

1. **Limpiar suscripciones expiradas** (opcional):
   ```sql
   -- Marcar como expiradas (opcional, la vista ya filtra)
   UPDATE subscriptions
   SET status = 'expired'
   WHERE expires_at < NOW() AND status = 'completed';
   ```

2. **Verificar webhooks de PayPal:**
   - Revisar logs de webhooks
   - Verificar que todos los eventos se procesen

3. **Auditar accesos Pro:**
   - Revisar suscripciones activas en Supabase
   - Verificar montos y fechas

## Troubleshooting

### Error: "PayPal credentials not configured"
- Verifica que `PAYPAL_CLIENT_ID` y `PAYPAL_CLIENT_SECRET` estén en `.env.local`
- Asegúrate de que sean las credenciales de backend (no las de frontend)

### Error: "Database error"
- Verifica que `SUPABASE_SERVICE_ROLE_KEY` sea correcta
- Asegúrate de haber ejecutado `schema.sql` en Supabase
- Verifica que la tabla `subscriptions` exista

### Cookie no se establece
- Verifica que el dominio coincida
- En desarrollo, usa `http://localhost:3000`
- En producción, usa `https://tu-dominio.com`
- Verifica que no haya extensiones bloqueando cookies

### Pago verificado pero no aparece en Supabase
- Verifica logs del servidor
- Asegúrate de que `SUPABASE_SERVICE_ROLE_KEY` tenga permisos de escritura
- Verifica que la tabla tenga RLS deshabilitado para service_role

## Próximos Pasos

1. **Webhooks de PayPal:**
   - Implementar endpoint `/api/paypal/webhook`
   - Procesar eventos de captura, cancelación, reembolso
   - Actualizar estado en Supabase automáticamente

2. **Suscripciones Recurrentes:**
   - Implementar PayPal Subscriptions API
   - Crear planes de suscripción en PayPal
   - Gestionar renovaciones automáticas

3. **Email Notifications:**
   - Enviar confirmación de pago por email
   - Recordatorios de expiración
   - Facturas automáticas

4. **Dashboard de Admin:**
   - Ver todas las suscripciones
   - Gestionar usuarios Pro
   - Ver métricas de ingresos

5. **Rate Limiting:**
   - Implementar límite de requests por IP
   - Prevenir abuso de API
   - Usar Upstash Redis o similar

## Notas de Producción

- **PayPal Live:** Cambia credenciales a modo Live antes de producción
- **HTTPS:** Asegúrate de que el sitio use HTTPS en producción
- **CORS:** Configura CORS si es necesario para llamadas API
- **Backup:** Configura backups automáticos de Supabase
- **Monitoring:** Implementa Sentry o similar para tracking de errores