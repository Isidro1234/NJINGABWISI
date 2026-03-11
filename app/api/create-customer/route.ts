import { NextResponse } from "next/server";
import { stripeinstance } from "../../lib/stripe";



export async function POST(request:Request){
    const data = await request.json();
    try {
        const {email , id} = await data;
        const createcustomer = await stripeinstance.customers.create({
            name:id,
            email,
            balance:0,
        })
        return NextResponse.json({customer_id:createcustomer.id , res:true})  
    } catch (error) {
         return NextResponse.json({customer_id:'not found', res:false})  
    }
    
}