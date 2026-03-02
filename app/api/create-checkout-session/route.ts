import { NextResponse } from "next/server"
import Stripe from "stripe"

export const stripeinstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
})

export async function POST(request: Request) {
    const createcustomer = await stripeinstance.customers.create({

    })
    const session = await stripeinstance.paymentIntents.create({
    amount:2000,
    currency:'usd'  
    });
return NextResponse.json({client:session.client_secret}, {
  headers:{
     "Content-Type": "application/json"
  }
})
}