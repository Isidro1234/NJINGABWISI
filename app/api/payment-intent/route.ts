import { NextResponse } from "next/server"
import { stripeinstance } from "../../lib/stripe"
 
// ── POST — create a payment intent for a specific service ─────────────────────
export async function POST(request: Request) {
  try {
    const { priceId, userId } = await request.json()
 
    if (!priceId) {
      return NextResponse.json({ error: 'priceId is required' }, { status: 400 })
    }
 
    // Get price details from Stripe
    const price = await stripeinstance.prices.retrieve(priceId)
 
    if (!price.unit_amount) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 })
    }
 
    // Create or get customer
    let customerId: string | undefined
    if (userId) {
      const existing = await stripeinstance.customers.list({ limit: 1, email: userId })
      if (existing.data.length > 0) {
        customerId = existing.data[0].id
      } else {
        const customer = await stripeinstance.customers.create({ metadata: { userId } })
        customerId = customer.id
      }
    }
 
    // Create payment intent
    const paymentIntent = await stripeinstance.paymentIntents.create({
      amount: price.unit_amount,
      currency: price.currency,
      customer: customerId,
      metadata: {
        priceId,
        userId: userId || '',
      },
      automatic_payment_methods: { enabled: true },
    })
 
    return NextResponse.json({
      client: paymentIntent.client_secret,
      amount: price.unit_amount,
      currency: price.currency,
    })
  } catch (error: any) {
    console.error('Payment intent error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}