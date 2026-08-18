-- Tabla de suscripciones/transacciones de DocExpress
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  paypal_order_id TEXT UNIQUE NOT NULL,
  paypal_capture_id TEXT UNIQUE,
  payer_email TEXT NOT NULL,
  payer_id TEXT,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('pass', 'monthly')),
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled', 'refunded')),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_subscriptions_paypal_order_id ON subscriptions(paypal_order_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_payer_email ON subscriptions(payer_email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_expires_at ON subscriptions(expires_at);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Política RLS (Row Level Security)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura de suscripciones activas por email
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions
  FOR SELECT
  USING (payer_email = auth.jwt()->>'email');

-- Política para permitir inserción (solo desde backend/service_role)
CREATE POLICY "Service role can insert subscriptions"
  ON subscriptions
  FOR INSERT
  WITH CHECK (true);

-- Política para permitir actualización (solo desde backend/service_role)
CREATE POLICY "Service role can update subscriptions"
  ON subscriptions
  FOR UPDATE
  USING (true);

-- Vista para suscripciones activas (para consultas rápidas)
CREATE OR REPLACE VIEW active_subscriptions AS
SELECT
  payer_email,
  plan_type,
  expires_at,
  CASE
    WHEN expires_at > NOW() THEN true
    ELSE false
  END AS is_active
FROM subscriptions
WHERE status = 'completed'
  AND expires_at > NOW();

-- Función para verificar si un usuario tiene suscripción activa
CREATE OR REPLACE FUNCTION check_active_subscription(p_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM subscriptions
    WHERE payer_email = p_email
      AND status = 'completed'
      AND expires_at > NOW()
  );
END;
$$ LANGUAGE plpgsql STABLE;