export async function fetchingtoken() {
       const ft = await fetch("https:n-jinga.vercel.app/api/create-checkout-session", { method: "POST" }) 
       const res = await ft.json();
       return res.client
    }