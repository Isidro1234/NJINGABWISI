import Stripe from "stripe";
import {configDotenv} from 'dotenv'
configDotenv()
export const stripeinstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
})