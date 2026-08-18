import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const PAYPAL_API_BASE = process.env.NODE_ENV === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface PayPalOrderResponse {
  id: string
  status: string
  purchase_units: Array<{
    reference_id: string
    amount: {
      currency_code: string
      value: string
    }
    payments: {
      captures: Array<{
        id: string
        status: string
        amount: {
          currency_code: string
          value: string
        }
        create_time: string
        update_time: string
      }>
    }
  }>
  payer: {
    email_address: string
    payer_id: string
  }
}

async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured')
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('PayPal auth error:', error)
    throw new Error('Failed to authenticate with PayPal')
  }

  const data = await response.json()
  return data.access_token
}

async function verifyPayPalOrder(orderId: string, accessToken: string): Promise<PayPalOrderResponse> {
  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('PayPal order verification error:', error)
    throw new Error('Failed to verify PayPal order')
  }

  return response.json()
}

function calculateExpiryDate(planType: string): Date {
  const now = new Date()
  if (planType === 'pass') {
    return new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 horas
  } else if (planType === 'monthly') {
    return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 días
  }
  throw new Error('Invalid plan type')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, planType, expectedAmount } = body

    if (!orderId || !planType || !expectedAmount) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, planType, expectedAmount' },
        { status: 400 }
      )
    }

    const validPlanTypes = ['pass', 'monthly']
    if (!validPlanTypes.includes(planType)) {
      return NextResponse.json(
        { error: 'Invalid plan type' },
        { status: 400 }
      )
    }

    const accessToken = await getPayPalAccessToken()
    const order = await verifyPayPalOrder(orderId, accessToken)

    if (order.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Order not completed', status: order.status },
        { status: 400 }
      )
    }

    const purchaseUnit = order.purchase_units[0]
    if (!purchaseUnit) {
      return NextResponse.json(
        { error: 'No purchase units found' },
        { status: 400 }
      )
    }

    const capture = purchaseUnit.payments?.captures?.[0]
    if (!capture) {
      return NextResponse.json(
        { error: 'No payment capture found' },
        { status: 400 }
      )
    }

    if (capture.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Payment capture not completed', status: capture.status },
        { status: 400 }
      )
    }

    const paidAmount = parseFloat(capture.amount.value)
    const expectedAmountNum = parseFloat(expectedAmount)

    if (paidAmount !== expectedAmountNum) {
      return NextResponse.json(
        {
          error: 'Amount mismatch',
          expected: expectedAmount,
          received: capture.amount.value
        },
        { status: 400 }
      )
    }

    if (capture.amount.currency_code !== 'USD') {
      return NextResponse.json(
        { error: 'Invalid currency', currency: capture.amount.currency_code },
        { status: 400 }
      )
    }

    const payerEmail = order.payer.email_address
    const payerId = order.payer.payer_id
    const expiresAt = calculateExpiryDate(planType)

    const { data: existingSubscription, error: fetchError } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('paypal_order_id', orderId)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching subscription:', fetchError)
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      )
    }

    if (existingSubscription) {
      const { error: updateError } = await supabaseAdmin
        .from('subscriptions')
        .update({
          status: 'completed',
          paypal_capture_id: capture.id,
          payer_email: payerEmail,
          payer_id: payerId,
          plan_type: planType,
          amount: paidAmount,
          currency: capture.amount.currency_code,
          expires_at: expiresAt.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('paypal_order_id', orderId)

      if (updateError) {
        console.error('Error updating subscription:', updateError)
        return NextResponse.json(
          { error: 'Failed to update subscription' },
          { status: 500 }
        )
      }
    } else {
      const { error: insertError } = await supabaseAdmin
        .from('subscriptions')
        .insert({
          paypal_order_id: orderId,
          paypal_capture_id: capture.id,
          payer_email: payerEmail,
          payer_id: payerId,
          plan_type: planType,
          amount: paidAmount,
          currency: capture.amount.currency_code,
          status: 'completed',
          expires_at: expiresAt.toISOString(),
        })

      if (insertError) {
        console.error('Error inserting subscription:', insertError)
        return NextResponse.json(
          { error: 'Failed to create subscription' },
          { status: 500 }
        )
      }
    }

    const response = NextResponse.json(
      {
        success: true,
        message: 'Payment verified successfully',
        data: {
          email: payerEmail,
          planType,
          expiresAt: expiresAt.toISOString(),
          orderId,
          captureId: capture.id,
        },
      },
      { status: 200 }
    )

    response.cookies.set('docexpress_session', JSON.stringify({
      email: payerEmail,
      planType,
      expiresAt: expiresAt.toISOString(),
      orderId,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 días
      path: '/',
    })

    return response
  } catch (error) {
    console.error('PayPal verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}