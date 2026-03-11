"use client"
import { createContext, useEffect, useState } from "react"
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { fetchingtoken } from "@/logic/tokenGetting"

const stripepromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
const stripeContext = createContext(null)

export default function StripeContextProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<string | null>(null)

  useEffect(() => {
    async function getToken() {
      const fetching = await fetchingtoken()
      setClient(fetching)
    }
    getToken()
  }, [])

  
  if (!client) return <>{children}</>

  return (
    <stripeContext.Provider value={null}>
      <Elements
        stripe={stripepromise}
        options={{ clientSecret: client }}
      >
        {children}
      </Elements>
    </stripeContext.Provider>
  )
}