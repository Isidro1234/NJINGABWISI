"use client"
import { createContext, useCallback, useEffect, useState } from "react";
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { fetchingtoken } from "@/logic/tokenGetting";

const stripepromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const stripeContext = createContext(null);
const fetching = await fetchingtoken();
const client = fetching
export default function StripeContextProvider({ children }: { children: React.ReactNode }) {
  

  return (
    <stripeContext.Provider value={null}>
      <Elements
        stripe={stripepromise}
        options={{clientSecret:client}}
      >
        {children}
      </Elements>
    </stripeContext.Provider>
  );
}