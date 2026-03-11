import { NextResponse } from "next/server"
import { stripeinstance } from "../../lib/stripe";



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