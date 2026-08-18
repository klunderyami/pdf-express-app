import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Subscription = {
  id: string
  paypal_order_id: string
  paypal_capture_id: string | null
  payer_email: string
  payer_id: string | null
  plan_type: 'pass' | 'monthly'
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded'
  expires_at: string
  created_at: string
  updated_at: string
}

export type ActiveSubscription = {
  payer_email: string
  plan_type: 'pass' | 'monthly'
  expires_at: string
  is_active: boolean
}