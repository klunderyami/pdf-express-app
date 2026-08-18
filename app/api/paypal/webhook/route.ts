import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const PAYPAL_API_BASE = process.env.NODE_ENV === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface PayPalWebhookEvent {
  id: string
  event_type: string
  create_time: string
  resource_type: string
  event_version: string
  summary: string
  resource: any
  links: Array<{
    href: string
    rel: string
    method: string
  }>
}

async function verifyWebhookSignature(
  request: NextRequest,
  body: string
): Promise<boolean> {
  const transmissionId = request.headers.get('paypal-transmission-id')
  const transmissionTime = request.headers.get('paypal-transmission-time')
  const transmissionSig = request.headers.get('paypal-transmission-sig')
  const certUrl = request.headers.get('paypal-cert-url')
  const authAlgo = request.headers.get('paypal-auth-algo')
  const webhookId = process.env.PAYPAL_WEBHOOK_ID

  if (!transmissionId || !transmissionTime || !transmissionSig || !certUrl || !authAlgo) {
    console.error('Missing PayPal webhook headers')
    return false
  }

  if (!webhookId) {
    console.error('PAYPAL_WEBHOOK_ID not configured')
    return false
  }

  try {
    const clientId = process.env.PAYPAL_CLIENT_ID
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      console.error('PayPal credentials not configured')
      return false
    }

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

    const verifyBody = {
      transmission_id: transmissionId,
      transmission_time: transmissionTime,
      cert_url: certUrl,
      auth_algo: authAlgo,
      transmission_sig: transmissionSig,
      webhook_id: webhookId,
      webhook_event: JSON.parse(body),
    }

    const response = await fetch(`${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(verifyBody),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('PayPal webhook verification failed:', error)
      return false
    }

    const result = await response.json()
    return result.verification_status === 'SUCCESS'
  } catch (error) {
    console.error('Error verifying webhook signature:', error)
    return false
  }
}

async function handlePaymentCaptureCompleted(event: PayPalWebhookEvent) {
  const resource = event.resource
  const orderId = resource.supplementary_data?.related_ids?.order_id
  const captureId = resource.id
  const status = resource.status
  const amount = parseFloat(resource.amount?.value || '0')
  const currency = resource.amount?.currency_code || 'USD'
  const payerEmail = resource.payer?.email_address
  const payerId = resource.payer?.payer_id

  if (!orderId || !captureId || !payerEmail) {
    console.error('Missing required fields in webhook event:', { orderId, captureId, payerEmail })
    return
  }

  if (status !== 'COMPLETED') {
    console.log(`Payment capture not completed: ${status}`)
    return
  }

  const { data: existingSubscription, error: fetchError } = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .eq('paypal_order_id', orderId)
    .single()

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error fetching subscription:', fetchError)
    return
  }

  const now = new Date()
  let expiresAt: Date

  if (existingSubscription) {
    const planType = existingSubscription.plan_type
    if (planType === 'pass') {
      expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    } else {
      expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    }

    const { error: updateError } = await supabaseAdmin
      .from('subscriptions')
      .update({
        status: 'completed',
        paypal_capture_id: captureId,
        payer_email: payerEmail,
        payer_id: payerId,
        amount,
        currency,
        expires_at: expiresAt.toISOString(),
        updated_at: now.toISOString(),
      })
      .eq('paypal_order_id', orderId)

    if (updateError) {
      console.error('Error updating subscription:', updateError)
    } else {
      console.log(`Subscription updated via webhook: ${orderId}`)
    }
  } else {
    const planType = amount === 0.99 ? 'pass' : 'monthly'
    expiresAt = new Date(now.getTime() + (planType === 'pass' ? 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000))

    const { error: insertError } = await supabaseAdmin
      .from('subscriptions')
      .insert({
        paypal_order_id: orderId,
        paypal_capture_id: captureId,
        payer_email: payerEmail,
        payer_id: payerId,
        plan_type: planType,
        amount,
        currency,
        status: 'completed',
        expires_at: expiresAt.toISOString(),
      })

    if (insertError) {
      console.error('Error inserting subscription:', insertError)
    } else {
      console.log(`Subscription created via webhook: ${orderId}`)
    }
  }
}

async function handlePaymentCaptureDenied(event: PayPalWebhookEvent) {
  const resource = event.resource
  const orderId = resource.supplementary_data?.related_ids?.order_id

  if (!orderId) {
    console.error('Missing order_id in denial event')
    return
  }

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'failed',
      updated_at: new Date().toISOString(),
    })
    .eq('paypal_order_id', orderId)

  if (error) {
    console.error('Error updating subscription status to failed:', error)
  } else {
    console.log(`Subscription marked as failed: ${orderId}`)
  }
}

async function handlePaymentCaptureRefunded(event: PayPalWebhookEvent) {
  const resource = event.resource
  const captureId = resource.id
  const status = resource.status

  if (!captureId) {
    console.error('Missing capture_id in refund event')
    return
  }

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'refunded',
      updated_at: new Date().toISOString(),
    })
    .eq('paypal_capture_id', captureId)

  if (error) {
    console.error('Error updating subscription status to refunded:', error)
  } else {
    console.log(`Subscription marked as refunded: ${captureId}`)
  }
}

async function handlePaymentCaptureReversed(event: PayPalWebhookEvent) {
  const resource = event.resource
  const captureId = resource.id
  const status = resource.status

  if (!captureId) {
    console.error('Missing capture_id in reversal event')
    return
  }

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('paypal_capture_id', captureId)

  if (error) {
    console.error('Error updating subscription status to cancelled:', error)
  } else {
    console.log(`Subscription marked as cancelled: ${captureId}`)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const event = JSON.parse(body) as PayPalWebhookEvent

    console.log(`Received PayPal webhook: ${event.event_type}`)

    const isValid = await verifyWebhookSignature(request, body)

    if (!isValid) {
      console.error('Invalid webhook signature')
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      )
    }

    switch (event.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        await handlePaymentCaptureCompleted(event)
        break

      case 'PAYMENT.CAPTURE.DENIED':
        await handlePaymentCaptureDenied(event)
        break

      case 'PAYMENT.CAPTURE.REFUNDED':
        await handlePaymentCaptureRefunded(event)
        break

      case 'PAYMENT.CAPTURE.REVERSED':
        await handlePaymentCaptureReversed(event)
        break

      default:
        console.log(`Unhandled webhook event type: ${event.event_type}`)
    }

    return NextResponse.json(
      { received: true, eventType: event.event_type },
      { status: 200 }
    )
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { message: 'PayPal webhook endpoint', status: 'active' },
    { status: 200 }
  )
}