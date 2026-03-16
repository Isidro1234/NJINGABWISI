import { NextResponse } from 'next/server'
import { stripeinstance } from '../../lib/stripe'
 
// ── GET — list all services/products ─────────────────────────────────────────
export async function GET() {
  try {
    const products = await stripeinstance.products.list({ limit: 100 })
 
    const services = await Promise.all(
      products.data.map(async (product) => {
        // get the default price for each product
        const prices = await stripeinstance.prices.list({
          product: product.id,
          limit: 1,
          active: true,
        })
        const price = prices.data[0]
        return {
          id: product.id,
          name: product.name,
          description: product.description || '',
          amount: price?.unit_amount || 0,
          currency: price?.currency || 'usd',
          priceId: price?.id || '',
          active: product.active,
          image: product.images?.[0] || null,
        }
      })
    )
 
    return NextResponse.json({ services })
  } catch (error: any) {
    console.error('GET services error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
 
// ── POST — create a new product + price ──────────────────────────────────────
export async function POST(request: Request) {
  try {
    const { name, description, amount, currency, image } = await request.json()
 
    if (!name || !amount || !currency) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
 
    // 1. Create the product
    const product = await stripeinstance.products.create({
      name,
      description: description || undefined,
      images: image ? [image] : [],
    })
 
    // 2. Create a price for the product
    const price = await stripeinstance.prices.create({
      product: product.id,
      unit_amount: amount, // already in cents
      currency,
    })
 
    return NextResponse.json({
      service: {
        id: product.id,
        name: product.name,
        description: product.description,
        amount: price.unit_amount,
        currency: price.currency,
        priceId: price.id,
        active: product.active,
        image: product.images?.[0] || null,
      }
    })
  } catch (error: any) {
    console.error('POST service error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
 
// ── PATCH — activate / deactivate a product ───────────────────────────────────
export async function PATCH(request: Request) {
  try {
    const { serviceId, active } = await request.json()
 
    if (!serviceId) {
      return NextResponse.json({ error: 'serviceId is required' }, { status: 400 })
    }
 
    await stripeinstance.products.update(serviceId, { active })
 
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('PATCH service error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
 
// ── DELETE — archive a product (Stripe doesn't allow hard delete) ─────────────
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
 
    if (!id) {
      return NextResponse.json({ error: 'Product id is required' }, { status: 400 })
    }
 
    // Stripe doesn't allow deleting products that have prices
    // so we archive (deactivate) them instead
    await stripeinstance.products.update(id, { active: false })
 
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('DELETE service error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
 