import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('docexpress_session')

    if (!sessionCookie) {
      return NextResponse.json(
        { isPro: false, error: 'No session found' },
        { status: 401 }
      )
    }

    let sessionData: {
      email: string
      planType: string
      expiresAt: string
      orderId: string
    }

    try {
      sessionData = JSON.parse(sessionCookie.value)
    } catch {
      return NextResponse.json(
        { isPro: false, error: 'Invalid session format' },
        { status: 401 }
      )
    }

    const { email, expiresAt } = sessionData

    const expiryDate = new Date(expiresAt)
    const now = new Date()

    if (expiryDate <= now) {
      return NextResponse.json(
        { isPro: false, error: 'Session expired' },
        { status: 401 }
      )
    }

    const { data: subscription, error: dbError } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('payer_email', email)
      .eq('status', 'completed')
      .gte('expires_at', new Date().toISOString())
      .order('expires_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (dbError) {
      console.error('Database error checking subscription:', dbError)
      return NextResponse.json(
        { isPro: false, error: 'Database error' },
        { status: 500 }
      )
    }

    if (!subscription) {
      return NextResponse.json(
        { isPro: false, error: 'No active subscription' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      {
        isPro: true,
        data: {
          email: subscription.payer_email,
          planType: subscription.plan_type,
          expiresAt: subscription.expires_at,
          orderId: subscription.paypal_order_id,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { isPro: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}